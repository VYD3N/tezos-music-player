"use client";

import React from 'react';

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  musicType: string;
  platform: string;
  thumbnailUri: string;
  artifactUri: string;
}

interface PlayerControlsProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious
}) => {
  return (
    <div className="flex flex-col items-center w-full bg-gray-800 p-4 rounded-lg">
      {currentTrack ? (
        <>
          <div className="flex items-center mb-4 w-full">
            <img 
              src={currentTrack.thumbnailUri} 
              alt={currentTrack.name} 
              className="w-16 h-16 rounded mr-4 object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold truncate">{currentTrack.name}</h3>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 w-full">
            <button 
              onClick={onPrevious}
              className="p-2 rounded-full hover:bg-gray-700 transition"
              aria-label="Previous track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            
            {isPlaying ? (
              <button 
                onClick={onPause}
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                aria-label="Pause"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>
            ) : (
              <button 
                onClick={onPlay}
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                aria-label="Play"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            )}
            
            <button 
              onClick={onNext}
              className="p-2 rounded-full hover:bg-gray-700 transition"
              aria-label="Next track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p>No track selected</p>
        </div>
      )}
    </div>
  );
};

export default PlayerControls;
