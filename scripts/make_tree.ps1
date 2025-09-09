# Ultra-compact tree (root + 2 levels) ignoring heavy folders
if (-not (Test-Path docs)) { New-Item -ItemType Directory -Path docs | Out-Null }
tree /A /F | findstr /V /C:"node_modules" /C:".git" /C:"dist" /C:"build" /C:".cache" /C:"__pycache__" /C:"venv" /C:".idea" /C:"coverage" `
  | findstr /R "^[ ]*[A-Za-z0-9]" > docs/repo-structure.txt
Write-Host "Saved to docs/repo-structure.txt"
