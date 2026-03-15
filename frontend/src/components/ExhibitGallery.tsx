import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { InterleavedExhibitResponse, TextBlock } from '../types/exhibit';
import { APP_ASSETS } from '../config/constants';

interface ExhibitGalleryProps {
  exhibit: InterleavedExhibitResponse;
  dayPhotoUrls?: string[];
}

type ParsedTextBlock = {
  title: string;
  body: string;
};

type TextBlockMeta = {
  overline: string;
  displayTitle: string;
  body: string;
};

function parseTextBlock(text: string): ParsedTextBlock {
  const lines = text.split('\n');
  let title = '';
  let titleLineIndex = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i].trim();
    if (!raw) continue;

    const headingMatch = raw.match(/^#{1,6}\s+(.*)$/);
    if (headingMatch) {
      title = headingMatch[1].trim();
      titleLineIndex = i;
      break;
    }
  }

  const remainingLines =
    titleLineIndex >= 0
      ? lines.filter((_, idx) => idx !== titleLineIndex)
      : lines;

  let body = remainingLines.join('\n').trim();

  const titleLooksTooLong =
    !title ||
    title.length > 80 ||
    /[.!?]$/.test(title) ||
    title.split(' ').length > 10;

  if (titleLooksTooLong) {
    body = [title, body].filter(Boolean).join('\n\n').trim();
    title = '';
  }

  return {
    title,
    body,
  };
}

export const ExhibitGallery: React.FC<ExhibitGalleryProps> = ({ exhibit }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const textBlockIndices = useMemo(() => {
    return exhibit.blocks.reduce<number[]>((acc, block, index) => {
      if (block.type === 'text') acc.push(index);
      return acc;
    }, []);
  }, [exhibit.blocks]);

  const textBlockMeta = useMemo(() => {
    let artifactCounter = 0;
    const firstTextIndex = textBlockIndices[0];
    const lastTextIndex = textBlockIndices[textBlockIndices.length - 1];

    return exhibit.blocks.map<TextBlockMeta | null>((block, index) => {
      if (block.type !== 'text') return null;

      const parsed = parseTextBlock(block.text);
      const fallbackTitle =
        index === firstTextIndex
          ? 'Welcome to the Museum of a Day'
          : index === lastTextIndex
          ? 'Closing Remarks'
          : `Curatorial Note ${artifactCounter + 1}`;

      if (index === firstTextIndex) {
        return {
          overline: 'Opening Note',
          displayTitle: parsed.title || fallbackTitle,
          body: parsed.body,
        };
      }

      if (index === lastTextIndex && index !== firstTextIndex) {
        return {
          overline: 'Final Note',
          displayTitle: parsed.title || fallbackTitle,
          body: parsed.body,
        };
      }

      artifactCounter += 1;
      return {
        overline: `Artifact ${artifactCounter}`,
        displayTitle: parsed.title || fallbackTitle,
        body: parsed.body,
      };
    });
  }, [exhibit.blocks, textBlockIndices]);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const playEmbeddedAudio = async (
    audioBase64: string | undefined,
    mimeType: string | undefined,
    index: number
  ) => {
    if (!audioBase64) {
      alert('No pre-generated audio available for this plaque yet.');
      return;
    }

    try {
      cleanupAudio();
      setPlayingIndex(index);

      const byteChars = atob(audioBase64);
      const byteNumbers = new Array(byteChars.length);

      for (let i = 0; i < byteChars.length; i += 1) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType || 'audio/wav' });
      const blobUrl = URL.createObjectURL(blob);
      currentAudioUrlRef.current = blobUrl;

      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.onended = () => {
        cleanupAudio();
        setPlayingIndex(null);
      };

      audio.onerror = () => {
        cleanupAudio();
        setPlayingIndex(null);
      };

      await audio.play();
    } catch (error) {
      console.error(error);
      cleanupAudio();
      setPlayingIndex(null);
      alert('Could not play curator narration.');
    }
  };

  const stopAudio = () => {
    cleanupAudio();
    setPlayingIndex(null);
  };

  return (
    <div className="overflow-hidden rounded-[30px] border border-stone-200 bg-[#f7f3ee] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
      <header className="relative">
        <div className="relative min-h-[280px] md:min-h-[360px]">
          <img
            src={APP_ASSETS.titleCardBg}
            alt="Gallery title card background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/55" />

          <div className="relative z-10 flex min-h-[280px] md:min-h-[360px] items-end">
            <div className="w-full px-6 py-8 md:px-10 md:py-12 text-white">
              <p className="mb-4 text-sm md:text-[0.95rem] uppercase tracking-[0.38em] text-white/85">
                Pet-Curated Museum of a Day
              </p>

              <h1 className="max-w-4xl font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                Daily Exhibition Catalog
              </h1>

              <p className="mt-4 max-w-2xl text-[1.02rem] md:text-[1.08rem] leading-7 text-white/85">
                A curated record of the day’s disturbances, observations, and
                temporary human fixations, reviewed under feline authority.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center bg-[#f7f3ee] px-6 py-2">
          <img
            src={APP_ASSETS.divider}
            alt="Decorative divider"
            className="block h-auto max-w-[220px] opacity-85 md:max-w-[280px]"
          />
        </div>
      </header>

      <div className="px-4 pb-6 md:px-6 md:pb-8">
        <div className="space-y-10">
          {exhibit.blocks.map((block, index) => {
            if (block.type === 'text') {
              const meta = textBlockMeta[index];
              const isPlaying = playingIndex === index;

              if (!meta) return null;

              return (
                <section
                  key={`text-${index}`}
                  className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] px-6 py-6 shadow-sm md:px-8 md:py-8"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-4 text-sm md:text-[0.95rem] uppercase tracking-[0.34em] text-stone-500">
                        {meta.overline}
                      </div>

                      <h2 className="max-w-5xl font-serif text-[2.35rem] leading-tight tracking-tight text-stone-900 md:text-[3.1rem]">
                        {meta.displayTitle}
                      </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() =>
                          playEmbeddedAudio(
                            (block as TextBlock).audio_base64,
                            (block as TextBlock).audio_mime_type,
                            index
                          )
                        }
                        disabled={isPlaying || !(block as TextBlock).audio_base64}
                        className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPlaying ? 'Playing...' : 'Play audio'}
                      </button>

                      {isPlaying && (
                        <button
                          onClick={stopAudio}
                          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </div>

                  <article className="prose prose-stone max-w-none prose-p:font-serif prose-p:text-[1.18rem] prose-p:leading-9 prose-p:text-stone-700 prose-em:text-stone-800 prose-strong:text-stone-900">
                    <ReactMarkdown>{meta.body}</ReactMarkdown>
                  </article>
                </section>
              );
            }

            if (block.type === 'image') {
              return (
                <section
                  key={`image-${index}`}
                  className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-sm"
                >
                  <img
                    src={`data:${block.mime_type};base64,${block.data_base64}`}
                    alt={`Exhibit block ${index + 1}`}
                    className="h-auto w-full object-cover"
                  />
                </section>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
