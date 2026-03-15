import base64
import io
import wave

from google import genai
from google.genai import types

from config.settings import GEMINI_API_KEY, GEMINI_TTS_MODEL, GEMINI_TTS_VOICE
from prompts.tts_prompt import build_tts_prompt

client = genai.Client(api_key=GEMINI_API_KEY)


def _to_pcm_bytes(data) -> bytes:
    if isinstance(data, bytes):
        try:
            return base64.b64decode(data, validate=True)
        except Exception:
            return data

    if isinstance(data, str):
        try:
            return base64.b64decode(data, validate=True)
        except Exception:
            return data.encode("utf-8")

    raise TypeError(f"Unsupported audio payload type: {type(data)}")


def _pcm_to_wav_bytes(pcm_bytes: bytes, channels: int = 1, rate: int = 24000, sample_width: int = 2) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_bytes)
    return buf.getvalue()


def synthesize_text_block(text: str) -> bytes:
    prompt = build_tts_prompt(text)

    response = client.models.generate_content(
        model=GEMINI_TTS_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=GEMINI_TTS_VOICE
                    )
                )
            ),
        ),
    )

    raw_data = response.candidates[0].content.parts[0].inline_data.data
    pcm_bytes = _to_pcm_bytes(raw_data)
    wav_bytes = _pcm_to_wav_bytes(pcm_bytes)

    return wav_bytes
