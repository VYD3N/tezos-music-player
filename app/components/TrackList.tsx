"use client";

import React from 'react';
import { MusicTrack } from './PlayerControls';

interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  currentTrackId?: string;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onTrackSelect, currentTrackId }) => {
  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          onClick={() => onTrackSelect(track)}
          className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
            currentTrackId === track.id ? 'bg-primary bg-opacity-10' : ''
          }`}
        >
          <img
            src={track.thumbnailUri}
            alt={track.name}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium">{track.name}</h3>
            <p className="text-sm text-gray-600">{track.artist}</p>
          </div>
          <div className="text-sm text-gray-500">
            <span className="capitalize">{track.musicType}</span>
            <span className="mx-2">•</span>
            <span>{track.platform}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList; 