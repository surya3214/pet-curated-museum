import React from 'react';
import { ArtifactCard as ArtifactCardType } from '../types/exhibit';
import { AudioPlayer } from './AudioPlayer';

interface ArtifactCardProps {
  card: ArtifactCardType;
  imageUrl: string | null;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ card, imageUrl }) => {
  return (
    <div className="flex flex-col md:flex-row gap-12 items-center bg-white/50 p-8 rounded border border-black/5">
      <div className="w-full md:w-1/2 flex justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={card.artwork_title}
            className="w-full h-80 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="w-full h-80 bg-neutral-200 flex items-center justify-center rounded shadow-inner text-neutral-400 italic">
            Artifact Image [{card.artifact_id}]
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 space-y-6">
        <div>
          <h3 className="text-3xl font-bold mb-2">{card.artwork_title}</h3>
          <p className="text-sm text-neutral-500 uppercase tracking-wide">
            {card.medium} • {card.estimated_year}
          </p>
        </div>

        <div className="pl-4 border-l-2 border-neutral-300">
          <p className="text-lg leading-relaxed text-neutral-700">
            {card.plaque_text}
          </p>
        </div>

        <div className="pt-6 border-t border-black/10">
          <p className="text-sm font-semibold mb-4 text-neutral-500 uppercase tracking-widest">
            Curator's Audio Guide
          </p>
          <AudioPlayer narrationScript={card.narration_script} />
        </div>
      </div>
    </div>
  );
};
