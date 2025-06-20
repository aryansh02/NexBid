#!/usr/bin/env bash
set -e
echo "🔄 Spinning up local Postgres via Docker..."
docker compose up -d db
echo "⏳ Waiting for Postgres..."
until docker exec $(docker compose ps -q db) pg_isready -U nexbid >/dev/null 2>&1; do sleep 1; done
echo "✅ Database ready — running Prisma migrations & seed"
export DATABASE_URL="postgresql://nexbid:nexbid@localhost:5432/nexbid_dev"

# Create temporary .env for both API and Web to pick up DATABASE_URL
echo "DATABASE_URL=$DATABASE_URL" > .env
echo "FRONTEND_URL=http://localhost:3000" >> .env
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" >> .env
echo "JWT_SECRET=devsecret" >> .env
echo "PORT=8080" >> .env
echo "NODE_ENV=development" >> .env

npx prisma migrate dev --name init
npx prisma db seed
echo "🎉 Dev DB initialized!" 