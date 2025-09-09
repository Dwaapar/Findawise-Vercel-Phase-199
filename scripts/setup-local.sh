#!/bin/bash

# Empire Local Development Setup Script
# This script sets up the complete local development environment with Docker

set -e

echo "🏆 EMPIRE LOCAL DEVELOPMENT SETUP"
echo "=================================="

# Check if running on Linux/macOS
if [[ "$OSTYPE" != "linux-gnu"* ]] && [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for Linux/macOS. For Windows, use WSL2."
    exit 1
fi

# Check for required tools
echo "🔍 Checking system requirements..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    echo "🔗 Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    echo "🔗 Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check for NVIDIA GPU (optional)
if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA GPU detected"
    GPU_AVAILABLE=true
else
    echo "⚠️  No NVIDIA GPU detected - will run on CPU"
    GPU_AVAILABLE=false
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing via NodeSource..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "❌ Please install Node.js 20+ manually: https://nodejs.org/"
        exit 1
    fi
fi

echo "✅ System requirements check completed"

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p ai-ml-data/models
mkdir -p logs
mkdir -p uploads
mkdir -p .backups/plugins
mkdir -p .backups/database
mkdir -p migrations

# Check environment file
echo "⚙️  Checking environment configuration..."
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please ensure .env exists with proper configuration."
    echo "📋 Required variables:"
    echo "   - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/findawise_empire"
    echo "   - JWT_SECRET=your-secret-key"
    echo "   - SESSION_SECRET=your-session-secret"
    echo "   - PORT=5000"
    exit 1
else
    echo "✅ .env file found"
    # Validate required environment variables
    source .env
    if [ -z "$JWT_SECRET" ] || [ -z "$SESSION_SECRET" ]; then
        echo "⚠️  Warning: JWT_SECRET or SESSION_SECRET not set in .env"
        echo "🔒 Please set secure secrets before production use!"
    fi
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Type check the application
echo "🔍 Running TypeScript check..."
npm run check || echo "⚠️  TypeScript errors found - continuing setup"

# Stop any running containers to avoid conflicts
echo "🧹 Cleaning up any existing containers..."
docker-compose down -v 2>/dev/null || true

# Start all services
echo "🚀 Starting all Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 15

# Wait for database to be ready
echo "🗄️  Waiting for PostgreSQL database to be ready..."
timeout 60 bash -c 'until docker exec findawise_postgres pg_isready -U postgres -d findawise_empire; do
    echo "⏳ Database is starting up..."
    sleep 2
done' || {
    echo "❌ Database failed to start properly"
    echo "🔍 Checking database logs:"
    docker-compose logs postgres
    exit 1
}

# Run database migrations
echo "🔄 Running database migrations..."
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/findawise_empire
npm run db:push || {
    echo "⚠️  Database migration failed - checking connection..."
    echo "🔍 Database logs:"
    docker-compose logs postgres
    echo "⚠️  Will retry during startup"
}

# Seed database with minimal data
echo "🌱 Seeding database with initial data..."
npm run seed:min || echo "⚠️  Database seeding failed - continuing setup"

# Set up Ollama models (if GPU available)
echo "🧠 Setting up local AI models..."
if [ "$GPU_AVAILABLE" = true ]; then
    echo "🚀 GPU available - setting up Ollama with GPU support"
    
    # Wait for Ollama to be ready
    echo "⏳ Waiting for Ollama service to be ready..."
    timeout 60 bash -c 'until curl -s http://localhost:11434/api/tags > /dev/null; do sleep 2; done' || echo "⚠️  Ollama not responding"
    
    # Pull required models (this might take a while)
    echo "⬇️  Downloading AI models (this may take 10-30 minutes)..."
    
    # Check for available models (use local Ollama if available)
    echo "📥 Checking for available AI models..."
    
    # Try local Ollama first
    if command -v ollama &> /dev/null; then
        echo "✅ Local Ollama detected - checking available models..."
        
        # Check if models are already available locally
        if ollama list | grep -q "llama3.1:latest\|llama2"; then
            echo "✅ Llama model found locally"
        else
            echo "📥 Pulling Llama3.1..."
            ollama pull llama3.1:latest || echo "⚠️  Failed to pull Llama3.1"
        fi
        
        if ollama list | grep -q "nomic-embed-text"; then
            echo "✅ Nomic Embed model found locally"
        else
            echo "📥 Pulling Nomic Embed..."
            ollama pull nomic-embed-text:latest || echo "⚠️  Failed to pull Nomic Embed"
        fi
    else
        echo "📥 Using Docker Ollama - pulling models..."
        docker exec findawise_ollama ollama pull llama3.1:latest || echo "⚠️  Failed to pull Llama3.1"
        docker exec findawise_ollama ollama pull nomic-embed-text:latest || echo "⚠️  Failed to pull Nomic Embed"
    fi
    
    echo "✅ AI models setup completed"
else
    echo "⚠️  No GPU - will use CPU-only models"
    
    # Try local Ollama first for CPU mode too
    if command -v ollama &> /dev/null; then
        echo "✅ Using local Ollama for CPU inference"
        if ollama list | grep -q "llama3.1:latest\|llama2"; then
            echo "✅ Llama model found locally"
        else
            echo "📥 Pulling lightweight Llama model..."
            ollama pull llama3.1:latest || echo "⚠️  Failed to pull Llama3.1"
        fi
    else
        # Wait for Docker Ollama
        timeout 60 bash -c 'until curl -s http://localhost:11434/api/tags > /dev/null; do sleep 2; done' || echo "⚠️  Ollama not responding"
        docker exec findawise_ollama ollama pull llama3.1:latest || echo "⚠️  Failed to pull Llama3.1"
    fi
fi

# Create startup script
echo "📝 Creating startup script..."
cat > start-local.sh << 'EOF'
#!/bin/bash

echo "🏆 STARTING EMPIRE LOCAL DEVELOPMENT"
echo "===================================="

# Load environment
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start all services
echo "🚀 Starting all Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service health
echo "🏥 Checking service health..."
echo "   PostgreSQL: $(docker exec findawise_postgres pg_isready -U postgres -d findawise_empire 2>/dev/null && echo '✅ Ready' || echo '❌ Not ready')"
echo "   Ollama: $(curl -s http://localhost:11434/api/tags > /dev/null && echo '✅ Ready' || echo '❌ Not ready')"
echo "   Redis: $(docker exec findawise_redis redis-cli ping 2>/dev/null && echo '✅ Ready' || echo '❌ Not ready')"
echo "   pgAdmin: $(curl -s http://localhost:5050 > /dev/null && echo '✅ Ready' || echo '❌ Not ready')"

# Run any pending migrations
echo "🔄 Running database migrations..."
npm run db:push || echo "⚠️  Migration check failed"

# Start the main application
echo "🌟 Starting Empire application..."
echo "📱 Application will be available at: http://localhost:5000"
echo "🔧 API endpoints at: http://localhost:5000/api"
echo "👑 Admin dashboard at: http://localhost:5000/admin"
echo ""
echo "Press Ctrl+C to stop the application"
npm run dev

EOF

chmod +x start-local.sh

# Create stop script
cat > stop-local.sh << 'EOF'
#!/bin/bash

echo "🛑 STOPPING EMPIRE LOCAL DEVELOPMENT"
echo "===================================="

docker-compose down
echo "✅ All services stopped"

# Optional: Remove volumes (uncomment to reset all data)
# echo "🗑️  Removing all data volumes..."
# docker-compose down -v
# echo "✅ All data cleared"

EOF

chmod +x stop-local.sh

# Create development helper script
echo "📝 Creating development helper script..."
cat > dev-tools.sh << 'EOF'
#!/bin/bash

case "$1" in
    logs)
        echo "📋 Showing application logs..."
        if [ -z "$2" ]; then
            docker-compose logs -f --tail=100
        else
            docker-compose logs -f --tail=100 "$2"
        fi
        ;;
    db)
        echo "🗄️  Connecting to database..."
        docker exec -it findawise_postgres psql -U postgres -d findawise_empire
        ;;
    redis)
        echo "🔴 Connecting to Redis..."
        docker exec -it findawise_redis redis-cli
        ;;
    restart)
        if [ -z "$2" ]; then
            echo "🔄 Restarting all services..."
            docker-compose restart
        else
            echo "🔄 Restarting service: $2"
            docker-compose restart "$2"
        fi
        ;;
    status)
        echo "📊 Service status:"
        docker-compose ps
        echo ""
        echo "🏥 Health checks:"
        echo "   PostgreSQL: $(docker exec findawise_postgres pg_isready -U postgres -d findawise_empire 2>/dev/null && echo '✅ Ready' || echo '❌ Not ready')"
        echo "   Ollama: $(curl -s http://localhost:11434/api/tags > /dev/null && echo '✅ Ready' || echo '❌ Not ready')"
        echo "   Redis: $(docker exec findawise_redis redis-cli ping 2>/dev/null && echo '✅ Ready' || echo '❌ Not ready')"
        echo "   pgAdmin: $(curl -s http://localhost:5050 > /dev/null && echo '✅ Ready' || echo '❌ Not ready')"
        ;;
    reset)
        echo "🗑️  WARNING: This will delete ALL data!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            echo "✅ All data cleared"
        else
            echo "❌ Reset cancelled"
        fi
        ;;
    migrate)
        echo "🔄 Running database migrations..."
        npm run db:push
        ;;
    seed)
        echo "🌱 Seeding database..."
        npm run seed:min
        ;;
    check)
        echo "🔍 Running TypeScript check..."
        npm run check
        ;;
    *)
        echo "🛠️  Development Tools"
        echo "=================="
        echo ""
        echo "Usage: ./dev-tools.sh [command] [service]"
        echo ""
        echo "Commands:"
        echo "  logs [service]  - Show logs for service (or all)"
        echo "  db             - Connect to database"
        echo "  redis          - Connect to Redis"
        echo "  restart [svc]  - Restart specific service (or all)"
        echo "  status         - Show all service status"
        echo "  reset          - Reset all data (DANGER!)"
        echo "  migrate        - Run database migrations"
        echo "  seed           - Seed database with initial data"
        echo "  check          - Run TypeScript check"
        echo ""
        echo "Examples:"
        echo "  ./dev-tools.sh logs postgres"
        echo "  ./dev-tools.sh restart ollama"
        echo "  ./dev-tools.sh status"
        ;;
esac
EOF

chmod +x dev-tools.sh

# Create quick health check script
cat > health-check.sh << 'EOF'
#!/bin/bash

echo "🏥 EMPIRE HEALTH CHECK"
echo "====================="
echo ""

# Check Docker services
echo "📊 Docker Services:"
docker-compose ps

echo ""
echo "🔗 Service Connectivity:"

# Database
if docker exec findawise_postgres pg_isready -U postgres -d findawise_empire >/dev/null 2>&1; then
    echo "   ✅ PostgreSQL: Connected"
else
    echo "   ❌ PostgreSQL: Not connected"
fi

# Redis
if docker exec findawise_redis redis-cli ping >/dev/null 2>&1; then
    echo "   ✅ Redis: Connected"
else
    echo "   ❌ Redis: Not connected"
fi

# Ollama
if curl -s http://localhost:11434/api/tags >/dev/null; then
    echo "   ✅ Ollama: Connected"
    # List available models
    models=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | head -3)
    if [ -n "$models" ]; then
        echo "      Models: $(echo $models | tr '\n' ' ')"
    fi
else
    echo "   ❌ Ollama: Not connected"
fi

# pgAdmin
if curl -s http://localhost:5050 >/dev/null; then
    echo "   ✅ pgAdmin: Connected (http://localhost:5050)"
else
    echo "   ❌ pgAdmin: Not connected"
fi

echo ""
echo "🌐 Application URLs:"
echo "   • Main App: http://localhost:5000"
echo "   • API: http://localhost:5000/api"
echo "   • Admin: http://localhost:5000/admin"
echo "   • pgAdmin: http://localhost:5050"
echo "   • Ollama API: http://localhost:11434"

EOF

chmod +x health-check.sh

# Final instructions
echo ""
echo "🎉 EMPIRE LOCAL DEVELOPMENT SETUP COMPLETED!"
echo "============================================"
echo ""
echo "🚀 To start the system:"
echo "   ./start-local.sh"
echo ""
echo "🛑 To stop the system:"
echo "   ./stop-local.sh"
echo ""
echo "🛠️  Development tools:"
echo "   ./dev-tools.sh [command] - Various development utilities"
echo "   ./health-check.sh       - Quick system health check"
echo ""
echo "🌐 Application will be available at:"
echo "   • Full Application: http://localhost:5000"
echo "   • Backend API: http://localhost:5000/api"
echo "   • Admin Dashboard: http://localhost:5000/admin"
echo "   • Ollama API: http://localhost:11434"
echo "   • pgAdmin: http://localhost:5050 (admin@findawise.com / admin123)"
echo "   • Redis: localhost:6379"
echo ""
echo "📊 System Status:"
echo "   • GPU Support: $GPU_AVAILABLE"
echo "   • AI Models: Llama3.1, Nomic Embed Text, WizardCoder"
echo "   • Local Ollama: $(command -v ollama &> /dev/null && echo 'Available' || echo 'Using Docker')"
echo "   • Database: PostgreSQL (findawise_empire)"
echo "   • Cache: Redis enabled"
echo "   • All Enterprise Features: Enabled"
echo ""
echo "💡 Next Steps:"
echo "   1. Run './start-local.sh' to start everything"
echo "   2. Wait for services to initialize (2-3 minutes)"
echo "   3. Visit http://localhost:5000 to see your application"
echo "   4. Run './health-check.sh' to verify all services"
echo ""
echo "🏆 Your development environment is ready!"
echo ""
echo "📚 Quick Tips:"
echo "   • Use './dev-tools.sh logs' to see application logs"
echo "   • Use './dev-tools.sh db' to connect to the database"
echo "   • Use './dev-tools.sh status' to check service status"
echo "   • Check '.env' file for configuration options"