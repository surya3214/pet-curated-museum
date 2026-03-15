import os
import json
from typing import List, Optional

import google.generativeai as genai

from core.prompts import SYSTEM_PROMPT
from models.schemas import ExhibitResponse

ALLOWED_FONT_PAIRINGS = {"Serif-Classic", "Sans-Modern", "Monospace-Brutalist"}


class GeminiClient:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=SYSTEM_PROMPT,
        )

    def generate_exhibit(
        self,
        pet_photo_bytes: bytes,
        pet_photo_mime: str,
        day_photos: List[dict],
        curator_name: Optional[str] = None,
        vibe_override: Optional[str] = None,
    ) -> ExhibitResponse:
        curator_line = (
            f"Curator name override: {curator_name}."
            if curator_name
            else "No curator name override."
        )
        vibe_line = (
            f"Vibe override: {vibe_override}."
            if vibe_override
            else "No vibe override."
        )

        user_prompt = f"""
Create one complete museum exhibit from the provided images.

Rules:
- The first image is the pet portrait that seeds the fictional curator persona.
- The remaining images are the day artifacts.
- Keep all writing grounded in visible content.
- Keep the tone satirical, curated, biased, and museum-like.
- Do not sound like a product analyst or UX reviewer.
- Return valid JSON only.

{curator_line}
{vibe_line}
"""

        contents = [user_prompt]
        contents.append({
            "mime_type": pet_photo_mime,
            "data": pet_photo_bytes,
        })

        for photo in day_photos:
            contents.append({
                "mime_type": photo["mime_type"],
                "data": photo["bytes"],
            })

        response = self.model.generate_content(
            contents,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=ExhibitResponse,
                temperature=0.7,
            ),
        )

        try:
            data = json.loads(response.text)
        except Exception as e:
            raise RuntimeError(
                f"Failed to parse Gemini response: {e}\nResponse text: {response.text}"
            )

        render_manifest = data.get("render_manifest", {})
        font_pairing = render_manifest.get("font_pairing")

        if font_pairing not in ALLOWED_FONT_PAIRINGS:
            render_manifest["font_pairing"] = "Serif-Classic"

        if not render_manifest.get("background_hex"):
            render_manifest["background_hex"] = "#F5F1E8"

        data["render_manifest"] = render_manifest

        return ExhibitResponse(**data)
