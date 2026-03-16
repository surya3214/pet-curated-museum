import React, { useMemo, useState } from 'react';
import { MIN_DAY_PHOTOS, MAX_DAY_PHOTOS } from '../config/constants';

interface UploadFormProps {
  onSubmit: (formData: FormData) => void;
}

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How Pet-Curated Museum works"
        className="w-full max-w-2xl rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-6 md:p-8 shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-stone-500">
              Visitor Guide
            </p>
            <h3 className="font-serif text-3xl tracking-tight text-stone-900">
              How this works
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 text-[0.98rem] leading-7 text-stone-700">
          <p>
            Pet-Curated Museum of a Day turns your daily photos into a small AI-generated museum
            exhibit narrated by your pet.
          </p>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              What to upload
            </h4>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-stone-900">1 pet photo</span> — this creates
                the curator persona, including the tone, personality, and narration style.
              </li>
              <li>
                <span className="font-semibold text-stone-900">3 to 5 day photos</span> — these
                become the museum artifacts your pet curator interprets.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              What happens next
            </h4>
            <p>
              The app analyzes all uploaded images together, builds a curator persona from the pet
              portrait, and then creates a themed exhibit with artifact cards, exhibit text, and
              narration in the same voice.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Best results
            </h4>
            <p>
              Use a clear pet portrait and 3 to 5 photos from a single day or outing so the final
              exhibit feels more coherent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [dayPhotos, setDayPhotos] = useState<FileList | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const dayPhotoCount = dayPhotos?.length ?? 0;

  const dayPhotoSummary = useMemo(() => {
    if (!dayPhotos || dayPhotos.length === 0) return 'No day photos selected yet.';
    if (dayPhotos.length === 1) return '1 day photo selected.';
    return `${dayPhotos.length} day photos selected.`;
  }, [dayPhotos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!petPhoto) {
      return alert('Please upload exactly 1 curator photo for your pet.');
    }

    if (!dayPhotos || dayPhotos.length < MIN_DAY_PHOTOS || dayPhotos.length > MAX_DAY_PHOTOS) {
      return alert(`Please upload between ${MIN_DAY_PHOTOS} and ${MAX_DAY_PHOTOS} day photos.`);
    }

    const formData = new FormData();
    formData.append('pet_photo', petPhoto);

    Array.from(dayPhotos).forEach((file) => {
      formData.append('day_photos', file);
    });

    onSubmit(formData);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-stone-500">
              Submission form
            </p>
            <h3 className="font-serif text-2xl tracking-tight text-stone-900">
              Commission an exhibit
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 shadow-md shadow-amber-100/60 transition hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-200"
          >
            <span className="text-base leading-none">?</span>
            <span>Help</span>
          </button>

        </div>

        <div className="mb-6 rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="block text-base font-semibold text-stone-900">
              1. Choose your curator
            </label>

            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 border border-stone-200">
              Persona
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPetPhoto(e.target.files?.[0] || null)}
            className="w-full text-sm text-neutral-500 file:mr-4 file:rounded file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200"
          />

          <p className="mt-3 text-xs text-stone-500">
            {petPhoto ? `Selected curator photo: ${petPhoto.name}` : 'No curator photo selected yet.'}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="block text-base font-semibold text-stone-900">
              2. Choose today&apos;s artifacts
            </label>

            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 border border-stone-200">
              Exhibit content
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setDayPhotos(e.target.files)}
            className="w-full text-sm text-neutral-500 file:mr-4 file:rounded file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200"
          />

          <div className="mt-3 flex items-center justify-between gap-4 text-xs text-stone-500">
            <p>{dayPhotoSummary}</p>
            <p>
              {dayPhotoCount > 0 ? `${dayPhotoCount}/${MAX_DAY_PHOTOS}` : `${MIN_DAY_PHOTOS}-${MAX_DAY_PHOTOS} required`}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full border border-stone-300 bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-900 shadow-md shadow-stone-200/60 transition hover:bg-stone-200 focus:outline-none focus:ring-4 focus:ring-amber-200"
        >
          Commission Exhibit
        </button>
      </form>

      <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
