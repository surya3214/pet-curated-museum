import os
import json
from typing import List, Optional

from google import genai
from google.genai import types

from models.schemas import ExhibitResponse
from core.prompts import SYSTEM_PROMPT, build_user_prompt

ALLOWED_FONT_PAIRINGS = {"Serif-Classic", "Sans-Modern", "Monospace-Brutalist"}


class GeminiClient:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")

        self.client = genai.Client(api_key=api_key)

    def generate_exhibit(
        self,
        pet_photo_bytes: bytes,
        pet_photo_mime: str,
        day_photos: List[dict],
        curator_name: Optional[str] = None,
        vibe_override: Optional[str] = None,
    ) -> ExhibitResponse:
        user_prompt = build_user_prompt(curator_name, vibe_override)

        contents = [user_prompt]
        contents.append(
            types.Part.from_bytes(
                data=pet_photo_bytes,
                mime_type=pet_photo_mime,
            )
        )

        for photo in day_photos:
            contents.append(
                types.Part.from_bytes(
                    data=photo["bytes"],
                    mime_type=photo["mime_type"],
                )
            )

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=ExhibitResponse,
                    temperature=0.7,
                ),
            )
        except Exception as e:
            raise RuntimeError(f"API call to Gemini failed: {e}")

        if not response.text:
            raise RuntimeError("Received empty response from Gemini.")

        try:
            data = json.loads(response.text)
        except Exception as e:
            raise RuntimeError(
                f"Failed to parse Gemini response as JSON: {e}\nResponse text: {response.text}"
            )

        render_manifest = data.get("render_manifest", {})
        font_pairing = render_manifest.get("font_pairing")

        if font_pairing not in ALLOWED_FONT_PAIRINGS:
            render_manifest["font_pairing"] = "Serif-Classic"

        if not render_manifest.get("background_hex"):
            render_manifest["background_hex"] = "#F5F1E8"

        data["render_manifest"] = render_manifest

        try:
            return ExhibitResponse(**data)
        except Exception as e:
            raise RuntimeError(f"Failed to validate Gemini response: {e}")
