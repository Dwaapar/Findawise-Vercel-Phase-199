#!/bin/bash

# Export your empire project for local deployment
echo "🚀 Exporting Empire Project for Local Deployment"

# Create export directory
mkdir -p empire-export
cd empire-export

# Copy essential files (excluding unnecessary ones)
echo "📂 Copying project files..."

cp -r ../client ./client
cp -r ../server ./server
cp -r ../shared ./shared
cp -r ../scripts ./scripts
cp -r ../public ./public

# Copy configuration files
cp ../.env.example ./.env.example
cp ../package.json ./package.json
cp ../drizzle.config.ts ./drizzle.config.ts
cp ../docker-compose.yml ./docker-compose.yml
cp ../tsconfig.json ./tsconfig.json
cp ../vite.config.ts ./vite.config.ts

# Copy deployment guides
cp ../LOCAL_SETUP_GUIDE.md ./LOCAL_SETUP_GUIDE.md
cp ../CUSTOM_DOMAIN_DEPLOYMENT.md ./CUSTOM_DOMAIN_DEPLOYMENT.md

echo "✅ Export complete! Your empire is ready in ./empire-export/"
echo ""
echo "Next steps:"
echo "1. Copy the empire-export folder to your local machine"
echo "2. Run: npm install"
echo "3. Copy .env.example to .env and configure"
echo "4. Deploy to your chosen platform"