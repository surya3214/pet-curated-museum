import os

class Settings:
    PROJECT_NAME: str = "Pet-Curated Museum of a Day"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()