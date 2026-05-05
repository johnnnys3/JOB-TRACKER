#!/bin/bash

# Job Tracker deployment preflight helper.

set -euo pipefail

echo "Job Tracker deployment preflight"
echo "================================"

if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Run this script from the project root."
    exit 1
fi

required_files=(
    "backend/package.json"
    "backend/prisma/schema.prisma"
    "vercel.json"
    "backend/railway.json"
    ".env.example"
    "backend/.env.example"
)

echo ""
echo "Required files"
echo "--------------"
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "OK  $file"
    else
        echo "MISSING  $file"
        exit 1
    fi
done

echo ""
echo "Production build test"
echo "---------------------"
npm run build

(
    cd backend
    npm run build
    npx prisma validate
)

cat <<'INSTRUCTIONS'

Next steps
----------
1. Create production environment variables in Vercel and Railway.
2. Generate a JWT secret outside the repo:
   openssl rand -base64 32
3. Run production migrations before starting the backend:
   cd backend
   DATABASE_URL="your-production-database-url" npx prisma migrate deploy
4. Deploy the backend, confirm /health is reachable, then set NEXT_PUBLIC_API_URL in Vercel to the backend URL.

See DEPLOYMENT.md for the full checklist.
INSTRUCTIONS
