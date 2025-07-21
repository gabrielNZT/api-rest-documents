# API Rest Documents

## 1\. Objetivo do Projeto (Atualizado)

Este projeto desenvolve uma API RESTful que simula o backend de uma plataforma de documentos. Ele foca em: ingestão e gerenciamento de documentos, autenticação de usuários, **análise de conteúdo e respostas a perguntas através da integração com a LLM Google Gemini 1.5 Flash**, e persistência de todos os dados em um banco de dados relacional.

## 2\. Tecnologias Utilizadas (Atualizado)

  * **Runtime:** Node.js (v20.x)
  * **Framework:** Express
  * **Banco de Dados / ORM:** PostgreSQL (v13.x) com Prisma ORM
  * **Autenticação:** JWT (JSON Web Token)
  * **Upload de Arquivos:** Multer
  * **Containerização:** Docker e Docker Compose
  * **Documentação da API:** Swagger UI
  * **Testes:** Vitest
  * **Inteligência Artificial:** Google Gemini 1.5 Flash via [Google AI SDK](https://www.npmjs.com/package/@google/generative-ai)

## 3\. Instruções de Configuração

Siga estas etapas para configurar e executar o projeto localmente:

### Pré-requisitos

Certifique-se de ter o seguinte instalado:

  * [Node.js](https://nodejs.org/en/) (v20.x ou superior)
  * [Docker](https://www.docker.com/get-started) (v20.10.x ou superior)
  * [Docker Compose](https://docs.docker.com/compose/install/) (v2.5.x ou superior)

### 3.1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd api-rest-documents
```

### 3.2. Variáveis de Ambiente (Atualizado)

Crie um arquivo `.env` no diretório raiz do projeto copiando o arquivo `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e atualize as variáveis. Os valores padrão e as novas chaves da IA são:

```env
# Configuração do Banco de Dados e Servidor
DATABASE_URL="postgresql://user:password@db:5432/mydatabase?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=3000

# --- Configuração da Inteligência Artificial ---
# Sua chave de API obtida no Google AI Studio
GEMINI_API_KEY="sua_chave_api_aqui" 

# Feature Flag para ativar a IA. 
# Defina como 'true' para usar a API do Gemini.
# Defina como 'false' ou remova a linha para usar uma resposta mockada para testes. (utilizando quando não tiver chave api do gemini)
USE_IA=true
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

## 4\. Documentação da API (Swagger UI)

Assim que a aplicação estiver em execução, você pode acessar a documentação da API via Swagger UI em:

`http://localhost:3000/api-docs`

## 5\. Funcionalidade de Inteligência Artificial (Nova Seção)

A API possui um endpoint (`POST /queries`) para realizar perguntas sobre o conteúdo de um documento previamente enviado. Esta funcionalidade é controlada pela variável de ambiente `USE_IA`.

### Como Funciona

1.  **Requisição:** O usuário envia uma pergunta e o `datasetId` do documento a ser analisado.
2.  **Recuperação de Contexto:** O sistema busca no banco de dados o texto que foi extraído do arquivo (PDF ou CSV) associado àquele `datasetId`.
3.  **Contextualização do Prompt:** Em vez de enviar apenas a pergunta para a IA, a aplicação monta um *prompt* contextualizado, instruindo o **Gemini 1.5 Flash** a atuar como um especialista em análise de documentos e a basear sua resposta **exclusivamente** no texto fornecido. Isso garante respostas mais precisas e evita que a IA "alucine" ou invente informações.
4.  **Resposta:** A resposta gerada pelo Gemini é retornada ao usuário e salva no histórico de consultas.

Se `USE_IA` for definido como `false`, o sistema utilizará uma função de mock local para simular a resposta, permitindo o desenvolvimento e testes sem custos de API.

## 6\. Executar Testes

Para executar os testes automatizados usando Vitest:

```bash
npm test
```