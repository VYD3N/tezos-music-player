"use client";

import React from 'react';
import { MusicTrack } from '../types/MusicTrack';

interface PlayerControlsProps {
  track: MusicTrack;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function PlayerControls({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center flex-1">
        <img
          src={track.thumbnailUrl || '/placeholder-album.png'}
          alt={`${track.title} thumbnail`}
          className="w-16 h-16 object-cover rounded-lg shadow-lg"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{track.title}</h3>
          <p className="text-sm text-gray-400">{track.artist}</p>
          <p className="text-xs text-gray-500">{track.genre}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          ⏮
        </button>
        <button
          onClick={onPlayPause}
          className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={onNext}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          ⏭
        </button>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="text-sm text-gray-400">
          {formatDuration(track.duration)}
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
