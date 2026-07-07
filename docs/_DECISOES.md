# Decisões Estratégicas

## 1. Projeto Escolhido

Dada a natureza dos projetos existentes no site da MyByte, a primeira ideia considerada foi uma plataforma de finanças agrícolas simplificada.

**Por quê foi modificada:** levando em conta que não sei muito sobre agronegócio real, mas já joguei muito Stardew Valley, um jogo de fazenda com sua própria economia, preferi adaptar o sistema a esse cenário. Também pode evoluir para ser algo útil não só para mim, como também para outros jogadores avançados.

## 2. Docker Compose

Como não será um projeto lançado na internet (ao menos, por enquanto), a utilização de Docker Compose para o Banco de Dados PostgreSQL (e, posteriormente, para as imagens da API e do website) foi considerada positiva, tendo em vista que é um conhecimento que já possuo (zero curva de aprendizado) e de fácil aplicação.

## 3. Monolito Modular

Pelo escopo e intuito do projeto, é o meio termo perfeito entre simplicidade, escalabilidade e demonstração de boas práticas e código limpo.

A arquitetura da API "envelopa" tudo relacionado às funcionalidades do sistema em `modules/`, cada uma em um subdiretório com nome descritivo. Enquanto isso, outras partes importantes para o funcionamento do sistema se localizam em subdiretórios de `src/`, de forma organizada

## 4. POO e SOLID

Além de demonstrar que sei trabalhar com esse paradigma, optei por ele pelo alto nível de organização que ele traz para o código. Junto dele, SOLID também se aplica na API, evitando que implementações de alto nível dependam diretamente de implementações de baixo nível, mas fazendo com que dependam sempre de contratos rígidos que dizem estritamente o que a classe possui e pode fazer. E claro, a separação clara de responsabilidades também se faz presente

## 5. DTOs

O uso de DTOs é imprescindível para que todos os dados que entram e saem estejam no formato adequado, com seus campos também corretamente tipados. Utilizei a biblioteca utilitária `zod` para isso, pois é extremamente simples e amplamente utilizada.

Note que os schemas criados em um único arquivo podem ser utilizados tanto em validações de funções e variáveis comuns, quanto para as requisições e respostas.

## 6. Autenticação via API KEY

Medida de segurança adotada no lugar de autenticação "padrão" para evitar trabalho extra na versão inicial do projeto. Autenticação JWT é essencial em quase todo tipo de sistema, porém é trabalhosa de implementar (para quem ainda não tem costume) e não é o foco de demonstração do desenvolvimento desse sistema.

E já que a autenticação é feita dessa forma, o responsável por ela é um único arquivo `auth.ts`, utilizado como middleware em todas as rotas protegidas.

## 7. Usuário Único

Assim como no tópico anterior, essa decisão foi tomada para focar no desenvolvimento do que realmente importa primeiro. Logo: não existe tabela de usuários: se a chave bater com a existente no `.env` do servidor, você está autorizado.

E falando em autorização, obviamente o único usuário possui permissão para tudo. Se ele for "deslogado", a única coisa que o client pode requisitar é o `/health` (a não ser que reenvie a API KEY).
