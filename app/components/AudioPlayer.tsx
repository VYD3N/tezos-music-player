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

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('Error playing audio:', err);
          setError('Failed to play audio');
          onError(err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, onError]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('Error playing audio:', err);
          setError('Failed to play audio');
          onError(err);
        });
      }
    }
  }, [currentTrack, isPlaying, onError]);

  return (
    <div>
      <audio
        ref={audioRef}
        onEnded={onEnded}
        onError={(e) => {
          console.error('Audio error:', e);
          setError('Error playing audio');
          onError(new Error('Audio playback error'));
        }}
      />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
