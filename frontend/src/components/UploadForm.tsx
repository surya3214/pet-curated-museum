import React, { useState } from 'react';
import { MIN_DAY_PHOTOS, MAX_DAY_PHOTOS } from '../config/constants';

interface UploadFormProps {
  onSubmit: (formData: FormData) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [dayPhotos, setDayPhotos] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petPhoto) return alert("Please upload exactly 1 pet photo.");
    if (!dayPhotos || dayPhotos.length < MIN_DAY_PHOTOS || dayPhotos.length > MAX_DAY_PHOTOS) {
      return alert(`Please upload between ${MIN_DAY_PHOTOS} and ${MAX_DAY_PHOTOS} day photos.`);
    }

    const formData = new FormData();
    formData.append('pet_photo', petPhoto);
    Array.from(dayPhotos).forEach(file => {
      formData.append('day_photos', file);
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">1. The Curator (Pet Photo)</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setPetPhoto(e.target.files?.[0] || null)}
          className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold mb-2">2. The Artifacts (3-5 Day Photos)</label>
        <input 
          type="file" 
          accept="image/*"
          multiple
          onChange={(e) => setDayPhotos(e.target.files)}
          className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
        />
        <p className="text-xs text-neutral-400 mt-2">These will become the museum exhibits.</p>
      </div>

      <button 
        type="submit" 
        className="w-full bg-neutral-900 text-white py-3 rounded-md font-semibold hover:bg-neutral-800 transition"
      >
        Commission Exhibit
      </button>
    </form>
  );
};