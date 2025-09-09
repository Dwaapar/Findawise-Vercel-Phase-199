from pathlib import Path
from utils.ollama_client import run_ollama, choose_model
from utils.repo_scan import make_context

HEAVY = "deepseek-coder:33b-instruct"

PROMPT = """Backend upgrade & feature implementation.

Deliver:
1) Arch changes (ports/adapters), validation, pagination, idempotency, rate limits, caching.
2) Observability hooks: structured logs, metrics stubs, tracing.
3) DB migrations (PostgreSQL via Drizzle): forward + rollback SQL.
4) Unified diffs for all files.

SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    print(run_ollama(choose_model(HEAVY), PROMPT.format(snapshot=snapshot)))

if __name__ == "__main__":
    main()
