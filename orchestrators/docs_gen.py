from pathlib import Path
from utils.ollama_client import run_ollama
from utils.repo_scan import make_context

DOCS = "llama3.1:latest"

PROMPT = """You are a technical writer.
Deliver:
- README quickstart (env, scripts)
- CONTRIBUTING
- SECURITY
- ADRs (key decisions)
- Release Notes vNEXT
- Any missing docs inferred from repo.

SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    print(run_ollama(DOCS, PROMPT.format(snapshot=snapshot)))

if __name__ == "__main__":
    main()
