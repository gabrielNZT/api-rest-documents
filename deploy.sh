#!/bin/sh

echo "Starting deployment process..."
echo "starting docker..."
docker compose up -d --build

sleep 15

echo "Running database migrations..."
npx prisma migrate deploy --schema=src/prisma/schema.prisma

