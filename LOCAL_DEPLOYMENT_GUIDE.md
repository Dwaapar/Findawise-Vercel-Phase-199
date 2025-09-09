# 🏆 FINDAWISE EMPIRE - LOCAL DEPLOYMENT GUIDE

Complete guide to deploying the Findawise Empire system on your local hardware with full AI/ML capabilities.

## 🎯 OVERVIEW

This guide will help you export and run the complete Findawise Empire system locally with:
- **Your Local AI Models**: Mixtral, Llama 3.1, DeepSeek Coder
- **Full GPU Acceleration**: Vector embeddings, ML processing, semantic analysis
- **Enterprise Features**: Real-time personalization, vector search, semantic intelligence
- **Zero Fallbacks**: All advanced features running at full capacity

## 🔧 PREREQUISITES

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+), macOS (10.15+), or Windows with WSL2
- **GPU**: NVIDIA GPU with 8GB+ VRAM (recommended)
- **RAM**: 16GB minimum, 32GB+ recommended
- **Storage**: 100GB+ free space for models and data
- **CPU**: 8+ cores recommended

### Required Software
1. **Docker** (Latest version with GPU support)
2. **Docker Compose** (v2.0+)
3. **Node.js** (v20+)
4. **Git**
5. **NVIDIA Container Toolkit** (for GPU support)

## 📥 STEP 1: EXPORT FROM REPLIT

1. **Download Complete Project**
   ```bash
   # In Replit terminal, create export package
   tar -czf findawise-empire-export.tar.gz \
     --exclude=node_modules \
     --exclude=.git \
     --exclude=logs \
     --exclude=uploads \
     .
   ```

2. **Download the Archive**
   - Use Replit's file download feature to get `findawise-empire-export.tar.gz`
   - Extract to your local machine: `tar -xzf findawise-empire-export.tar.gz`

## 🚀 STEP 2: LOCAL SETUP

1. **Navigate to Project Directory**
   ```bash
   cd findawise-empire
   ```

2. **Run Setup Script**
   ```bash
   chmod +x scripts/setup-local.sh
   ./scripts/setup-local.sh
   ```

3. **Configure Environment**
   - Copy `.env.local` to `.env`
   - Update any specific settings for your hardware

## ⚙️ STEP 3: ENVIRONMENT CONFIGURATION

### Essential Environment Variables

```bash
# Copy this to your .env file and customize for your setup

# ================================
# CORE APPLICATION SETTINGS
# ================================
NODE_ENV=production
PORT=5000

# ================================
# DATABASE CONFIGURATION
# ================================
DATABASE_URL=postgresql://findawise:findawise@localhost:5432/findawise
REDIS_URL=redis://localhost:6379

# ================================
# LOCAL AI CONFIGURATION
# ================================
LOCAL_AI_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434
EMBEDDING_SERVER_URL=http://localhost:8001
QDRANT_URL=http://localhost:6333

# ================================
# AI MODEL CONFIGURATION
# ================================
# Primary models (adjust based on your downloaded models)
DEFAULT_LLM_MODEL=mixtral:8x7b
FALLBACK_LLM_MODEL=llama3.1:8b
CODING_LLM_MODEL=deepseek-coder:6.7b

# Available models (comma-separated list of your Ollama models)
AVAILABLE_MODELS=mixtral:8x7b,llama3.1:8b,llama3.1:70b,deepseek-coder:6.7b,deepseek-coder:33b

# ================================
# EMBEDDING MODELS CONFIGURATION
# ================================
DEFAULT_EMBEDDING_MODEL=all-MiniLM-L6-v2
EMBEDDING_MODELS=all-MiniLM-L6-v2,all-mpnet-base-v2,universal-sentence-encoder,e5-small

# ================================
# GPU & PERFORMANCE SETTINGS
# ================================
GPU_ENABLED=true
CUDA_VISIBLE_DEVICES=0
MAX_CONCURRENT_REQUESTS=10
BATCH_SIZE=32
MAX_SEQUENCE_LENGTH=2048

# ================================
# FEATURE TOGGLES (FULL POWER MODE)
# ================================
EMPIRE_MODE=true
FALLBACK_MODE=false
VECTOR_SEARCH_ENABLED=true
SEMANTIC_INTELLIGENCE_ENABLED=true
LAYOUT_MUTATION_ENABLED=true
REALTIME_PERSONALIZATION_ENABLED=true
ML_PREDICTION_ENABLED=true

# ================================
# VECTOR DATABASE SETTINGS
# ================================
VECTOR_DIMENSION=384
SIMILARITY_THRESHOLD=0.7
MAX_VECTOR_RESULTS=100

# ================================
# MEMORY & RESOURCE MANAGEMENT
# ================================
MAX_MEMORY_USAGE=16GB
WORKER_PROCESSES=8
CACHE_SIZE=2GB
MODEL_CACHE_SIZE=8GB

# ================================
# SECURITY SETTINGS
# ================================
JWT_SECRET=your-super-secure-jwt-secret-change-this
SESSION_SECRET=your-super-secure-session-secret-change-this
ENCRYPTION_KEY=your-super-secure-encryption-key-change-this

# ================================
# MONITORING & LOGGING
# ================================
LOG_LEVEL=info
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_DETAILED_LOGGING=true
METRICS_ENABLED=true

# ================================
# DEVELOPMENT FEATURES
# ================================
HOT_RELOAD=false
DEBUG_MODE=false
ENABLE_PROFILING=true

# ================================
# EXTERNAL SERVICES (OPTIONAL)
# ================================
# Leave empty to use local-only processing
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
HUGGINGFACE_TOKEN=

# ================================
# BACKUP & MIGRATION
# ================================
AUTO_BACKUP_ENABLED=true
BACKUP_INTERVAL=3600
MIGRATION_SAFE_MODE=true
```

## 🏃 STEP 4: STARTING THE SYSTEM

1. **Start All Services**
   ```bash
   ./start-local.sh
   ```

2. **Verify System Health**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Ollama API: http://localhost:11434
   - Vector Database: http://localhost:6333
   - Embedding Server: http://localhost:8001

3. **Check Logs**
   ```bash
   docker-compose -f docker-compose.local.yml logs -f
   ```

## 🧠 STEP 5: AI MODEL SETUP

### Download AI Models

The setup script will attempt to download models, but you can also do this manually:

```bash
# Connect to Ollama container
docker exec -it findawise-ollama bash

# Pull models (adjust based on your preferences)
ollama pull mixtral:8x7b
ollama pull llama3.1:8b
ollama pull llama3.1:70b
ollama pull deepseek-coder:6.7b
ollama pull deepseek-coder:33b

# Verify models
ollama list
```

### Embedding Models

The embedding server will automatically download models on first use:
- all-MiniLM-L6-v2 (384 dimensions)
- all-mpnet-base-v2 (768 dimensions)
- paraphrase-multilingual-MiniLM-L12-v2 (384 dimensions)

## 🔧 STEP 6: CUSTOMIZATION

### Hardware Optimization

**For High-End GPUs (RTX 4090, A6000, etc.):**
```bash
# In .env file
MAX_CONCURRENT_REQUESTS=20
BATCH_SIZE=64
WORKER_PROCESSES=16
MODEL_CACHE_SIZE=16GB
```

**For Multiple GPUs:**
```bash
# In .env file
CUDA_VISIBLE_DEVICES=0,1,2,3
GPU_ENABLED=true
```

### Model Configuration

**Adjust models based on your hardware:**
```bash
# For 24GB+ VRAM
DEFAULT_LLM_MODEL=llama3.1:70b

# For 12-16GB VRAM
DEFAULT_LLM_MODEL=mixtral:8x7b

# For 8-12GB VRAM
DEFAULT_LLM_MODEL=llama3.1:8b
```

## 🏥 STEP 7: MONITORING & HEALTH CHECKS

### System Status Dashboard
Access the admin dashboard at http://localhost:5000/admin to monitor:
- AI service health
- Model performance metrics
- Resource utilization
- Request processing statistics

### Log Monitoring
```bash
# Monitor all services
docker-compose -f docker-compose.local.yml logs -f

# Monitor specific service
docker-compose -f docker-compose.local.yml logs -f ollama
docker-compose -f docker-compose.local.yml logs -f embedding-server
```

## 🛠️ TROUBLESHOOTING

### Common Issues

**GPU Not Detected:**
```bash
# Check NVIDIA drivers
nvidia-smi

# Verify Docker GPU support
docker run --rm --gpus all nvidia/cuda:12.1-base-ubuntu22.04 nvidia-smi
```

**Models Not Loading:**
```bash
# Check Ollama logs
docker logs findawise-ollama

# Manually pull models
docker exec findawise-ollama ollama pull llama3.1:8b
```

**Database Connection Issues:**
```bash
# Check PostgreSQL status
docker logs findawise-postgres

# Reset database
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d postgres
```

### Performance Tuning

**Memory Issues:**
- Reduce `MAX_CONCURRENT_REQUESTS`
- Lower `BATCH_SIZE`
- Limit `MODEL_CACHE_SIZE`

**Slow Response Times:**
- Increase `WORKER_PROCESSES`
- Enable more GPU devices
- Use faster models for non-critical tasks

## 🎉 SUCCESS VERIFICATION

When everything is working correctly, you should see:

1. **No Fallback Messages** in logs
2. **All Services Healthy** in admin dashboard
3. **Fast Response Times** (<2 seconds for AI requests)
4. **GPU Utilization** visible in nvidia-smi
5. **Enterprise Features Active** in the interface

## 📞 SUPPORT

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs for specific error messages
3. Verify hardware requirements are met
4. Ensure all environment variables are correctly set

Your F1 race car is now ready to run at full speed! 🏆