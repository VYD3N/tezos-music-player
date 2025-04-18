"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MusicTrack } from '../types/MusicTrack';

interface AudioPlayerProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onEnded: () => void;
  onError: (error: Error) => void;
}

export function AudioPlayer({
  currentTrack,
  isPlaying,
  onEnded,
  onError,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string | null>(null);
  const playAttemptRef = useRef<number>(0);

  // Helper function to handle play attempts
  const attemptPlay = async () => {
    if (!audioRef.current) return;
    
    const currentAttempt = ++playAttemptRef.current;
    
    try {
      setError(null); // Clear any previous errors since we're attempting to play
      await audioRef.current.play();
      // Only clear error if this is the most recent play attempt
      if (currentAttempt === playAttemptRef.current) {
        setError(null);
      }
    } catch (err) {
      // Only show error if this is the most recent play attempt
      // and if the error is not an AbortError (which is expected during track changes)
      if (currentAttempt === playAttemptRef.current && 
          err instanceof Error && 
          !err.message.includes('interrupted')) {
        console.error('Error playing audio:', err);
        setError('Failed to play audio');
        onError(err);
      }
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      attemptPlay();
    } else {
      audioRef.current.pause();
      setError(null); // Clear any errors when pausing
    }
  }, [isPlaying, currentTrack, onError]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audioUrl) return;

    // Reset error state on track change
    setError(null);

    // Validate URL
    if (!currentTrack.audioUrl.startsWith('http')) {
      const error = new Error('Invalid audio URL');
      console.error('Invalid audio URL:', currentTrack.audioUrl);
      setError('Invalid audio URL');
      onError(error);
      return;
    }

    // Update audio source
    audioRef.current.src = currentTrack.audioUrl;
    audioRef.current.load();

    // If should be playing, attempt to play
    if (isPlaying) {
      attemptPlay();
    }
  }, [currentTrack, isPlaying, onError]);

  return (
    <div>
      <audio
        ref={audioRef}
        onEnded={onEnded}
        onError={(e) => {
          const error = e.currentTarget.error;
          if (error && !error.message?.includes('interrupted')) {
            console.error('Audio error:', error);
            setError('Error playing audio');
            onError(new Error('Audio playback error'));
          }
        }}
        preload="metadata"
        crossOrigin="anonymous"
      />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
