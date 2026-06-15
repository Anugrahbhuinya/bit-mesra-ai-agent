import { useState } from "react";

export const useTextToSpeech = () => {
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const speak = (text: string) => {
    if (!text?.trim()) return;

    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("🔊 Started speaking");
      setSpeakingText(text);
    };

    utterance.onend = () => {
      console.log("✅ Finished speaking");
      setSpeakingText(null);
    };

    utterance.onerror = (event) => {
      console.error("❌ Speech error:", event);
      setSpeakingText(null);
    };

    // Small delay improves reliability in Chrome
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakingText(null);
  };

  return {
    speak,
    stopSpeaking,
    speakingText,
  };
};
