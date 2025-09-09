#!/bin/bash

# Local Development Script for Node.js v18 compatibility
# This fixes the --env-file issue for your WSL environment

echo "🚀 Starting Findawise Empire in Local Development Mode"
echo "Node.js version: $(node --version)"
echo "================================================="

# Set development environment
export NODE_ENV=development

# Run the application (without --env-file flag for Node.js v18 compatibility)
echo "🌟 Starting server on http://localhost:5000"
echo "🔧 API endpoints at: http://localhost:5000/api"
echo "👑 Admin dashboard at: http://localhost:5000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

tsx server/index.ts