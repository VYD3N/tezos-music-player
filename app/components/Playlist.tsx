"use client";

import React from 'react';

interface PlaylistProps {
  name: string;
  tracks: Array<{
    id: string;
    name: string;
    artist: string;
  }>;
  onTrackSelect: (trackId: string) => void;
  currentTrackId: string | null;
}

const Playlist: React.FC<PlaylistProps> = ({
  name,
  tracks,
  onTrackSelect,
  currentTrackId
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-700 border-b border-gray-600">
        <h3 className="font-medium">{name}</h3>
      </div>
      <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
        {tracks.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No tracks in playlist</p>
          </div>
        ) : (
          <ul>
            {tracks.map(track => (
              <li 
                key={track.id}
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                  currentTrackId === track.id ? 'bg-gray-700' : ''
                }`}
                onClick={() => onTrackSelect(track.id)}
              >
                <div className="font-medium truncate">{track.name}</div>
                <div className="text-sm text-gray-400 truncate">{track.artist}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Playlist;
