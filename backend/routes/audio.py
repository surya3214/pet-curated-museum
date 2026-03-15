from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

from services.tts_service import synthesize_text_block

router = APIRouter(prefix="/api/audio", tags=["audio"])

class SpeakRequest(BaseModel):
    text: str

@router.post("/speak-block")
async def speak_block(req: SpeakRequest):
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    wav_bytes = synthesize_text_block(text)
    return Response(content=wav_bytes, media_type="audio/wav")
