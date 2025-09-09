from pathlib import Path
from utils.ollama_client import run_ollama
from utils.repo_scan import make_context

QA = "wizardcoder:15b"

PROMPT = """You are QA lead. Generate tests to target 90% coverage where feasible.
Deliver:
- Unit + integration test files (paths) with code snippets.
- Fixtures/mocks.
- Coverage config & CI steps.
- Risk-based test matrix.

SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    print(run_ollama(QA, PROMPT.format(snapshot=snapshot)))

if __name__ == "__main__":
    main()
