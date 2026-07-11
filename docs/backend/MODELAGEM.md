# Modelagem do Banco de Dados

Para modelar as tabelas, duas formas de pensar foram o núcleo, a força central que motivou a existência de cada campo e do comportamento das tabelas: **simplicidade e pragmatismo**.

Algumas razões que levam à isso:

1. Este não é um sistema de natureza que exige robustez e complexidade, como ecommerces, ERPs ou aplicações de finanças reais, o que permite tornar enxuta a modelagem dos dados.
2. Pelo intuito por trás do desenvolvimento do projeto, devo terminar sua versão funcional o quanto antes. Isso faz com que o tradeoff de transformar uma possível tabela inteira em um único campo, ou de criar uma tabela gerenciada por outra ao invés de possuir seu próprio CRUD, seja completamente aceitável e viável se bem aplicado.
3. Eu prezo pela eficiência acima de quantidade de recursos. Se os campos e tabelas existentes são suficientes para cobrir o papel que o sistema deve cumprir e resolverem bem o problema do usuário, é o bastante. Entretanto, isso **não impede** que a modelagem seja revisada posteriormente (no caso desse projeto em específico, pelo menos) para se adequar a melhorias e atualizações no funcionamento da aplicação.
4. O MVP do sistema foi projetado para suportar apenas transações de itens inicialmente. Depois de finalizado e testado, suportará outros tipos de gasto também.

## Decisões da Modelagem

### Tabela: Itens

[TODO]

---
### Relacionamento: Transações-Itens

[TODO]

---
### Coluna: Preço Total

Pode parecer falha minha e, por um momento, até esqueci o porquê da decisão e realmente achei que tivesse sido (por isso é bom documentar!), mas na verdade é uma regra de negócio que vem da forma como funciona o Stardew Valley (jogo no qual esse pseudo sistema de gestão financeira se baseia).

No Stardew Valley (sem mods), o jogador geralmente só pode ver o preço individual de um item de duas formas: com uma habilidade que ele pode conseguir bem depois ou *vendendo o item isoladamente* pois, ao vender vários do mesmo item (de mesma qualidade) o valor se acumula e o jogador consegue ver apenas o que ganhou do conjunto de itens.

Num Gerenciador de Finanças normal (acredito eu), o correto seria: usuário define *valor individual* (que obviamente ele sabe) e quantidade -> sistema multiplica um pelo outro -> o resultado é o valor total do item específico.

No FAVO, onde o usuário pode não saber o valor individual do item: usuário define *valor total* (que viu na caixa de vendas) e quantidade -> sistema **relaciona** um com o outro -> se necessário, o valor individual pode ser obtido da *divisão* entre o valor total e a quantidade (e isso **sempre funciona**, pois o dinheiro do jogo e valor dos itens apenas possuem números inteiros!).

#### Tradeoff da Abordagem {#preco-total-tradeoff}

O que falei anteriormente é válido apenas para transações de *ganho* de dinheiro. Quando há gasto (comprando sementes, por exemplo), o usuário teria de manualmente fazer a conta do valor total gasto, o que não seria nada conveniente.

#### Possível Solução {#preco-total-solucao}

Uma forma simples de resolver isso sem alterar tanto as tabelas em si, é adicionar um único campo de preço individual e, **no servidor, onde moram as regras de negócio**, definir que transações de *ganho* devem receber do client preço total e as de *gasto* receber preço individual (o que entra no tópico da próxima coluna que vou abordar).

#### Outras Alternativas {#preco-total-alternativas}

API de dados do Stardew Valley. Isso faria com que eu pudesse utilizar o preço dos itens diretamente de lá, o que sinceramente me pouparia um grande trabalho e evitaria dados inconsistentes. O problema? Não existe uma consolidada, apenas algumas que mal foram iniciadas, então o sistema tem que funcionar da forma que fiz.

---
### Coluna: Tipo da Transação

Não vou mentir, no início eu cometi um deslize e acabei esquecendo de algo (muito) bobo e só lembrei enquanto desenvolvia: sistemas financeiros não tem só ganhos, mas também gastos. Não sei o que houve, mas minha mente estava completamente focada apenas nas transações de ganho e de como iriam funcionar.

Quando me dei conta achei que era tarde e teria que remodelar o Banco de Dados. Porém, como seria desagradável pra mim, expliquei a situação para uma IA e ela me sugeriu um simples ENUM (que é suportado pelo PostgreSQL) dizendo se a transação é de ganho ou de gasto e, na verdade, isso faz muito sentido!

É simples, é suficiente para resolver o problema e o mais importante: pode ser usado como condição para diferentes comportamentos dependendo do tipo da transação (como vimos que seria necessário no tópico passado).

#### Tradeoff da Abordagem {#tipo-da-transacao-tradeoff}

Queria muito dizer que não tem, e olhando de forma realista, realmente não parece ter. Porém, olhando de forma mais ampla, dá para dizer que o ponto negativo disso é que, como PostgreSQL é o SGBD relacional mais robusto e padrão de mercado de hoje em dia, ele é o único (pelo que sei) que permite colunas do tipo ENUM (além de JSON e dentre outras coisas).

Todavia, é por isso mesmo que falando de forma realista, não consigo pensar no ponto negativo. É **muito** difícil que o banco vá mudar para outro, não existe motivos para isso acontecer no futuro. Seria diferente se, por exemplo, o projeto tivesse iniciado com SQLite, um banco de dados com a proposta de ser simples tanto no sentido de recursos, quanto no sentido de funcionamento (único arquivo, dificuldade em lidar com escritas simultâneas, etc).

#### Possível Solução {#tipo-da-transacao-solucao}

Como já explicado, a utilização de uma coluna ENUM.

#### Outras Alternativas {#tipo-da-transacao-alternativas}

Remodelar o banco de dados utilizando de tabelas relacionadas entre si.

### Coluna: Qualidade

Além do propósito de ajudar na filtragem dos dados que aparecerão no client (exemplo: quantos items de qualidade dourada tiveram nessa transação?), a qualidade também afeta o preço dos itens. Cada nível mais alto aumenta o multiplicador sobre o valor do item, o que faz essa coluna ser de extrema importância para o sistema.

#### Tradeoff da Abordagem {#qualidade-tradeoff}

Não há.

#### Possível Solução {#qualidade-solucao}

Não há.

#### Outras Alternativas {#qualidade-alternativas}

Não há.

---
### Coluna: Está Deletada

Não há muito o que se falar. Para fins de registro e auditoria (importante nesse tipo de sistema), a aplicação faz um `soft delete` das transações apagadas. Elas não podem ser alteradas ou deletadas de fato, apenas visualizadas. Como é apenas um projeto de aprendizado e demonstração (e um MVP), não estou dando tanta atenção à LGPD.

#### Tradeoff da Abordagem {#esta-deletada-tradeoff}

A depender de com quais registros é feito, o `soft delete` obrigatório pode ferir a LGPD. Além disso, ao menos no MVP, o dado não é permanentemente apagado de nenhuma forma (que não seja enviar comandos SQL diretamente).

#### Possível Solução {#esta-deletada-solucao}

Aplicar uma forma do usuário poder deletar permanentemente os registros das transações se ele quiser.

#### Outras Alternativas {#esta-deletada-alternativas}

Não há.

---
### Valor de Enum: ALL em SEASONS

Essa é uma decisão bem específica, porém importante de destacar aqui. Antes de tudo: eu ***sei*** que colocar um valor que não corresponde à categoria do enum ("TODAS" não é uma estação do ano) não é correto, portanto, não utilizei desse artifício à toa, porém como workaround ("solução alternativa", de acordo com o tradutor) temporário para resolver o problema que tive.

Problema esse que foi: como posso adicionar filtros opcionais à listagem de transações sem que o Prisma me bloqueie por tentar enfiar um valor nulo numa cláusula `WHERE` e sem fazer o método `list()` ficar um extenso lar de `if (filter.[FILTRO]) { return await ... }`? A conclusão que cheguei foi utilizar de valores padrão. Se o valor for nulo, eu forço o valor padrão e tudo certo, simples, não? Errado!

Isso pode se aplicar para todos outros tipos de dado, como números e booleanos, mas não para `Enums`. Se eu definisse um valor como padrão, ficaria preso em só poder enviar transações de determinada estação do ano, nunca de todas elas. o "ALL" foi para servir de condição caso o Client queira as transações de *todas* as estações do ano.

#### Tradeoff da Abordagem {#all-em-seasons-tradeoff}

Essa solução tem **DOIS** problemas, e o primeiro deles só pensei agora que estou registrando.

1. **Performance** (o menos preocupante no *caso específico* desse projeto)**:** Se houver 1 filtro enviado, por qualquer que seja, todos os outros também são automaticamente preenchidos com os valores padrão. Isso significa que mesmo que teoricamente haveria apenas uma checagem `WHERE`, agora **todos** os filtros serão verificados, mesmo que não fossem enviados e que não faça diferença na prática. Isso faz com que o banco precise fazer mais operações e, consequentemente, demore mais para retornar o resultado. Felizmente, não são tantos filtros existentes e o escopo do projeto permite tranquilamente um atraso mínimo desses.
2. **Poluição de Domínio:** Se trata justamente do que expliquei no início desse tópico. Modelagem de Dados deve ser **exata**. Colocar um valor que não corresponde ao domínio do `Enum` (ou coluna que não corresponde ao domínio da tabela) torna as coisas confusas e eventualmente, a modelagem numa bagunça.

#### Possível Solução {#all-em-seasons-solucao}

Depois de aplicar a solução, comentei a situação para uma IA e ela me revelou como normalmente desenvolvedores mais experientes fazem nessa situação utilizando um código exemplo:

> o "truque" que a galera costuma usar no backend com Prisma para sumir com os ifs e os ENUMs artificiais é montar o objeto where de forma dinâmica no TypeScript antes de mandar para o banco. Seria algo mais ou menos assim:

``` typescript
// Você cria um objeto 'where' vazio e tipado pelo Prisma
const whereClause: Prisma.TransactionWhereInput = {};

// Você só popula a propriedade se ela realmente fizer sentido
if (dto.season) {
  whereClause.season = dto.season;
}

if (dto.minAmount || dto.maxAmount) {
  whereClause.totalValue = {
    gte: dto.minAmount ?? 0,
    lte: dto.maxAmount ?? 9999999 // O limite padrão que você colocou!
  };
}

// Na hora de chamar o Prisma, você passa o objeto montado
const transactions = await prisma.transaction.findMany({
  where: whereClause
});
```

PS: não apliquei essa solução pois não sabia da existência do `Prisma.TransactionWhereInput` e não pensei na possibilidade de montar *apenas* o valor de `where:` de forma separada. Mesmo assim, raciocinei, não desisti e cheguei numa solução que possui tradeoffs aceitáveis para o caso.

#### Outras Alternativas
<a id="all-em-seasons-alternativas" />

Não tenho certeza, mas criar uma nova tabela com um campo que pode ser nulo para o enum "SEASON", apenas para ser usada na ocasião de filtragem. Entretanto, considero que traria **tradeoff pior**, pois aumentaria a complexidade a troco de muito pouco, fazendo essa solução não compensar.
