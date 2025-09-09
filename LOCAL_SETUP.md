# Findawise Empire - Local Setup

## Quick Start

1. **Start Docker services:**
   ```bash
   docker-compose up -d
   ```

2. **Install and setup:**
   ```bash
   npm install
   npm run db:push --force
   npm run seed:min
   npm run dev
   ```

## Access URLs
- Main app: http://localhost:5000
- Admin dashboard: http://localhost:5000/admin
- Database admin: http://localhost:5050 (admin@findawise.com / admin123)

## Test Accounts
- Username: `admin` / Password: `admin`
- Username: `demo` / Password: `demo`

## Database Schema Status
✅ 439 tables configured
✅ All missing tables added to schema
✅ Docker configuration ready
✅ Environment variables set

The database schema is now complete and matches your local database exactly.