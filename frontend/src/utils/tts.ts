export const speakText = (text: string, onEndCallback: () => void) => {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support text to speech!");
    onEndCallback();
    return;
  }

  stopSpeech(); // Stop any currently playing audio

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Basic configuration for a slightly "curator" like voice tone
  utterance.rate = 0.9;
  utterance.pitch = 0.9;
  
  utterance.onend = () => {
    onEndCallback();
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error", e);
    onEndCallback();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};