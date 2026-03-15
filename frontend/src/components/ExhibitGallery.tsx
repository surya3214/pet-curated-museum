import React from 'react';
import { ExhibitResponse } from '../types/exhibit';
import { ArtifactCard } from './ArtifactCard';
import { FONT_PAIRINGS } from '../config/vibes';

interface ExhibitGalleryProps {
  exhibit: ExhibitResponse;
  dayPhotoUrls: string[];
}

export const ExhibitGallery: React.FC<ExhibitGalleryProps> = ({ exhibit, dayPhotoUrls }) => {
  const fontStyle =
    FONT_PAIRINGS[exhibit.render_manifest.font_pairing as keyof typeof FONT_PAIRINGS]?.fontFamily || 'inherit';

  return (
    <div
      className="p-8 rounded-xl shadow-lg"
      style={{
        backgroundColor: exhibit.render_manifest.background_hex,
        fontFamily: fontStyle,
      }}
    >
      <header className="text-center mb-16 border-b border-black/10 pb-12">
        <p className="uppercase tracking-widest text-sm text-neutral-500 mb-4">
          Curator: {exhibit.persona_summary.archetype}
        </p>
        <h1 className="text-5xl font-bold mb-4">{exhibit.exhibit_title.title}</h1>
        <h2 className="text-2xl text-neutral-600 italic">{exhibit.exhibit_title.subtitle}</h2>
      </header>

      <div className="space-y-24">
        {exhibit.artifact_cards.map((card, index) => (
          <ArtifactCard
            key={card.artifact_id}
            card={card}
            imageUrl={dayPhotoUrls[index] ?? null}
          />
        ))}
      </div>
    </div>
  );
};
