import React, { useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { ExhibitGallery } from './components/ExhibitGallery';
import { ExhibitResponse } from './types/exhibit';
import { API_BASE_URL } from './config/constants';

type AppState = 'setup' | 'loading' | 'exhibit';

export default function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [exhibitData, setExhibitData] = useState<ExhibitResponse | null>(null);
  const [dayPhotoUrls, setDayPhotoUrls] = useState<string[]>([]);

  const handleCurationRequest = async (formData: FormData) => {
    setAppState('loading');

    const uploadedDayPhotos = formData.getAll('day_photos') as File[];
    const localUrls = uploadedDayPhotos.map((file) => URL.createObjectURL(file));
    setDayPhotoUrls(localUrls);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/curate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate curation');

      const data: ExhibitResponse = await response.json();
      setExhibitData(data);
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
    setAppState('setup');
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans">
      <main className="max-w-5xl mx-auto p-6">
        {appState === 'setup' && (
          <div className="max-w-xl mx-auto mt-20">
            <h1 className="text-4xl font-serif text-center font-bold mb-8">
              Pet-Curated Museum of a Day
            </h1>
            <UploadForm onSubmit={handleCurationRequest} />
          </div>
        )}

        {appState === 'loading' && (
          <div className="flex flex-col items-center justify-center mt-32 space-y-6">
            <div className="text-6xl animate-bounce">🐾</div>
            <h2 className="text-xl font-serif">The curator is inspecting your artifacts...</h2>
          </div>
        )}

        {appState === 'exhibit' && exhibitData && (
          <div className="mt-8">
            <button
              onClick={handleReset}
              className="mb-8 px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition"
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
