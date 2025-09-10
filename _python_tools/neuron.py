import asyncio
from fastapi import FastAPI

app = FastAPI()


async def heartbeat() -> None:
    """Send periodic heartbeat signal."""
    while True:
        await asyncio.sleep(60)


heartbeat_task: asyncio.Task | None = None


@app.on_event("startup")
async def start_heartbeat() -> None:
    """Start the heartbeat background task."""
    global heartbeat_task
    heartbeat_task = asyncio.create_task(heartbeat())


@app.on_event("shutdown")
async def stop_heartbeat() -> None:
    """Cancel the heartbeat task on shutdown."""
    global heartbeat_task
    if heartbeat_task:
        heartbeat_task.cancel()
        try:
            await heartbeat_task
        except asyncio.CancelledError:
            pass
