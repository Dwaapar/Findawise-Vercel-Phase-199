# Simple local runner: adjust commands per your stacks
Write-Host "Backend tests..." -ForegroundColor Cyan
if (Test-Path backend) {
  Push-Location backend
  if (Test-Path requirements.txt) { pip install -r requirements.txt }
  if (Get-Command pytest -ErrorAction SilentlyContinue) { pytest } else { Write-Host "pytest not installed" }
  Pop-Location
}

Write-Host "Frontend tests..." -ForegroundColor Cyan
if (Test-Path frontend) {
  Push-Location frontend
  if (Test-Path package.json) { npm ci; npm test --silent || exit 1 }
  Pop-Location
}

Write-Host "Docs lint..." -ForegroundColor Cyan
if (Test-Path docs) {
  Write-Host "Consider markdownlint or vale here."
}
Write-Host "Done."
