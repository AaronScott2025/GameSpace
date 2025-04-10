//Hook for playing sound in page

// src/hooks/useSound.js
import { useRef } from "react";

const useSound = (src) => {
    const soundRef = useRef(new Audio(src));
  
    const play = (volume = 1) => {
      const audioClone = soundRef.current.cloneNode();
      audioClone.muted = false;
      audioClone.volume = volume;  // Allow setting volume dynamically
      audioClone.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    };
  
    return { play };
  };

export default useSound;