# Verifies required Ollama models exist; pulls missing ones if -PullMissing is passed
param([switch]$PullMissing)

$required = @(
  "mixtral:8x7b-instruct",
  "deepseek-coder:33b-instruct",
  "deepseek-coder:6.7b",
  "wizardcoder:15b",
  "llama3.1:latest",
  "llava:7b-v1.6"
)

$installed = (ollama list | Select-String "^[^ ]+" -AllMatches).Matches.Value | Select-Object -Unique

$missing = @()
foreach ($m in $required) {
  if (-not ($installed -contains $m)) { $missing += $m }
}

if ($missing.Count -eq 0) {
  Write-Host "All required models are present." -ForegroundColor Green
  exit 0
} else {
  Write-Host "Missing models:" -ForegroundColor Yellow
  $missing | ForEach-Object { Write-Host " - $_" }
  if ($PullMissing) {
    $missing | ForEach-Object { ollama pull $_ }
  } else {
    Write-Host "Run with -PullMissing to pull them automatically."
  }
  exit 1
}
