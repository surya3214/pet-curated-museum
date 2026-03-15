export interface PersonaSummary {
  archetype: string;
  tone_description: string;
}

export interface ExhibitTitle {
  title: string;
  subtitle: string;
}

export interface RenderManifest {
  background_hex: string;
  font_pairing: string;
}

export interface SubtitleSegment {
  segment_text: string;
  start_ms: number;
  end_ms: number;
}

export interface ArtifactCard {
  artifact_id: number;
  artwork_title: string;
  medium: string;
  estimated_year?: string | null;
  plaque_text: string;
  narration_script: string;
  subtitle_segments: SubtitleSegment[];
}

export interface ExhibitResponse {
  persona_summary: PersonaSummary;
  exhibit_title: ExhibitTitle;
  render_manifest: RenderManifest;
  artifact_cards: ArtifactCard[];
}

export type TextBlock = {
  type: "text";
  text: string;
  audio_base64?: string;
  audio_mime_type?: string;
};

export type ImageBlock = {
  type: "image";
  mime_type: string;
  data_base64: string;
};

export type ExhibitBlock = TextBlock | ImageBlock;

export type InterleavedExhibitResponse = {
  interaction_id?: string | null;
  blocks: ExhibitBlock[];
};
