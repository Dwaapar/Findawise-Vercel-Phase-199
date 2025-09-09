import sys
from pathlib import Path
from utils.ollama_client import run_ollama, choose_model
from utils.repo_scan import make_context

PLANNER_MODEL = "mixtral:8x7b-instruct"

TEMPLATE = """You are the in-repo CTO and principal architect.
Analyze the repository snapshot below and produce a concrete UPGRADE PLAN.

Return strictly this structure:

# System Map
- Stacks, services, build tools, packages

# Risks (P0/P1/P2)
- Each item: <area> — <risk> — <files/paths>

# Upgrade Plan (Milestones)
- M1, M2, M3: goals, sub-tasks

# WBS (Work Breakdown)
- Task -> files to touch (paths), tech approach

# Backend Priorities
# Frontend Priorities
# DevEx / Observability
# Rollout & Rollback Strategy

--- REPO SNAPSHOT START ---
{snapshot}
--- REPO SNAPSHOT END ---
"""

def main():
    root = Path(".").resolve()
    snapshot = make_context(root)
    prompt = TEMPLATE.format(snapshot=snapshot)
    model = choose_model(PLANNER_MODEL)
    out = run_ollama(model, prompt)
    print(out)

if __name__ == "__main__":
    main()
