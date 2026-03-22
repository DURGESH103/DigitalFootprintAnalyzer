from fastapi import APIRouter
from app.models.schema import ChatRequest, ChatResponse
from app.services.analyzer import run_chat

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = await run_chat(req.context, [m.model_dump() for m in req.history], req.message)
    return ChatResponse(reply=reply)
