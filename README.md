# Projeto User Management — NestJS + TypeORM + Postgres + Docker


# Requisitos

Antes de iniciar, certifique-se de ter instalado:

Docker e Docker Compose

Node.js (versão 22 ou superior)

npm (gerenciador de pacotes do Node.js)

# Passos para rodar o projeto

crie um .env

```bash
npm install
docker-compose up -d
npm run migration:run
npm run start:dev # start server at 3001 default port
```

Tests: ``npm run test``
