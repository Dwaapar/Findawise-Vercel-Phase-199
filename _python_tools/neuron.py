import asyncio
import os
from typing import Any, Dict


import requests
from fastapi import FastAPI

app = FastAPI()

NEURON_ID = os.getenv("NEURON_ID", "python-neuron")
FEDERATION_API = os.getenv("FEDERATION_API", "http://localhost:3000")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
HEARTBEAT_INTERVAL = int(os.getenv("HEARTBEAT_INTERVAL", "60"))


async def register() -> None:
    """Register this neuron with the federation."""
    payload = {
        "neuronId": NEURON_ID,
        "name": "Python Example Neuron",
        "language": "python",
        "baseUrl": BASE_URL,
        "healthcheckEndpoint": "/health",
        "apiEndpoints": [
            {"path": "/process", "method": "POST", "description": "Echo input"}
        ],
    }
    try:
        requests.post(f"{FEDERATION_API}/api/neuron/register", json=payload, timeout=5)
    except Exception as exc:  # pragma: no cover - best effort
        print(f"Registration failed: {exc}")


async def heartbeat() -> None:
    """Send periodic heartbeat messages."""
    while True:
        try:
            requests.post(
                f"{FEDERATION_API}/api/neuron/status",
                json={"neuronId": NEURON_ID, "status": "active"},
                timeout=5,
            )
        except Exception as exc:  # pragma: no cover - best effort
            print(f"Heartbeat failed: {exc}")
        await asyncio.sleep(HEARTBEAT_INTERVAL)


@app.on_event("startup")
async def on_startup() -> None:
    await register()
    asyncio.create_task(heartbeat())


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/process")
async def process(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Echo the received payload back to the caller."""
    return {"received": payload}
