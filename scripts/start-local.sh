#!/bin/bash

# Start script for Docker container
echo "🏆 Starting Findawise Empire Application"

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Wait for dependencies
echo "⏳ Waiting for dependencies..."
sleep 10

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:push || echo "⚠️  Database migration failed"

# Start the application
echo "🚀 Starting application servers..."

# Start backend server
npm run server &
SERVER_PID=$!

# Start frontend development server
npm run dev &
FRONTEND_PID=$!

# Function to handle cleanup
cleanup() {
    echo "🛑 Shutting down..."
    kill $SERVER_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Wait for processes
wait $SERVER_PID $FRONTEND_PID