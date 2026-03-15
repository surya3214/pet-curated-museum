import base64
from typing import List, Tuple, Any

from google import genai

from config.settings import GEMINI_API_KEY, GEMINI_INTERLEAVED_MODEL, MAX_DAY_MEDIA

client = genai.Client(api_key=GEMINI_API_KEY)


def _b64(data: bytes) -> str:
    return base64.b64encode(data).decode("utf-8")


def _image_input_block(image_bytes: bytes, mime_type: str) -> dict:
    return {
        "type": "image",
        "mime_type": mime_type,
        "data": _b64(image_bytes),
    }


def _to_dict(obj: Any) -> dict:
    if isinstance(obj, dict):
        return obj
    if hasattr(obj, "model_dump"):
        return obj.model_dump(exclude_none=True)
    if hasattr(obj, "__dict__"):
        return obj.__dict__
    return {"raw": str(obj)}


def _normalize_output_block(output: Any) -> dict | None:
    item = _to_dict(output)
    block_type = item.get("type")

    if block_type == "text":
        text = item.get("text", "").strip()
        if text:
            return {"type": "text", "text": text}
        return None

    if block_type == "image":
        data_base64 = item.get("data")
        mime_type = item.get("mime_type", "image/png")

        if not data_base64 and isinstance(item.get("inline_data"), dict):
            data_base64 = item["inline_data"].get("data")
            mime_type = item["inline_data"].get("mime_type", mime_type)

        if data_base64:
            return {
                "type": "image",
                "mime_type": mime_type,
                "data_base64": data_base64,
            }
        return None

    return None


def generate_interleaved_exhibit(
    prompt: str,
    pet_image: Tuple[bytes, str],
    day_media: List[Tuple[bytes, str]],
) -> dict:
    input_blocks = [
        {"type": "text", "text": prompt},
        _image_input_block(pet_image[0], pet_image[1]),
    ]

    for idx, (image_bytes, mime_type) in enumerate(day_media[:MAX_DAY_MEDIA], start=1):
        input_blocks.append({"type": "text", "text": f"Day artifact input {idx}"})
        input_blocks.append(_image_input_block(image_bytes, mime_type))

    interaction = client.interactions.create(
        model=GEMINI_INTERLEAVED_MODEL,
        input=input_blocks,
        response_modalities=["TEXT", "IMAGE"],
        generation_config={
            "image_config": {
                "aspect_ratio": "16:9",
                "image_size": "512"
            }
        },
        store=False,
    )

    # print("INTERACTION OUTPUTS RAW:")
    # for idx, output in enumerate(interaction.outputs):
    #     print(idx, repr(output))

    normalized_blocks = []
    for output in interaction.outputs:
        block = _normalize_output_block(output)
        if block is not None:
            normalized_blocks.append(block)

    return {
        "interaction_id": getattr(interaction, "id", None),
        "blocks": normalized_blocks,
    }
