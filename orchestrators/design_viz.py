from pathlib import Path
from utils.ollama_client import run_ollama
from utils.repo_scan import make_context

DESIGN = "llava:7b-v1.6"

PROMPT = """You are a design-to-code specialist (no external images provided).
- Propose modern UI (React + Tailwind) components with variants.
- Provide a small style guide: palette, type scale, spacing, radius.
- Include accessibility notes.
- Return unified diffs and new file list.

SNAPSHOT:
{snapshot}
"""

def main():
    snapshot = make_context(Path("."))
    print(run_ollama(DESIGN, PROMPT.format(snapshot=snapshot)))

if __name__ == "__main__":
    main()
