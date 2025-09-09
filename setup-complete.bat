@echo off
echo 🚀 Starting FindaWise Empire Database Setup...

echo 📋 Step 1: Starting PostgreSQL and core services...
docker-compose -f docker-compose.fixed.yml up -d

echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak > nul

echo 📊 Step 2: Deploying database schema...
npx drizzle-kit push --config=drizzle.config.fixed.ts

echo ✅ Step 3: Verifying database...
docker exec findawise_postgres psql -U findawise_user -d findawise_empire -c "SELECT 'Database Ready!' as status;"

echo 🎯 Step 4: Starting application...
npm run dev

echo 🏆 Setup Complete!
echo.
echo Access Points:
echo - Main App: http://localhost:5000
echo - Database: localhost:5432 (findawise_empire)
echo - pgAdmin: http://localhost:5050
pause
