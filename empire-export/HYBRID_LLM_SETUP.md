# Hybrid LLM Setup Guide
# Deploy Empire to Cloud + Local LLMs

## Overview
- Your empire app runs on Railway/Vercel (public internet)
- Your LLMs run locally with Ollama (your machine)
- Secure tunnel connects them together

## Step 1: Deploy Empire to Railway

1. Upload your empire-export folder to Railway
2. Set these environment variables in Railway dashboard:

```env
# Railway Environment Variables
NODE_ENV=production
DATABASE_URL=[Railway provides this automatically]

# Local LLM Connection (we'll set this up next)
LOCAL_AI_ENABLED=true
LOCAL_AI_URL=https://your-tunnel-url.ngrok.io
OLLAMA_BASE_URL=https://your-tunnel-url.ngrok.io

# Your models
OLLAMA_MODELS=llama3.1,deepseek-coder,mixtral,wizardcoder,llava,codellama
```

## Step 2: Set Up Local LLM Server

On your local machine where Ollama is installed:

```bash
# Start Ollama server
ollama serve

# Pull your models (if not already done)
ollama pull llama3.1:8b
ollama pull deepseek-coder:6.7b
ollama pull mixtral:8x7b
ollama pull wizardcoder
ollama pull llava
ollama pull codellama:34b-instruct
```

## Step 3: Create Secure Tunnel

Install ngrok (or similar):
```bash
# Install ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Create tunnel to your Ollama server
ngrok http 11434
```

This gives you a URL like: `https://abc123.ngrok.io`

## Step 4: Update Railway Config

In Railway dashboard, update:
```env
LOCAL_AI_URL=https://abc123.ngrok.io
OLLAMA_BASE_URL=https://abc123.ngrok.io
```

## Step 5: Test Connection

Your empire app on Railway will now connect to your local LLMs:

```bash
# Test from your deployed app
curl https://yourapp.railway.app/api/llm-brain/test
```

## Alternative: CloudFlare Tunnel (More Reliable)

Instead of ngrok, use CloudFlare Tunnel:

```bash
# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Create tunnel
cloudflared tunnel --url http://localhost:11434
```

## Benefits of This Setup

✅ Your empire runs on fast cloud infrastructure
✅ Your LLMs use your local GPU power
✅ No expensive GPU cloud costs
✅ Full control over your models
✅ Works with your existing Ollama setup

## Cost Breakdown

- Railway hosting: FREE (starter plan)
- Local electricity: ~$5-20/month
- Tunnel service: FREE (ngrok/cloudflare)
- **Total: Almost FREE vs $200+/month for GPU cloud**

## Security Notes

- Tunnel is encrypted (HTTPS)
- Only your empire app can access your LLMs
- No direct internet access to your models