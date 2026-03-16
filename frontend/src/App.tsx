import React, { useEffect, useMemo, useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { ExhibitGallery } from './components/ExhibitGallery';
import { InterleavedExhibitResponse } from './types/exhibit';
import { API_BASE_URL, APP_ASSETS } from './config/constants';

type AppState = 'setup' | 'loading' | 'exhibit';

const LOADING_STAGES = [
  'The curator is examining your artifacts...',
  'Arranging the gallery walls...',
  'Composing the exhibit plaques...',
  'Recording the curator narration...',
  'Opening the exhibition doors...',
];

const STAGE_ADVANCE_MS = 4200;
const PROGRESS_ADVANCE_MS = 1400;
const PROGRESS_START = 8;
const PROGRESS_CAP = 84;

export default function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [exhibitData, setExhibitData] = useState<InterleavedExhibitResponse | null>(null);
  const [dayPhotoUrls, setDayPhotoUrls] = useState<string[]>([]);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(10);

  useEffect(() => {
    if (appState !== 'loading') return;

    setLoadingStageIndex(0);
    setProgressPercent(PROGRESS_START);

    const stageTimer = window.setInterval(() => {
      setLoadingStageIndex((prev) => {
        if (prev >= LOADING_STAGES.length - 1) return prev;
        return prev + 1;
      });
    }, STAGE_ADVANCE_MS);

    const progressTimer = window.setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= PROGRESS_CAP) return prev;

        const remaining = PROGRESS_CAP - prev;
        const step = Math.max(1, Math.ceil(remaining * 0.12));
        return Math.min(prev + step, PROGRESS_CAP);
      });
    }, PROGRESS_ADVANCE_MS);

    return () => {
      window.clearInterval(stageTimer);
      window.clearInterval(progressTimer);
    };
  }, [appState]);

  const loadingMessage = useMemo(() => {
    return LOADING_STAGES[loadingStageIndex] || LOADING_STAGES[0];
  }, [loadingStageIndex]);

  const handleCurationRequest = async (formData: FormData) => {
    setAppState('loading');

    const uploadedDayPhotos =
      ((formData.getAll('day_photos') as File[])?.filter(Boolean)) ||
      ((formData.getAll('day_media') as File[])?.filter(Boolean)) ||
      [];

    const localUrls = uploadedDayPhotos.map((file) => URL.createObjectURL(file));
    setDayPhotoUrls(localUrls);

    try {
      const apiFormData = new FormData();

      const petImage =
        (formData.get('pet_image') as File | null) ||
        (formData.get('pet_photo') as File | null);

      if (!petImage) {
        throw new Error('Missing pet image');
      }

      apiFormData.append('pet_image', petImage);

      uploadedDayPhotos.forEach((file) => {
        apiFormData.append('day_media', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/exhibit/interleaved`, {
        method: 'POST',
        body: apiFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate interleaved exhibit');
      }

      const data: InterleavedExhibitResponse = await response.json();
      setExhibitData(data);
      setProgressPercent(100);
      setAppState('exhibit');
    } catch (error) {
      console.error(error);
      localUrls.forEach((url) => URL.revokeObjectURL(url));
      setDayPhotoUrls([]);
      alert('Error connecting to the museum archives.');
      setAppState('setup');
    }
  };

  const handleReset = () => {
    dayPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
    setDayPhotoUrls([]);
    setExhibitData(null);
    setLoadingStageIndex(0);
    setProgressPercent(10);
    setAppState('setup');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f4ed_0%,_#f1ebe1_45%,_#e8dfd1_100%)] text-neutral-900">
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-5 md:px-6 lg:px-8">
        {appState === 'setup' && (
          <div className="grid items-stretch gap-6 min-[900px]:mt-8 min-[900px]:grid-cols-[1.02fr_0.98fr] min-[900px]:gap-8">
            <section className="overflow-hidden rounded-[28px] border border-stone-200 bg-[#fcfaf7] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
              <div className="relative h-full min-h-[280px] min-[900px]:min-h-[560px] lg:min-h-[680px]">
                <img
                  src={APP_ASSETS.hero}
                  alt="Curator hero"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 text-white">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/12 px-4 py-2 backdrop-blur-sm border border-white/20">
                    <img
                      src={APP_ASSETS.crest}
                      alt="Museum crest"
                      className="h-8 w-8 rounded-full object-cover border border-white/30"
                    />
                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/90 sm:text-xs">
                      Curatorial Department
                    </span>
                  </div>

                  <h1 className="max-w-2xl font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
                    Pet-Curated Museum of a Day
                  </h1>

                  <p className="mt-4 max-w-xl text-[0.98rem] leading-7 text-white/88 sm:text-[1.05rem]">
                    Turn your daily snapshots into a miniature mixed-media museum,
                    narrated with dry authority by your pet.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-stone-200 bg-[#fcfaf7] p-5 sm:p-6 md:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={APP_ASSETS.crest}
                  alt="Museum crest"
                  className="h-12 w-12 rounded-full object-cover border border-stone-200 shadow-sm sm:h-14 sm:w-14"
                />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500 mb-1 sm:text-xs">
                    Admission Desk
                  </p>
                  <h2 className="font-serif text-2xl tracking-tight text-stone-900 sm:text-3xl">
                    Begin a new exhibition
                  </h2>
                </div>
              </div>

              <p className="mb-8 text-[0.98rem] leading-7 text-stone-600 sm:text-[1.02rem]">
                Upload one pet portrait to define the curator persona, then add 3 to 5 photos
                from your day as the exhibit artifacts. The gallery will assemble a mixed-media
                museum experience with visuals, plaques, and narration in that same voice.
              </p>

              <UploadForm onSubmit={handleCurationRequest} />
            </section>
          </div>
        )}

        {appState === 'loading' && (
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[28px] border border-stone-200 bg-[#fcfaf7] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
            <div className="grid min-[900px]:grid-cols-[1fr_1fr]">
              <div className="relative min-h-[280px] min-[900px]:min-h-[560px]">
                <img
                  src={APP_ASSETS.loading}
                  alt="Curator preparing the exhibition"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                <div className="mb-6 flex items-center gap-4">
                  <img
                    src={APP_ASSETS.crest}
                    alt="Museum crest"
                    className="h-10 w-10 rounded-full object-cover border border-stone-200 shadow-sm sm:h-12 sm:w-12"
                  />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500 mb-1 sm:text-xs">
                      Exhibition in progress
                    </p>
                    <h2 className="font-serif text-2xl tracking-tight text-stone-900 sm:text-3xl">
                      Preparing your exhibit
                    </h2>
                  </div>
                </div>

                <p className="mb-6 leading-7 text-stone-600">
                  {loadingMessage} Your pet&apos;s portrait is shaping the curator voice while the
                  uploaded day photos are being arranged into museum artifacts.
                </p>

                <div className="w-full">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-stone-900 transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-stone-500 sm:text-xs">
                    <span>Curatorial process</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  {LOADING_STAGES.map((stage, idx) => {
                    const isDone = idx < loadingStageIndex;
                    const isCurrent = idx === loadingStageIndex;

                    return (
                      <div
                        key={stage}
                        className={`rounded-xl border px-4 py-3 text-sm transition ${
                          isCurrent
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : isDone
                            ? 'border-stone-300 bg-stone-100 text-stone-700'
                            : 'border-stone-200 bg-white text-stone-400'
                        }`}
                      >
                        <span className="mr-2 font-semibold">{idx + 1}.</span>
                        {stage}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {appState === 'exhibit' && exhibitData && (
          <div className="mt-8">
            <button
              onClick={handleReset}
              className="mb-8 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              ← Back to Archives
            </button>

            <ExhibitGallery exhibit={exhibitData} dayPhotoUrls={dayPhotoUrls} />
          </div>
        )}
      </main>
    </div>
  );
}
