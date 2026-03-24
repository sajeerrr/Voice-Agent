d#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
# Simple wait loop — tries to connect every 2 seconds
until npx prisma db push 2>/dev/null; do
  echo "  PostgreSQL not ready yet, retrying in 2s..."
  sleep 2
done

echo "Database schema pushed!"

echo "Generating Prisma client..."
npx prisma generate
echo "Prisma client generated!"

echo "Starting Next.js dev server..."
exec npm run dev
