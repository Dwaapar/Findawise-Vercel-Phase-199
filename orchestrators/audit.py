from pathlib import Path
from utils.ollama_client import run_ollama, choose_model
from utils.repo_scan import make_context

HEAVY = "deepseek-coder:33b-instruct"

PROMPT = """Act as an enterprise auditor (security, performance, scalability, code quality).
Read the repo snapshot and produce a DEFECT LOG:

Columns:
- severity (P0/P1/P2)
- file path(s)
- line ranges (approx ok)
- issue summary
- root cause
- proposed fix (1-3 bullet points)

Then output "Fix Patches (high-level)" describing diffs to apply.

SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    out = run_ollama(choose_model(HEAVY), PROMPT.format(snapshot=snapshot))
    print(out)

if __name__ == "__main__":
    main()
