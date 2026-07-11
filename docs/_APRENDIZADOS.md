# Aprendizados

---
## Validação de Dados e Schemas

### 1. Método `.extend()` do Zod

Ao lidar com tabelas que firmam relações com outras, ao invés de aninhar os dados no schema de forma que a tabela relacionada seja um campo junto aos outros no mesmo `z.Object`, ele deve ser acrescentado *depois* com o método `.extend()`, como pode ser observado [AQUI](../api/src/modules/transactions/dto/transactions.dto.ts).

### 2. Método `.strict()` do Zod

Faz com que, ao invés de ignorar chaves extras adicionadas ao corpo da requisição e execute de qualquer forma (comportamento padrão), o Zod barre qualquer requisição que não seja *estritamente* igual ao schema definido.

### 3. Importação do Prisma Client e Conversão em Tipo Zod

Utilizando o Prisma Client, é possível importar e usar no código os enums e modelos presentes no `schema.prisma` para moldar de forma mais precisa os schemas.

PS: Os modelos não devem ser usados "diretamente", mas convertidos em tipos zod com o método `.ZodType<Modelo>`, o qual *não podem* ser diretamente aplicados à(s) variável(is) do(s) schema(s), pois faz com que perca as propriedades do `z.Object`; ao invés disso, o ideal é que se use `satisfies z.ZodType<Modelo>` ao final da linha.

---
## Classes

### 1. Implementação de Interfaces

Todas as propriedades e métodos presentes na classe *que vieram de uma [interface](../api/src/modules/transactions/transactions.service.interface.ts) implementada* devem ser públicos. Mesmo assim, a [classe](../api/src/modules/transactions/transactions.service.ts) ainda pode possuir propriedades e métodos (públicos, protegidos ou privados) não existentes na interface.

### 2. Comportamento do `readonly`

Esta é uma palavra reservada que indica que a propriedade da classe definida no construtor **não pode ser modificada**, mas pode ser livremente utilizada e ter seu conteúdo (se for um array ou objeto) alterado, garantindo segurança da propriedade.

### 3. Perda de Contexto do `this`

Quando é passado um método para o Fastify, a função é "solta" da classe, o que faz com que o `this` fique indefinido, quebrando toda a lógica interna. Para resolver isso, as soluções são:

1. Criar um bind para "forçar de volta" o método à classe (visualmente desagradável, mas resolve): `fastify.post('/users', userController.create.bind(userController))`
2. Utilizar Arrow Functions ao invés de funções padrão para criar os métodos da classe: `const create = async (request: FastifyRequest<{ Body: CreateDTO }>, reply: FastifyReply) => { ... }`

---
## Regras de Negócio

### 1. Total da Transação

Não tem sentido deixar que o client envie o total da transação entre os dados do request, sendo que ele já envia o valor de cada item.

Ao invés de confiar no client, o servidor faz o cálculo interno e guarda no Banco de Dados a soma exata do valor total de todos os itens, resultando no valor final da transação.

Outros aspectos ainda devem ser alterados futuramente (cálculo automático com multiplicador de valor baseado na qualidade, por exemplo) para maior assertividade.

### 2. Atomicidade

Para mantimento da simplificação do MVP, o projeto deve gerenciar os itens inteiramente através das transações. Todos os registros de item devem ser diretamente ligados à uma transação, e uma transação não pode existir sem itens.

Ou seja: para garantir que todos os itens enviados na transação (financeira) sejam devidamente manipulados no request, são necessárias as transações de Banco de Dados para manter a consistência.

Nesse caso, se algum item não for criado num `POST` por qualquer motivo, a consulta não se completa e o banco volta ao estado anterior.

---
## Banco de Dados

### 1. Transações no Prisma

Podem ser feitas de duas formas:

1. Simplificada e gerenciada pelo prisma, via *Nested Writes*:

``` typescript
async create(dto: TransactionCreateDTO) {
  // 1. Cálculo do total
  const calculatedTotal = dto.items.reduce((sum, item) => sum + item.totalPrice, 0);

  // 2. Criação aninhada
  return await this.prisma.transactions.create({
    data: {
      title: dto.title,
      totalValue: calculatedTotal,
      day: dto.day,
      season: dto.season,
      type: dto.type,
      // Aqui transação e itens criados ao mesmo tempo
      items: {
        create: dto.items // O Prisma entende que deve criar esses registros na tabela 'items'
      }
    },
    // O 'include' serve para a API retornar a transação JÁ COM os itens dentro
    include: {
      items: true 
    }
  });
}
```

2. Mais complexa, porém que oferece maior controle e performance:

``` typescript
return await this.prisma.$transaction(async (tx) => {
  
  // 2. Usamos 'tx' (o cliente da transação) em vez de 'this.prisma'
  // Criamos a transação principal. O banco gera o ID aqui.
  const transaction = await tx.transactions.create({ 
    data: { 
      title: dto.title, 
      totalValue: calculatedTotal, 
      // ... outros campos
    } 
  });

  // 3. Agora que temos o 'transaction.id', podemos criar os itens
  // Mapeamos os itens do DTO para incluir o ID da transação que acabamos de criar
  const itemsToCreate = dto.items.map(item => ({
    ...item,
    transactionsId: transaction.id // Vinculando o item ao "pai"
  }));

  // 4. Salva todos os itens de uma vez
  await tx.items.createMany({ 
    data: itemsToCreate 
  });

  // 5. Se chegou aqui sem erros, o Prisma faz o "COMMIT" (salva tudo definitivamente)
  return transaction;
});
```

Além disso, o Prisma **não aceita** update em massa para relações 1:N (um-para-muitos) da forma simplificada. As soluções existentes são:

1. Deletar e recriar todos os registros relacionados à tabela principal (escolhido neste projeto pela simplicidade)
2. Atualizar um por um

PS (1): Existe ainda a estratégia com `upsert`, que é a mais performática e que mantém maior integridade, porém também é a mais complexa e de difícil manutenção
PS (2): Para a primeira solução, é importante que o client reenvie TODOS os registros da tabela relacionada, mesmo os que não foram atualizados

Decisões acerca da modelagem de dados [AQUI](./backend/MODELAGEM.md)

### 2. Tipos de Cláusulas no Prisma

As cláusulas dentro do objeto passado em `args` numa operação do Prisma possuem tipos, permitindo com que elas sejam construídas separadamente da operação seguindo um contrato rígido, o que impede erros e possibilita [certas coisas](./backend/MODELAGEM.md#all-em-seasons-solucao) serem feitas.

---
## Fastify

### 1. Formato da Rota

Sempre utilizar o genérico do `fastify.[MÉTODO]` para definir o que deve vir da requisição, dessa forma:

``` typescript
fastify.get<{ Querystring: { limit: number, offset: number } }>(
  '/',
  { preHandler: authMiddleware },
  transactionsController.list
)
```
