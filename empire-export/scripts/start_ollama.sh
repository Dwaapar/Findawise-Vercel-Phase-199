#!/usr/bin/env bash
set -euo pipefail

# Start server (background)
if ! pgrep -x "ollama" >/dev/null; then
  nohup ollama serve >/tmp/ollama.log 2>&1 &
  sleep 2
fi

# Pull models (idempotent)
ollama pull mixtral:8x7b-instruct
ollama pull deepseek-coder:33b-instruct
ollama pull deepseek-coder:6.7b
ollama pull wizardcoder:15b
ollama pull llama3.1:latest
ollama pull llava:7b-v1.6

echo "Ollama ready at http://localhost:11434"
