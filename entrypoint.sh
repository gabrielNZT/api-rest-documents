#!/bin/sh

# Aplica as migrações do banco de dados
echo "Running database migrations..."
npx prisma migrate deploy

# Inicia a aplicação principal
echo "Starting the application..."
exec "$@"