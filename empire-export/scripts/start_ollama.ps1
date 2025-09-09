# Starts ollama serve and pulls required models
$ErrorActionPreference = "Stop"

# Start ollama serve if not running
try {
  Get-Process ollama -ErrorAction Stop | Out-Null
} catch {
  Start-Process "ollama" -ArgumentList "serve" | Out-Null
  Start-Sleep -Seconds 2
}

# Pull models (safe to re-run)
ollama pull mixtral:8x7b-instruct
ollama pull deepseek-coder:33b-instruct
ollama pull deepseek-coder:6.7b
ollama pull wizardcoder:15b
ollama pull llama3.1:latest
ollama pull llava:7b-v1.6

Write-Host "Ollama is ready on http://localhost:11434" -ForegroundColor Green
