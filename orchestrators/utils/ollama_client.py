import subprocess
import shutil
from typing import Optional

def has_ollama() -> bool:
    return shutil.which("ollama") is not None

def run_ollama(model: str, prompt: str, timeout: int = 0) -> str:
    """Call: ollama run <model> "<prompt>" and return stdout."""
    if not has_ollama():
        raise RuntimeError("ollama not found on PATH. Install and ensure it's available.")
    try:
        result = subprocess.run(
            ["ollama", "run", model, prompt],
            capture_output=True, text=True, timeout=timeout if timeout > 0 else None
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"Ollama call timed out for model {model}")
    if result.returncode != 0:
        err = (result.stderr or '').strip() or 'unknown error'
        raise RuntimeError(f"Ollama failed ({model}): {err}")
    return result.stdout

def choose_model(preferred: str, fallback: Optional[str] = None) -> str:
    """Return preferred; you can extend to check `ollama list`."""
    return preferred
