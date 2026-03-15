from pydantic import BaseModel
from typing import List

class PersonaSummary(BaseModel):
    archetype: str
    tone_description: str

class ExhibitTitle(BaseModel):
    title: str
    subtitle: str

class RenderManifest(BaseModel):
    background_hex: str
    font_pairing: str

class SubtitleSegment(BaseModel):
    segment_text: str
    start_ms: int
    end_ms: int

class ArtifactCard(BaseModel):
    artifact_id: int
    artwork_title: str
    medium: str
    estimated_year: str
    plaque_text: str
    narration_script: str
    subtitle_segments: List[SubtitleSegment]

class ExhibitResponse(BaseModel):
    persona_summary: PersonaSummary
    exhibit_title: ExhibitTitle
    render_manifest: RenderManifest
    artifact_cards: List[ArtifactCard]