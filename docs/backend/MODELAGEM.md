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

#### Tradeoff da Abordagem

O que falei anteriormente é válido apenas para transações de *ganho* de dinheiro. Quando há gasto (comprando sementes, por exemplo), o usuário teria de manualmente fazer a conta do valor total gasto, o que não seria nada conveniente.

#### Possível Solução

Uma forma simples de resolver isso sem alterar tanto as tabelas em si, é adicionar um único campo de preço individual e, **no servidor, onde moram as regras de negócio**, definir que transações de *ganho* devem receber do client preço total e as de *gasto* receber preço individual (o que entra no tópico da próxima coluna que vou abordar).

#### Outras Alternativas

API de dados do Stardew Valley. Isso faria com que eu pudesse utilizar o preço dos itens diretamente de lá, o que sinceramente me pouparia um grande trabalho e evitaria dados inconsistentes. O problema? Não existe uma consolidada, apenas algumas que mal foram iniciadas, então o sistema tem que funcionar da forma que fiz.

---
### Coluna: Tipo da Transação

Não vou mentir, no início eu cometi um deslize e acabei esquecendo de algo (muito) bobo e só lembrei enquanto desenvolvia: sistemas financeiros não tem só ganhos, mas também gastos. Não sei o que houve, mas minha mente estava completamente focada apenas nas transações de ganho e de como iriam funcionar.

Quando me dei conta achei que era tarde e teria que remodelar o Banco de Dados. Porém, como seria desagradável pra mim, expliquei a situação para uma IA e ela me sugeriu um simples ENUM (que é suportado pelo PostgreSQL) dizendo se a transação é de ganho ou de gasto e, na verdade, isso faz muito sentido!

É simples, é suficiente para resolver o problema e o mais importante: pode ser usado como condição para diferentes comportamentos dependendo do tipo da transação (como vimos que seria necessário no tópico passado).

#### Tradeoff da Abordagem

Queria muito dizer que não tem, e olhando de forma realista, realmente não parece ter. Porém, olhando de forma mais ampla, dá para dizer que o ponto negativo disso é que, como PostgreSQL é o SGBD relacional mais robusto e padrão de mercado de hoje em dia, ele é o único (pelo que sei) que permite colunas do tipo ENUM (além de JSON e dentre outras coisas).

Todavia, é por isso mesmo que falando de forma realista, não consigo pensar no ponto negativo. É **muito** difícil que o banco vá mudar para outro, não existe motivos para isso acontecer no futuro. Seria diferente se, por exemplo, o projeto tivesse iniciado com SQLite, um banco de dados com a proposta de ser simples tanto no sentido de recursos, quanto no sentido de funcionamento (único arquivo, dificuldade em lidar com escritas simultâneas, etc).

#### Possível Solução

Como já explicado, a utilização de uma coluna ENUM.

#### Outras Alternativas

Remodelar o banco de dados utilizando de tabelas relacionadas entre si.

### Coluna: Qualidade

Além do propósito de ajudar na filtragem dos dados que aparecerão no client (exemplo: quantos items de qualidade dourada tiveram nessa transação?), a qualidade também afeta o preço dos itens. Cada nível mais alto aumenta o multiplicador sobre o valor do item, o que faz essa coluna ser de extrema importância para o sistema.

#### Tradeoff da Abordagem

Não há.

#### Possível Solução

Não há.

#### Outras Alternativas

Não há.

---
### Coluna: Está Deletada

Não há muito o que se falar. Para fins de registro e auditoria (importante nesse tipo de sistema), a aplicação faz um `soft delete` das transações apagadas. Elas não podem ser alteradas ou deletadas de fato, apenas visualizadas. Como é apenas um projeto de aprendizado e demonstração (e um MVP), não estou dando tanta atenção à LGPD.

#### Tradeoff da Abordagem

A depender de com quais registros é feito, o `soft delete` obrigatório pode ferir a LGPD. Além disso, ao menos no MVP, o dado não é permanentemente apagado de nenhuma forma (que não seja enviar comandos SQL diretamente).

#### Possível Solução

Aplicar uma forma do usuário poder deletar permanentemente os registros das transações se ele quiser.

#### Outras Alternativas

Não há.
