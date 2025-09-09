#!/usr/bin/env bash
set -euo pipefail

# Start server (background)
if ! pgrep -x "ollama" >/dev/null; then
  nohup ollama serve >/tmp/ollama.log 2>&1 &
  sleep 2
fi

# Pull models (idempotent)
# Check and use existing models that user already has
echo "Checking for existing models..."

# List available models
echo "Available models:"
ollama list

# Only pull if not already available (matching user's models)
if ! ollama list | grep -q "llama3.1:latest"; then
    echo "Pulling llama3.1:latest..."
    ollama pull llama3.1:latest
else
    echo "✅ llama3.1:latest already available"
fi

if ! ollama list | grep -q "nomic-embed-text:latest"; then
    echo "Pulling nomic-embed-text:latest..."
    ollama pull nomic-embed-text:latest
else
    echo "✅ nomic-embed-text:latest already available"
fi

if ! ollama list | grep -q "wizardcoder:latest"; then
    echo "Pulling wizardcoder:latest..."
    ollama pull wizardcoder:latest
else
    echo "✅ wizardcoder:latest already available"
fi

if ! ollama list | grep -q "deepseek-coder:6.7b"; then
    echo "Pulling deepseek-coder:6.7b..."
    ollama pull deepseek-coder:6.7b
else
    echo "✅ deepseek-coder:6.7b already available"
fi

echo "✅ AI models setup completed - using your existing models"

echo "Ollama ready at http://localhost:11434"
