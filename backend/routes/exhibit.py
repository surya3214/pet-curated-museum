from typing import List

from fastapi import APIRouter, File, UploadFile, HTTPException
from prompts.interleaved_exhibit_prompt import INTERLEAVED_EXHIBIT_PROMPT
from services.interleaved_exhibit_service import generate_interleaved_exhibit

router = APIRouter(prefix="/api/exhibit", tags=["exhibit"])


@router.post("/interleaved")
async def create_interleaved_exhibit(
    pet_image: UploadFile = File(...),
    day_media: List[UploadFile] = File(...),
):
    if not day_media:
        raise HTTPException(status_code=400, detail="At least one day_media file is required")

    pet_bytes = await pet_image.read()
    pet_mime = pet_image.content_type or "image/jpeg"

    media_payload = []
    for f in day_media:
        media_payload.append((await f.read(), f.content_type or "image/jpeg"))

    result = generate_interleaved_exhibit(
        prompt=INTERLEAVED_EXHIBIT_PROMPT,
        pet_image=(pet_bytes, pet_mime),
        day_media=media_payload,
    )
    return result
