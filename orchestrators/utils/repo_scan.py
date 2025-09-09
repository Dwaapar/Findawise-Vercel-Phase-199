from pathlib import Path
from typing import List

DEFAULT_IGNORE = {
    "node_modules", ".git", "dist", "build", ".cache", "__pycache__", "venv",
    ".idea", "coverage", ".turbo", ".next", ".pnpm-store", ".pytest_cache"
}

TEXT_EXT = {
    ".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".py", ".toml", ".yaml", ".yml",
    ".go", ".rs", ".java", ".kt", ".c", ".cpp", ".h", ".hpp",
    ".css", ".scss", ".html", ".sql", ".sh", ".ps1"
}

def list_files(root: Path, max_files: int = 800, max_size_kb: int = 300) -> List[Path]:
    files: List[Path] = []
    for p in root.rglob("*"):
        if p.is_dir():
            name = p.name.lower()
            if name in DEFAULT_IGNORE or name.startswith("."):
                continue
        else:
            if p.suffix.lower() in TEXT_EXT:
                try:
                    if p.stat().st_size <= max_size_kb * 1024:
                        files.append(p)
                        if len(files) >= max_files:
                            break
                except OSError:
                    continue
    return files

def make_context(root: Path, limit_chars: int = 120_000) -> str:
    parts = []
    for f in list_files(root):
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        header = f"\n\n## FILE: {f.as_posix()}\n"
        parts.append(header + text[:5000])
        if sum(len(x) for x in parts) > limit_chars:
            break
    return "".join(parts) if parts else "No files collected."
