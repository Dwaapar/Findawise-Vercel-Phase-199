#!/bin/bash

# 🏆 FINDAWISE EMPIRE - AUTOMATED LOCAL SETUP SCRIPT
# This script sets up your billion-dollar enterprise platform locally

set -e

echo "🏆 FINDAWISE EMPIRE - LOCAL DEPLOYMENT SETUP"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check system requirements
log_info "Checking system requirements..."

if ! command_exists node; then
    log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi
log_success "Node.js $(node -v) detected"

if ! command_exists npm; then
    log_error "npm is not installed"
    exit 1
fi
log_success "npm $(npm -v) detected"

if ! command_exists psql; then
    log_warning "PostgreSQL client not found. Please install PostgreSQL"
    log_info "Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    log_info "macOS: brew install postgresql"
    log_info "Windows: Download from https://www.postgresql.org/download/"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    log_success "PostgreSQL client detected"
fi

# Step 2: Install dependencies
log_info "Installing dependencies..."
npm install
log_success "Dependencies installed"

# Install global dependencies
log_info "Installing global dependencies..."
npm install -g tsx drizzle-kit
log_success "Global dependencies installed"

# Step 3: Environment setup
log_info "Setting up environment configuration..."

if [ ! -f .env.local ]; then
    if [ -f .env.local.template ]; then
        cp .env.local.template .env.local
        log_success "Created .env.local from template"
        log_warning "Please edit .env.local with your API keys and database credentials"
    else
        log_error ".env.local.template not found"
        exit 1
    fi
else
    log_info ".env.local already exists"
fi

# Step 4: Database setup
log_info "Setting up database..."

# Check if DATABASE_URL is set
if grep -q "^DATABASE_URL=postgresql://" .env.local; then
    log_info "Database URL found in .env.local"
    
    # Try to connect to database
    DB_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2-)
    if psql "$DB_URL" -c '\q' 2>/dev/null; then
        log_success "Database connection successful"
        
        # Deploy schema
        log_info "Deploying database schema (450+ tables)..."
        npm run db:push
        log_success "Database schema deployed"
    else
        log_warning "Cannot connect to database. Please ensure PostgreSQL is running and credentials are correct"
        log_info "Database setup will be skipped for now"
    fi
else
    log_warning "DATABASE_URL not configured in .env.local"
    log_info "Please configure your database connection in .env.local"
fi

# Step 5: Docker setup (optional)
if command_exists docker; then
    log_success "Docker detected"
    
    if command_exists docker-compose; then
        log_success "Docker Compose detected"
        
        read -p "Would you like to use Docker for local deployment? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Starting Docker services..."
            docker-compose -f docker-compose.local.yml up -d
            
            # Wait for services to be ready
            log_info "Waiting for services to start..."
            sleep 30
            
            # Deploy schema in Docker
            log_info "Deploying schema in Docker environment..."
            docker-compose -f docker-compose.local.yml exec app npm run db:push
            
            log_success "Docker deployment complete"
            log_info "Services available at:"
            log_info "- Application: http://localhost:5000"
            log_info "- Frontend: http://localhost:3000"
            log_info "- Database Admin: http://localhost:5050"
            log_info "- Monitoring: http://localhost:9090"
        fi
    fi
else
    log_info "Docker not found. Manual setup will be used."
fi

# Step 6: Build application
log_info "Building application..."
npm run build
log_success "Application built successfully"

# Step 7: Final checks
log_info "Performing final health checks..."

# Check if all required files exist
REQUIRED_FILES=(".env.local" "package.json" "tsconfig.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file exists"
    else
        log_error "$file is missing"
    fi
done

# Step 8: Display completion message
echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
log_success "Your Findawise Empire platform is ready for local deployment!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Edit .env.local with your API keys"
echo "2. Ensure PostgreSQL is running"
echo "3. Start the application:"
echo ""
echo "   # Development mode:"
echo "   npm run dev"
echo ""
echo "   # Production mode:"
echo "   npm run start"
echo ""
echo "   # Docker mode (if using Docker):"
echo "   docker-compose -f docker-compose.local.yml up -d"
echo ""
echo "📊 HEALTH CHECKS:"
echo "- Application: http://localhost:5000/health"
echo "- Frontend: http://localhost:3000"
echo "- API Status: http://localhost:5000/api/empire/status"
echo ""
echo "📚 DOCUMENTATION:"
echo "- Setup Guide: LOCAL_DEPLOYMENT_COMPLETE_GUIDE.md"
echo "- API Reference: http://localhost:5000/api/docs"
echo ""
echo "🔑 REQUIRED API KEYS:"
echo "- OpenAI or Anthropic (for AI features)"
echo "- SendGrid (for email)"
echo "- Stripe (for payments)"
echo "- See .env.local.template for complete list"
echo ""
log_success "Happy building with your billion-dollar empire platform! 🚀"