# Job Tracker

Job Tracker is a full-stack application for managing a job search pipeline. It helps users track applications, interviews, tags, status changes, notes, and analytics from one authenticated workspace.

## Features

- Email/password registration and login with JWT auth stored in httpOnly cookies
- Protected dashboard routes
- Application CRUD with pagination, filtering, and search
- Interview tracking per application
- User-scoped tags
- Analytics summary for applications, statuses, interviews, and offer rate
- Profile settings
- Password reset email flow
- Rate limiting, CORS hardening, security headers, request logging, and standardized API errors
- Frontend loading, error, offline, toast, and empty states
- Deployment config for Vercel, Railway, and PostgreSQL/Neon

## Tech Stack

Frontend:
- Next.js 15
- React 18
- TypeScript
- TanStack Query
- Tailwind CSS
- Radix UI primitives
- Lucide icons

Backend:
- NestJS 11
- Prisma ORM
- PostgreSQL
- Passport JWT
- bcrypt
- class-validator
- Jest

## Project Structure

```text
.
|-- app/                 # Next.js app routes
|-- components/          # Shared frontend components
|-- contexts/            # React providers
|-- hooks/               # TanStack Query hooks
|-- services/            # Frontend API clients
|-- tests/               # Frontend/e2e smoke scripts
|-- types/               # Shared frontend types
|-- backend/             # NestJS API
|   |-- prisma/          # Prisma schema and migrations
|   `-- src/             # Backend modules and common infrastructure
|-- DEPLOYMENT.md        # Detailed deployment guide
`-- PRODUCTION_CHECKLIST.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL database

## Environment Setup

Create local environment files from the examples:

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Backend:

```env
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/job_tracker_dev?schema=public&connection_limit=10
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
```

SMTP values are optional in local development. If they are missing, password reset links are logged instead of emailed.

## Install

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Database

Run Prisma migrations and generate the client:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Run Locally

Start the backend:

```bash
cd backend
npm run start:dev
```

Start the frontend in another terminal:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:3002/health`

## Verification

Frontend:

```bash
npm run test:frontend
npm run build
npm run security:audit
```

Backend:

```bash
cd backend
npm test -- --runInBand
npm run build
npm run security:audit
```

Local smoke tests with both servers running:

```bash
npm run test:e2e:smoke
npm run test:load:smoke
```

## Deployment

The intended production setup is:

- Frontend on Vercel
- Backend on Railway
- PostgreSQL on Neon or another managed PostgreSQL provider

Read [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions and [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for the release checklist.

Production essentials:

- Set `NEXT_PUBLIC_API_URL` in Vercel to the deployed backend URL.
- Set backend `DATABASE_URL` with SSL and `connection_limit=10`.
- Set a production `JWT_SECRET` with at least 32 characters.
- Set `FRONTEND_URL` and `CORS_ORIGIN` to the deployed frontend URL.
- Run `npx prisma migrate deploy` before starting the production backend.

## Security Notes

- Do not commit real `.env` files.
- Use HTTPS for frontend and backend in production.
- Keep auth cookies httpOnly and secure in production.
- Back up production data before running migrations.
- Run security audits before release.

## Current Status

The codebase is deployment-ready. Remaining work is environment-specific: creating production services, setting secrets, running production migrations, and validating the live deployment.
