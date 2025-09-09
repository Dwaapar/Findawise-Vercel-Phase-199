# 🚀 WORKING Local Setup - Windows Fix

## Step 1: Move Your Project (FIX PATH ISSUES)
```cmd
# Move to a path WITHOUT SPACES
C:\> mkdir C:\dev
C:\> move "C:\findawise newphase\Findawise-newphase-161\Findawise-newphase-161" C:\dev\findawise
C:\> cd C:\dev\findawise
```

## Step 2: Use SIMPLE Config Files
```cmd
# Copy the working .env file
copy .env.simple .env
```

## Step 3: Start Docker Services
```cmd
# Use the simple docker-compose (no path issues)
docker-compose -f docker-compose.simple.yml up -d
```

## Step 4: Install & Deploy
```cmd
# Install dependencies
npm install

# Deploy all 430+ tables (FORCE PUSH)
npm run db:push --force

# Start your empire
npm run dev
```

## Step 5: Setup AI Models (Optional)
```cmd
# Pull models for your RTX 3060
docker exec findawise_ollama ollama pull llama2:7b
docker exec findawise_ollama ollama pull nomic-embed-text
```

## 🎯 Access Points:
- **Main App**: http://localhost:5000
- **Database Admin**: http://localhost:5050 (admin@findawise.com / admin123)
- **Health Check**: http://localhost:5000/api/health

## 🔧 If Problems Persist:
```cmd
# Reset everything
docker-compose -f docker-compose.simple.yml down -v
# Then repeat steps 3-4
```