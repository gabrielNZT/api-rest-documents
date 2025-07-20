# API Rest Documents

## 1. Objetivo do Projeto

Este projeto desenvolve uma API RESTful que simula o backend de uma plataforma de documentos. Ele foca em: ingestão e gerenciamento de documentos, autenticação e controle de acesso de usuários, buscas simuladas por IA em documentos e persistência de todos os dados em um banco de dados relacional.

## 2. Tecnologias Utilizadas

*   **Runtime:** Node.js (v20.x)
*   **Framework:** Express
*   **Banco de Dados / ORM:** PostgreSQL (v13.x) com Prisma ORM
*   **Autenticação:** JWT (JSON Web Token)
*   **Upload de Arquivos:** Multer
*   **Containerização:** Docker e Docker Compose
*   **Documentação da API:** Swagger UI
*   **Testes:** Vitest

## 3. Instruções de Configuração

Siga estas etapas para configurar e executar o projeto localmente:

### Pré-requisitos

Certifique-se de ter o seguinte instalado:

*   [Node.js](https://nodejs.org/en/) (v20.x ou superior)
*   [Docker](https://www.docker.com/get-started) (v20.10.x ou superior)
*   [Docker Compose](https://docs.docker.com/compose/install/) (v2.5.x ou superior)

### 3.1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd api-rest-documents
```

### 3.2. Variáveis de Ambiente

Crie um arquivo `.env` no diretório raiz do projeto copiando o arquivo `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e atualize as variáveis conforme necessário. Os valores padrão são:

```env
DATABASE_URL="postgresql://user:password@db:5432/mydatabase?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=3000
```

### 3.3. Iniciar Contêineres Docker

Isso irá construir a imagem da aplicação, instalar as dependências, gerar o cliente Prisma e iniciar o banco de dados PostgreSQL e os contêineres da aplicação Node.js.

```bash
docker compose up -d --build
```

### 3.4. Executar Migrações do Prisma

Aplique as migrações do esquema do banco de dados. Este comando precisa ser executado depois que o contêiner do banco de dados estiver em execução.

```bash
docker compose exec app npx prisma migrate dev --name init --schema=./src/prisma/schema.prisma
```

### 3.5. Executar a Aplicação

A aplicação já deve estar em execução dentro do contêiner Docker. Se você precisar reiniciá-la ou executá-la fora do Docker para desenvolvimento, você pode usar:

```bash
npm start
npm run dev
```

## 4. Documentação da API (Swagger UI)

Assim que a aplicação estiver em execução, você pode acessar a documentação da API via Swagger UI em:

`http://localhost:3000/api-docs`

## 5. Executar Testes

Para executar os testes automatizados usando Vitest:

```bash
npm test
```