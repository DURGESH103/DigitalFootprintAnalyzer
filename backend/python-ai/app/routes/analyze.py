from fastapi import APIRouter, HTTPException
from app.models.schema import AnalyzeRequest, AnalyzeResponse
from app.services.analyzer import run_analysis

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    try:
        result = await run_analysis(payload.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
