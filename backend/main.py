from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.gemini_client import GeminiClient
from models.schemas import ExhibitResponse
from routes.exhibit import router as exhibit_router
from routes.audio import router as audio_router

app = FastAPI(title="Pet-Curated Museum API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exhibit_router)
app.include_router(audio_router)

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/health")
def health_check():
    return {"status": "ok"}

try:
    gemini_client = GeminiClient()
except Exception as e:
    print(f"Warning: {e}")
    gemini_client = None


@app.post("/api/v1/curate", response_model=ExhibitResponse)
async def create_exhibit(
    pet_photo: UploadFile = File(...),
    day_photos: List[UploadFile] = File(...),
    curator_name: Optional[str] = Form(None),
    vibe_override: Optional[str] = Form(None),
):
    if not gemini_client:
        raise HTTPException(
            status_code=500,
            detail="Gemini client not initialized. Check GEMINI_API_KEY."
        )

    try:
        pet_bytes = await pet_photo.read()
        pet_mime = pet_photo.content_type or "image/jpeg"

        processed_day_photos = []
        for photo in day_photos:
            photo_bytes = await photo.read()
            photo_mime = photo.content_type or "image/jpeg"
            processed_day_photos.append({
                "bytes": photo_bytes,
                "mime_type": photo_mime,
            })

        exhibit = gemini_client.generate_exhibit(
            pet_photo_bytes=pet_bytes,
            pet_photo_mime=pet_mime,
            day_photos=processed_day_photos,
            curator_name=curator_name,
            vibe_override=vibe_override,
        )
        return exhibit

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
