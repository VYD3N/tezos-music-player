"use client";

import React from 'react';
import { MusicTrack } from './PlayerControls';

interface TrackListProps {
  tracks: MusicTrack[];
  onTrackSelect: (track: MusicTrack) => void;
  currentTrack: MusicTrack | null;
  onAddToPlaylist?: (track: MusicTrack) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackSelect,
  currentTrack,
  onAddToPlaylist,
}) => {
  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          className={`p-4 rounded-lg cursor-pointer hover:bg-gray-100 ${
            currentTrack?.id === track.id ? 'bg-gray-100' : 'bg-white'
          }`}
          onClick={() => onTrackSelect(track)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {track.thumbnailUri && (
                <img src={track.thumbnailUri} alt={track.name} className="w-12 h-12 rounded" />
              )}
              <div>
                <div className="font-semibold">{track.name}</div>
                <div className="text-sm text-gray-600">{track.artist}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="capitalize">{track.genre}</span>
              <span className="mx-2">•</span>
              <span>{track.platform}</span>
            </div>
            {onAddToPlaylist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToPlaylist(track);
                }}
                className="ml-4 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Add to Playlist
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList; 