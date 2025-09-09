@echo off
echo 🚀 Fixing FindaWise Database Configuration...

echo 📋 Step 1: Stopping existing containers...
docker-compose down

echo 📋 Step 2: Removing old containers and volumes...
docker rm -f findawise_postgres findawise_redis findawise_ollama findawise_pgadmin 2>nul
docker volume prune -f

echo 📋 Step 3: Starting fresh PostgreSQL...
docker-compose -f docker-compose.clean.yml up -d db

echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 15 /nobreak > nul

echo 📊 Step 4: Testing database connection...
docker exec findawise_postgres psql -U findawise -d findawise_empire -c "SELECT 'Database Ready!' as status;"

echo 📊 Step 5: Deploying database schema...
npx drizzle-kit push --config=drizzle.config.fixed.ts

echo ✅ Database setup complete!
echo.
echo 🎯 Next steps:
echo 1. Run: docker-compose -f docker-compose.clean.yml up -d
echo 2. Run: npm run dev
echo.
pause
