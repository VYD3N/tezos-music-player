"use client";

import React from 'react';
import { MusicTrack } from '../types/MusicTrack';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  onTrackSelect: (track: MusicTrack) => void;
  isPlaying: boolean;
}

export function TrackList({ tracks, currentTrack, onTrackSelect, isPlaying }: TrackListProps) {
  if (!tracks.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tracks found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
            currentTrack?.id === track.id
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
          onClick={() => onTrackSelect(track)}
        >
          <div className="flex-shrink-0 w-12 h-12 mr-4">
            <img
              src={track.thumbnailUrl || '/placeholder-album.png'}
              alt={`${track.title} thumbnail`}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{track.title}</h3>
              {currentTrack?.id === track.id && (
                <div className="ml-2">
                  {isPlaying ? (
                    <span className="text-green-400">▶</span>
                  ) : (
                    <span className="text-gray-400">❚❚</span>
                  )}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400">{track.artist}</div>
            <div className="text-xs text-gray-400">{track.genre}</div>
          </div>
          <div className="flex-shrink-0 text-sm text-gray-400">
            {formatDuration(track.duration)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
