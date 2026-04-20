# Job Tracker - Deployment Guide

## Overview
This guide covers deploying the Job Tracker application to production using Vercel (frontend), Railway (backend), and Neon (database).

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Accounts on Vercel, Railway, and Neon
- Domain name (optional)

## 1. Database Setup (Neon)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up and create a new project

2. **Get Connection String**
   - In Neon dashboard, go to your project
   - Copy the connection string from Connection Details
   - Format: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/job_tracker?sslmode=require`

3. **Run Migration**
   ```bash
   cd backend
   DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
   npx prisma generate
   ```

## 2. Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment Variables**
   In Railway project settings, add:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=generate-secure-32-char-secret
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   FRONTEND_URL=https://your-vercel-app.vercel.app
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

3. **Deploy**
   - Railway will automatically detect and deploy
   - Wait for build to complete
   - Note your Railway URL (e.g., `job-tracker-production.up.railway.app`)

## 3. Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository

2. **Configure Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
   ```

3. **Deploy**
   - Vercel will automatically detect Next.js and deploy
   - Wait for build to complete
   - Note your Vercel URL

## 4. Post-Deployment Configuration

1. **Update CORS Origins**
   - Go back to Railway environment variables
   - Update `FRONTEND_URL` and `CORS_ORIGIN` with your Vercel URL

2. **Test the Application**
   - Visit your Vercel URL
   - Test registration, login, and application CRUD
   - Verify all features work correctly

## 5. Custom Domain (Optional)

### Vercel (Frontend)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Railway (Backend)
1. In Railway dashboard, go to Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Environment Variables Summary

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
```

### Backend (Production)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/job_tracker?sslmode=require
JWT_SECRET=your-super-secure-jwt-secret-for-production-min-32-chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=https://your-frontend-url.vercel.app
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure CORS_ORIGIN matches your frontend URL exactly
2. **Database Connection**: Verify SSL mode is enabled in connection string
3. **Build Failures**: Check logs for missing dependencies or environment variables
4. **Authentication Issues**: Verify JWT_SECRET is set and consistent

### Health Checks
- Backend health: `https://your-backend-url.railway.app/health`
- Frontend should be accessible at your Vercel URL

## Security Notes

1. **JWT Secret**: Use a cryptographically secure secret (minimum 32 characters)
2. **Database**: Always use SSL connections in production
3. **Environment Variables**: Never commit secrets to Git
4. **HTTPS**: Ensure both frontend and backend use HTTPS

## Monitoring

- Vercel provides built-in analytics and logs
- Railway offers deployment logs and metrics
- Neon provides database performance monitoring
