#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until npx prisma db push >/dev/null 2>&1; do
  echo "  PostgreSQL not ready yet, retrying in 2s..."
  sleep 2
done

echo "Database schema pushed!"

echo "Generating Prisma client..."
npx prisma generate
echo "Prisma client generated!"

echo "Starting Next.js dev server..."
exec npm run dev
