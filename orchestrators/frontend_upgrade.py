from pathlib import Path
from utils.ollama_client import run_ollama
from utils.repo_scan import make_context

HEAVY = "deepseek-coder:33b-instruct"

PROMPT = """Frontend modernization (React/TS recommended unless otherwise).
Deliver:
- Componentization, state mgmt, a11y (WCAG), lazy-loading, code-splitting, remove unused CSS.
- Error/empty/loading states.
- Unified diffs + updated README sections.
- Keep routing stable.

SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    print(run_ollama(HEAVY, PROMPT.format(snapshot=snapshot)))

if __name__ == "__main__":
    main()
