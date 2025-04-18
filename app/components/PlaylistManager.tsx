"use client";

import React, { useState } from 'react';
import { MusicTrack } from './PlayerControls';
import Playlist from './Playlist';

interface PlaylistManagerProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  onTrackSelect: (trackId: string) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  tracks,
  currentTrack,
  onTrackSelect
}) => {
  const [playlists, setPlaylists] = useState<{[key: string]: string[]}>({
    'Favorites': [],
    'Recently Played': []
  });
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [activePlaylist, setActivePlaylist] = useState<string | null>('Favorites');

  // Get tracks for the active playlist
  const getPlaylistTracks = () => {
    if (!activePlaylist || !playlists[activePlaylist]) return [];
    
    return playlists[activePlaylist]
      .map(id => tracks.find(track => track.id === id))
      .filter((track): track is MusicTrack => track !== undefined);
  };

  // Add current track to a playlist
  const addToPlaylist = (playlistName: string) => {
    if (!currentTrack) return;
    
    setPlaylists(prev => {
      const playlist = prev[playlistName] || [];
      // Don't add duplicates
      if (playlist.includes(currentTrack.id)) return prev;
      
      return {
        ...prev,
        [playlistName]: [...playlist, currentTrack.id]
      };
    });
  };

  // Remove track from playlist
  const removeFromPlaylist = (playlistName: string, trackId: string) => {
    setPlaylists(prev => ({
      ...prev,
      [playlistName]: prev[playlistName].filter(id => id !== trackId)
    }));
  };

  // Create a new playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    setPlaylists(prev => ({
      ...prev,
      [newPlaylistName]: []
    }));
    
    setNewPlaylistName('');
  };

  // Handle playlist selection
  const handlePlaylistSelect = (name: string) => {
    setActivePlaylist(name);
  };

  // Add current track to recently played
  React.useEffect(() => {
    if (!currentTrack) return;
    
    setPlaylists(prev => {
      const recentlyPlayed = prev['Recently Played'] || [];
      // Remove if already exists to avoid duplicates
      const filtered = recentlyPlayed.filter(id => id !== currentTrack.id);
      // Add to the beginning of the list
      return {
        ...prev,
        'Recently Played': [currentTrack.id, ...filtered].slice(0, 10) // Keep only 10 most recent
      };
    });
  }, [currentTrack]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Playlists</h3>
      
      {/* Playlist tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(playlists).map(name => (
          <button
            key={name}
            onClick={() => handlePlaylistSelect(name)}
            className={`px-3 py-1 rounded-full text-sm ${
              activePlaylist === name 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      
      {/* Active playlist */}
      {activePlaylist && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{activePlaylist}</h4>
            {currentTrack && (
              <button
                onClick={() => addToPlaylist(activePlaylist)}
                className="text-sm px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
              >
                Add Current Track
              </button>
            )}
          </div>
          
          <Playlist
            name={activePlaylist}
            tracks={getPlaylistTracks()}
            onTrackSelect={onTrackSelect}
            currentTrackId={currentTrack?.id || null}
          />
        </div>
      )}
      
      {/* Create new playlist */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Create New Playlist</h4>
        <div className="flex">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name"
            className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createPlaylist}
            className="px-4 py-2 bg-blue-600 rounded-r hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistManager;
