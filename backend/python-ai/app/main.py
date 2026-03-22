from fastapi import FastAPI
from app.routes.analyze import router

app = FastAPI(title="Digital Footprint AI Service", version="1.0.0")

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
