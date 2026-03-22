from fastapi import APIRouter, HTTPException
from app.models.schema import AnalyzeRequest, AnalyzeResponse
from app.services.analyzer import run_analysis

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    try:
        result = await run_analysis(req.model_dump())
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
