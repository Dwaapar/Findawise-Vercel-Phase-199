#!/usr/bin/env bash
set -euo pipefail
mkdir -p docs
tree -L 2 -a -I 'node_modules|.git|dist|build|.cache|__pycache__|venv|.idea|coverage|.next|.turbo|.pnpm-store|.pytest_cache' > docs/repo-structure.txt
echo "Saved to docs/repo-structure.txt"
