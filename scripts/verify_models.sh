#!/usr/bin/env bash
set -euo pipefail
PULL=${1:-}

required=(
  "mixtral:8x7b-instruct"
  "deepseek-coder:33b-instruct"
  "deepseek-coder:6.7b"
  "wizardcoder:15b"
  "llama3.1:latest"
  "llava:7b-v1.6"
)

installed=$(ollama list | awk '{print $1}')

missing=()
for m in "${required[@]}"; do
  if ! echo "$installed" | grep -qx "$m"; then
    missing+=("$m")
  fi
done

if [ ${#missing[@]} -eq 0 ]; then
  echo "All required models are present."
else
  echo "Missing models:"
  for m in "${missing[@]}"; do echo " - $m"; done
  if [ "$PULL" = "--pull" ]; then
    for m in "${missing[@]}"; do ollama pull "$m"; done
  else
    echo "Re-run with --pull to pull them automatically."
  fi
  exit 1
fi
