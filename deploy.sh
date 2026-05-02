#!/bin/bash

# Job Tracker Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Job Tracker Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Function to generate secure JWT secret
generate_jwt_secret() {
    openssl rand -base64 32
}

echo ""
echo "📋 Pre-deployment Checklist"
echo "============================"

# Check if required files exist
required_files=(
    "backend/package.json"
    "backend/prisma/schema.prisma"
    "vercel.json"
    "backend/railway.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🔧 Environment Setup"
echo "===================="

# Generate JWT secret if not exists
if ! grep -q "your-super-secure-jwt-secret" backend/.env.production 2>/dev/null; then
    echo "✅ JWT secret already configured"
else
    echo "🔐 Generating secure JWT secret..."
    JWT_SECRET=$(generate_jwt_secret)
    sed -i.bak "s/your-super-secure-jwt-secret-for-production-min-32-chars/$JWT_SECRET/" backend/.env.production
    echo "✅ JWT secret generated and saved"
fi

echo ""
echo "📦 Production Build Test"
echo "========================"

# Test frontend build
echo "Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Test backend build
echo "Building backend..."
cd backend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

cd ..

echo ""
echo "🎯 Deployment Instructions"
echo "============================"

echo "1. 📊 Database Setup:"
echo "   - Create account at https://neon.tech"
echo "   - Create new project and copy connection string"
echo "   - Update DATABASE_URL in backend/.env.production"
echo "   - Run: cd backend && DATABASE_URL=\"your-neon-url\" npx prisma migrate deploy"

echo ""
echo "2. 🚂 Backend Deployment (Railway):"
echo "   - Create account at https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Configure environment variables (see DEPLOYMENT.md)"
echo "   - Deploy and note the Railway URL"

echo ""
echo "3. 🌐 Frontend Deployment (Vercel):"
echo "   - Create account at https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Set NEXT_PUBLIC_API_URL to your Railway URL"
echo "   - Deploy"

echo ""
echo "4. 🔗 Post-Deployment:"
echo "   - Update CORS_ORIGIN in Railway with Vercel URL"
echo "   - Test all functionality"
echo "   - Configure custom domain if desired"

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "✅ Pre-deployment checks complete!"
