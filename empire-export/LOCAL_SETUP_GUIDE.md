# 🚀 FindaWise Empire - Local Setup Guide

Complete guide to export and run FindaWise Empire locally with Docker PostgreSQL and AI integration.

## 🎯 Quick Start

1. **Run the automated setup:**
   ```bash
   chmod +x scripts/setup-local.sh
   ./scripts/setup-local.sh
   ```

2. **Configure your environment:**
   ```bash
   # Edit .env with your API keys
   nano .env
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

## 📋 Prerequisites

- **Docker Desktop** (Latest version)
- **Node.js 18+** 
- **npm** or **yarn**
- **Git**

## 🐳 Infrastructure Stack

### Core Services
- **PostgreSQL 15** - Main database (Port 5432)
- **Redis 7** - Caching & sessions (Port 6379)
- **ChromaDB** - Vector embeddings (Port 8000)
- **Ollama** - Local AI brain (Port 11434)

### Management Tools
- **pgAdmin 4** - Database management (Port 5050)
- **Prometheus** - Metrics (Port 9090) [Optional]
- **Grafana** - Monitoring (Port 3001) [Optional]

## ⚙️ Configuration System

### Master Configuration
All services configured through `config/master-config.ts`:

```typescript
// Database
DatabaseConfig.getConnectionString()

// AI Brain
AIBrainConfig.localModels.enabled
AIBrainConfig.external.openai.enabled

// Payments
PaymentConfig.stripe.enabled

// Affiliate Networks
AffiliateConfig.networks.shareasale.enabled
```

### Environment Variables
Copy and customize `.env.example`:

```bash
# Core Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/findawise_empire

# Local AI (Ollama)
LOCAL_AI_ENABLED=true
LOCAL_AI_URL=http://localhost:11434

# External AI APIs (Optional)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key

# Affiliate Networks
SHAREASALE_API_KEY=your_key
CJ_API_KEY=your_key
CLICKBANK_API_KEY=your_key
```

## 🧠 AI Brain Integration

### Local AI (Ollama) - Recommended
```bash
# Start Ollama
docker-compose -f docker-compose.local.yml up -d ollama

# Pull models
docker exec findawise-ollama ollama pull llama2:7b
docker exec findawise-ollama ollama pull nomic-embed-text
docker exec findawise-ollama ollama pull codellama
```

### External AI APIs
Configure in `.env`:
- **OpenAI**: GPT-4, embeddings, DALL-E
- **Anthropic**: Claude-3 Sonnet
- **Local**: Ollama integration

## 💾 Database Management

### Automatic Setup
```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate

# View database
npm run db:studio
```

### Manual Management
- **pgAdmin**: http://localhost:5050
  - Email: `admin@findawise.com`
  - Password: `admin123`

### Schema Structure
- **450+ Tables** covering:
  - User management & authentication
  - Affiliate networks & tracking
  - Payment processing
  - Content automation
  - AI/ML pipelines
  - Analytics & reporting

## 💰 Revenue System Setup

### 1. Payment Processing
```bash
# Stripe (Primary)
STRIPE_SECRET_KEY=sk_live_...  # Production
STRIPE_PUBLIC_KEY=pk_live_...

# PayPal (Alternative)
PAYPAL_CLIENT_ID=your_id
PAYPAL_MODE=live  # For production
```

### 2. Affiliate Networks
```bash
# ShareASale (20-40% commissions)
SHAREASALE_API_KEY=your_key
SHAREASALE_AFFILIATE_ID=your_id

# Commission Junction
CJ_API_KEY=your_key
CJ_WEBSITE_ID=your_website_id

# ClickBank (Digital products)
CLICKBANK_API_KEY=your_key
CLICKBANK_DEVELOPER_KEY=your_dev_key

# Amazon Associates
AMAZON_ACCESS_KEY=your_access_key
AMAZON_ASSOCIATE_TAG=your_tag
```

### 3. Email Marketing
```bash
# SendGrid (Recommended)
SENDGRID_API_KEY=SG.your_key
FROM_EMAIL=no-reply@yourdomain.com

# Or use Resend
RESEND_API_KEY=re_your_key
```

## 🚀 Available Revenue Streams

### 1. SaaS Directory (Ready)
- **Commission**: 20-40% recurring
- **Database**: Pre-configured with tools
- **API**: Automated affiliate tracking

### 2. Digital Products (Ready)
- **Margin**: 70-95% profit
- **Payment**: Stripe integration
- **Delivery**: Automated download system

### 3. Affiliate Marketing (13+ Networks)
- **Commission**: 3-50% per sale
- **Tracking**: Enterprise-grade attribution
- **Networks**: ShareASale, CJ, ClickBank, etc.

### 4. Content Automation (11 Generators)
- **Traffic**: SEO-optimized content
- **Social**: Auto-posting to platforms
- **Lead Gen**: Email capture funnels

## 🔧 Development Commands

### Core Operations
```bash
# Start development server
npm run dev

# Database operations
npm run db:push          # Push schema changes
npm run db:generate      # Generate migrations
npm run db:studio        # Open database browser

# Build for production
npm run build
npm start
```

### Docker Management
```bash
# Start all services
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Stop all services
docker-compose -f docker-compose.local.yml down

# Reset everything
docker-compose -f docker-compose.local.yml down -v
```

## 📊 Monitoring & Health

### Built-in Health Checks
- **Database**: Connection & performance
- **AI Services**: Model availability
- **External APIs**: Rate limits & status
- **Memory**: Usage optimization

### Access Points
- **Main App**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5000/admin
- **API Status**: http://localhost:5000/api/health
- **Database Admin**: http://localhost:5050

### Performance Optimization
- **Auto-healing**: Failed service recovery
- **Memory management**: Automatic cleanup
- **Connection pooling**: Database efficiency
- **Caching**: Redis for fast responses

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL
   docker exec findawise-postgres pg_isready -U postgres
   
   # Restart if needed
   docker-compose -f docker-compose.local.yml restart postgres
   ```

2. **AI Models Not Loading**
   ```bash
   # Check Ollama
   curl http://localhost:11434/api/version
   
   # Pull models manually
   docker exec findawise-ollama ollama pull llama2:7b
   ```

3. **High Memory Usage**
   ```bash
   # Check Docker memory
   docker stats
   
   # Restart services
   docker-compose -f docker-compose.local.yml restart
   ```

4. **Port Conflicts**
   ```bash
   # Check what's using ports
   lsof -i :5432
   lsof -i :5000
   
   # Kill conflicting processes
   sudo kill -9 PID
   ```

### Performance Tips
- **Allocate 8GB+ RAM** for Docker
- **Use SSD storage** for database
- **Close unused browser tabs** (memory optimization)
- **Monitor with `docker stats`**

## 📈 Scaling & Production

### Production Deployment
1. **Update environment variables**
2. **Configure SSL certificates**
3. **Set up load balancing**
4. **Enable database backups**
5. **Configure monitoring alerts**

### Revenue Optimization
1. **Test payment flows**
2. **Verify affiliate tracking**
3. **Monitor conversion rates**
4. **A/B test landing pages**
5. **Optimize email campaigns**

## 🎯 Next Steps

1. **Configure API keys** in `.env`
2. **Test payment processing** with Stripe
3. **Set up affiliate accounts** with networks
4. **Launch first revenue stream** (SaaS directory)
5. **Monitor performance** and optimize

## 📞 Support

- **Documentation**: All README files in project
- **Configuration**: `config/master-config.ts`
- **Database Schema**: `shared/schema.ts`
- **API Reference**: http://localhost:5000/api/docs

---

**🏆 You now have a billion-dollar capable system running locally with complete revenue generation capabilities!**