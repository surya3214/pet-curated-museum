import React from 'react';
import ReactMarkdown from 'react-markdown';
import { InterleavedExhibitResponse } from '../types/exhibit';

interface ExhibitGalleryProps {
  exhibit: InterleavedExhibitResponse;
  dayPhotoUrls?: string[];
}

export const ExhibitGallery: React.FC<ExhibitGalleryProps> = ({ exhibit }) => {
  return (
    <div className="p-8 rounded-xl shadow-lg bg-white border border-neutral-200">
      <header className="text-center mb-10 border-b border-black/10 pb-8">
        <p className="uppercase tracking-widest text-sm text-neutral-500 mb-3">
          Pet-Curated Museum of a Day
        </p>
        <h1 className="text-4xl font-serif font-bold mb-3">Mixed-Media Exhibit</h1>
        <p className="text-neutral-600">
          Rendered from Gemini interleaved output
        </p>
      </header>

      <div className="space-y-8">
        {exhibit.blocks.map((block, index) => {
          if (block.type === 'text') {
            return (
              <section
                key={`text-${index}`}
                className="bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-sm"
              >
                <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl">
                  <ReactMarkdown>{block.text}</ReactMarkdown>
                </article>
              </section>
            );
          }

          if (block.type === 'image') {
            return (
              <section
                key={`image-${index}`}
                className="overflow-hidden rounded-xl border border-stone-200 shadow-sm bg-white"
              >
                <img
                  src={`data:${block.mime_type};base64,${block.data_base64}`}
                  alt={`Exhibit block ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
