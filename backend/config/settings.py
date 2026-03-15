import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_INTERLEAVED_MODEL = os.getenv(
    "GEMINI_INTERLEAVED_MODEL",
    "gemini-3.1-flash-image-preview"
)
MAX_DAY_MEDIA = int(os.getenv("MAX_DAY_MEDIA", "4"))
PORT = int(os.getenv("PORT", "8080"))
