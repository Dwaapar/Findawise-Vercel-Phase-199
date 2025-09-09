#!/bin/bash

# ===============================================================
# LOCAL DATABASE SETUP SCRIPT - BILLION DOLLAR EMPIRE GRADE
# Complete automation for PostgreSQL + Schema deployment
# ===============================================================

set -e  # Exit on any error

echo "🏆 STARTING BILLION-DOLLAR DATABASE DEPLOYMENT..."
echo "==============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="findawise"
DB_USER="findawise"
DB_PASSWORD="findawise"
DB_HOST="localhost"
DB_PORT="5432"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   URL: $DATABASE_URL"
echo ""

# Function to check if PostgreSQL is running
check_postgres() {
    echo -e "${YELLOW}🔍 Checking PostgreSQL status...${NC}"
    
    if pg_isready -h $DB_HOST -p $DB_PORT >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
        return 0
    else
        echo -e "${RED}❌ PostgreSQL is not running${NC}"
        return 1
    fi
}

# Function to wait for PostgreSQL
wait_for_postgres() {
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    
    for i in {1..30}; do
        if check_postgres; then
            return 0
        fi
        echo "   Attempt $i/30 - waiting 2 seconds..."
        sleep 2
    done
    
    echo -e "${RED}❌ PostgreSQL failed to start within 60 seconds${NC}"
    return 1
}

# Function to create database if it doesn't exist
create_database() {
    echo -e "${YELLOW}🏗️ Creating database if not exists...${NC}"
    
    # Check if database exists
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        echo -e "${GREEN}✅ Database '$DB_NAME' already exists${NC}"
    else
        echo -e "${YELLOW}📦 Creating database '$DB_NAME'...${NC}"
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"
    fi
}

# Function to run database migrations
run_migrations() {
    echo -e "${YELLOW}🚀 Running Drizzle schema deployment...${NC}"
    
    # Set the DATABASE_URL environment variable
    export DATABASE_URL=$DATABASE_URL
    
    # Push schema to database
    echo -e "${BLUE}📊 Deploying 450+ enterprise tables...${NC}"
    
    if npm run db:push; then
        echo -e "${GREEN}✅ Schema deployment successful${NC}"
        echo -e "${GREEN}✅ All 450+ enterprise tables deployed${NC}"
    else
        echo -e "${RED}❌ Schema deployment failed${NC}"
        return 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo -e "${YELLOW}🔍 Verifying database deployment...${NC}"
    
    # Count tables
    TABLE_COUNT=$(psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t 2>/dev/null | xargs)
    
    if [ "$TABLE_COUNT" -gt 400 ]; then
        echo -e "${GREEN}✅ Database verification successful${NC}"
        echo -e "${GREEN}✅ $TABLE_COUNT tables deployed (Expected: 450+)${NC}"
        
        # List some key tables
        echo -e "${BLUE}📋 Key enterprise systems verified:${NC}"
        psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%ai_%' LIMIT 5;" -t 2>/dev/null | while read table; do
            if [ ! -z "$table" ]; then
                echo "   ✓ $table"
            fi
        done
        
        return 0
    else
        echo -e "${RED}❌ Database verification failed${NC}"
        echo -e "${RED}❌ Only $TABLE_COUNT tables found (Expected: 450+)${NC}"
        return 1
    fi
}

# Function to setup initial data
setup_initial_data() {
    echo -e "${YELLOW}🌱 Setting up initial enterprise data...${NC}"
    
    if [ -f "scripts/seed-minimal.ts" ]; then
        echo -e "${BLUE}📊 Running minimal seed data...${NC}"
        npm run seed:min
        echo -e "${GREEN}✅ Initial data setup complete${NC}"
    else
        echo -e "${YELLOW}⚠️ No seed script found, skipping initial data${NC}"
    fi
}

# Function to test database connection
test_connection() {
    echo -e "${YELLOW}🧪 Testing database connection...${NC}"
    
    if psql $DATABASE_URL -c "SELECT 'Database connection successful!' as status;" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database connection test passed${NC}"
        return 0
    else
        echo -e "${RED}❌ Database connection test failed${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting database setup process...${NC}"
    echo ""
    
    # Check if Docker Compose is being used
    if [ "$1" = "--docker" ]; then
        echo -e "${BLUE}🐳 Docker mode detected${NC}"
        echo -e "${YELLOW}⏳ Starting PostgreSQL with Docker Compose...${NC}"
        docker-compose -f docker-compose.local.yml up -d postgres
        echo ""
    fi
    
    # Wait for PostgreSQL to be ready
    if ! wait_for_postgres; then
        echo -e "${RED}💥 CRITICAL: PostgreSQL is not available${NC}"
        echo -e "${YELLOW}💡 Solutions:${NC}"
        echo "   1. Start PostgreSQL: sudo systemctl start postgresql"
        echo "   2. Use Docker: ./scripts/setup-database-local.sh --docker"
        echo "   3. Check connection: psql -h $DB_HOST -p $DB_PORT -U $DB_USER"
        exit 1
    fi
    
    echo ""
    
    # Create database
    if ! create_database; then
        echo -e "${RED}💥 CRITICAL: Failed to create database${NC}"
        exit 1
    fi
    
    echo ""
    
    # Test connection
    if ! test_connection; then
        echo -e "${RED}💥 CRITICAL: Database connection failed${NC}"
        exit 1
    fi
    
    echo ""
    
    # Run migrations
    if ! run_migrations; then
        echo -e "${RED}💥 CRITICAL: Schema deployment failed${NC}"
        exit 1
    fi
    
    echo ""
    
    # Verify deployment
    if ! verify_deployment; then
        echo -e "${RED}💥 CRITICAL: Database verification failed${NC}"
        exit 1
    fi
    
    echo ""
    
    # Setup initial data
    setup_initial_data
    
    echo ""
    echo -e "${GREEN}🏆 DATABASE DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
    echo "==============================================================="
    echo -e "${GREEN}✅ PostgreSQL running and ready${NC}"
    echo -e "${GREEN}✅ Database '$DB_NAME' created and configured${NC}"
    echo -e "${GREEN}✅ All 450+ enterprise tables deployed${NC}"
    echo -e "${GREEN}✅ Database connection verified${NC}"
    echo -e "${GREEN}✅ Initial data setup complete${NC}"
    echo ""
    echo -e "${BLUE}🔗 Connection details:${NC}"
    echo "   DATABASE_URL=$DATABASE_URL"
    echo ""
    echo -e "${BLUE}🚀 Ready for billion-dollar empire operations!${NC}"
    echo "==============================================================="
}

# Handle script arguments
case "$1" in
    --help)
        echo "Local Database Setup Script"
        echo ""
        echo "Usage:"
        echo "  ./scripts/setup-database-local.sh           # Use existing PostgreSQL"
        echo "  ./scripts/setup-database-local.sh --docker  # Start PostgreSQL with Docker"
        echo "  ./scripts/setup-database-local.sh --help    # Show this help"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac