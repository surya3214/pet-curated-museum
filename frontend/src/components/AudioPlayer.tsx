import React, { useState } from 'react';
import { speakText, stopSpeech } from '../utils/tts';

interface AudioPlayerProps {
  narrationScript: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ narrationScript }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(narrationScript, () => setIsPlaying(false));
    }
  };

  return (
    <button 
      onClick={togglePlay}
      className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${
        isPlaying 
          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
          : 'bg-neutral-800 text-white hover:bg-neutral-700'
      }`}
    >
      {isPlaying ? (
        <>
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Stop Guide
        </>
      ) : (
        <>
          ▶ Play Narration
        </>
      )}
    </button>
  );
};