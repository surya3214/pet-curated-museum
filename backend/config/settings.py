import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_INTERLEAVED_MODEL = os.getenv(
    "GEMINI_INTERLEAVED_MODEL",
    "gemini-3.1-flash-image-preview"
)
GEMINI_TTS_MODEL = os.getenv("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
GEMINI_TTS_VOICE = os.getenv("GEMINI_TTS_VOICE", "Kore")
MAX_DAY_MEDIA = int(os.getenv("MAX_DAY_MEDIA", "4"))
PORT = int(os.getenv("PORT", "8080"))
