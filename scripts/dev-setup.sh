#!/usr/bin/env bash
set -e
echo "🔄 Spinning up local Postgres via Docker..."
docker compose up -d db
echo "⏳ Waiting for Postgres..."
until docker exec $(docker compose ps -q db) pg_isready -U nexbid >/dev/null 2>&1; do sleep 1; done
echo "✅ Database ready — running Prisma migrations & seed"
export DATABASE_URL="postgresql://nexbid:nexbid@localhost:5432/nexbid_dev"
npx prisma migrate deploy
npx prisma db seed
echo "🎉 Dev DB initialized!" 