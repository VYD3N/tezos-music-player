"use client";

import React from 'react';

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  genre: string;
  mood: string;
  platform: string;
  duration: number;
  streamingUrl: string;
  thumbnailUri: string;
  displayUri: string;
  description: string;
  tokenId: string;
  contractAddress: string;
  artifactUri: string;
  playbackUrl: string;
  mimeType: string;
  ipfsGateway: string;
}

interface PlayerControlsProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePlaylists: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  track,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onTogglePlaylists,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100">
      <div className="flex items-center space-x-4">
        {track?.thumbnailUri && (
          <img
            src={track.thumbnailUri}
            alt={track.name}
            className="w-12 h-12 rounded"
          />
        )}
        <div>
          <div className="font-semibold">{track?.name || 'No track selected'}</div>
          <div className="text-sm text-gray-600">{track?.artist || ''}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          className="p-2 rounded-full hover:bg-gray-200"
          disabled={!track}
        >
          Previous
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-2 rounded-full hover:bg-gray-200"
          disabled={!track}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-full hover:bg-gray-200"
          disabled={!track}
        >
          Next
        </button>
        <button
          onClick={onTogglePlaylists}
          className="p-2 rounded hover:bg-gray-200"
        >
          Playlists
        </button>
      </div>
    </div>
  );
};

export default PlayerControls; 