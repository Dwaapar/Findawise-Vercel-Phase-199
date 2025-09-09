from pathlib import Path
from utils.ollama_client import run_ollama
from utils.repo_scan import make_context

FAST = "deepseek-coder:6.7b"

PROMPT = """You are a Senior Refactorer.
Constraints: keep public API stable; safer incremental changes.

Return unified diffs only. Group by module; include commit titles.

FOCUS AREAS:
- naming/typing
- error handling/logging
- remove dead code/duplication
- small functions
- input validation

REPO SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    print(run_ollama(FAST, PROMPT.format(snapshot=snapshot)))

if __name__ == "__main__":
    main()
