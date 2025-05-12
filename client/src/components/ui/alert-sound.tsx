import React, { useEffect, useRef } from 'react';

interface AlertSoundProps {
  play: boolean;
  soundUrl?: string;
}

/**
 * A component that plays an alert sound when triggered
 */
export function AlertSound({ play, soundUrl = '/alert.mp3' }: AlertSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = 0.5; // Set default volume to 50%
    }

    // Play sound when prop is true
    if (play && audioRef.current) {
      // Reset to beginning if already playing
      audioRef.current.currentTime = 0;
      
      // Play the sound with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio playback was prevented by the browser:', error);
        });
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [play, soundUrl]);

  // This component doesn't render anything visible
  return null;
}