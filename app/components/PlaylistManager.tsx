"use client";

import React, { useState } from 'react';
import { MusicTrack } from '../types/MusicTrack';
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
  const [playlists, setPlaylists] = useState<{ [key: string]: string[] }>(() => {
    const savedPlaylists = localStorage.getItem('playlists');
    return savedPlaylists ? JSON.parse(savedPlaylists) : {};
  });
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
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
      
      const updatedPlaylists = {
        ...prev,
        [playlistName]: [...playlist, currentTrack.id]
      };
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  // Remove track from playlist
  const removeFromPlaylist = (playlistName: string, trackId: string) => {
    setPlaylists(prev => {
      const updatedPlaylists = {
        ...prev,
        [playlistName]: prev[playlistName].filter(id => id !== trackId)
      };
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  // Create a new playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    setPlaylists(prev => {
      const updatedPlaylists = {
        ...prev,
        [newPlaylistName]: []
      };
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      setNewPlaylistName('');
      return updatedPlaylists;
    });
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
      const updatedPlaylists = {
        ...prev,
        'Recently Played': [currentTrack.id, ...filtered].slice(0, 10) // Keep only 10 most recent
      };
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  }, [currentTrack]);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const updatedPlaylists = {
        ...playlists,
        [newPlaylistName]: [],
      };
      setPlaylists(updatedPlaylists);
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      setNewPlaylistName('');
    }
  };

  const handleAddToPlaylist = (playlistName: string, trackId: string) => {
    if (!playlists[playlistName].includes(trackId)) {
      const updatedPlaylists = {
        ...playlists,
        [playlistName]: [...playlists[playlistName], trackId],
      };
      setPlaylists(updatedPlaylists);
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    }
  };

  const handleRemoveFromPlaylist = (playlistName: string, trackId: string) => {
    const updatedPlaylists = {
      ...playlists,
      [playlistName]: playlists[playlistName].filter(id => id !== trackId),
    };
    setPlaylists(updatedPlaylists);
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  };

  const handleDeletePlaylist = (playlistName: string) => {
    const { [playlistName]: _, ...remainingPlaylists } = playlists;
    setPlaylists(remainingPlaylists);
    localStorage.setItem('playlists', JSON.stringify(remainingPlaylists));
    if (activePlaylist === playlistName) {
      setActivePlaylist(null);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Playlists</h2>

      <form onSubmit={handleCreatePlaylist} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name"
            className="flex-1 px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {Object.entries(playlists).map(([name, trackIds]) => (
          <div key={name} className="bg-gray-700 p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{name}</h3>
              <button
                onClick={() => handleDeletePlaylist(name)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
            <div className="space-y-2">
              {trackIds.map((trackId) => {
                const track = tracks.find((t) => t.id === trackId);
                return track ? (
                  <div
                    key={trackId}
                    className={`flex justify-between items-center p-2 rounded ${
                      currentTrack?.id === trackId
                        ? 'bg-blue-600'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <button
                      onClick={() => onTrackSelect(trackId)}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium">{track.title}</div>
                      <div className="text-sm text-gray-300">
                        {track.artist}
                      </div>
                    </button>
                    <button
                      onClick={() => handleRemoveFromPlaylist(name, trackId)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>

      {currentTrack && (
        <div className="mt-4 p-4 bg-gray-700 rounded">
          <h3 className="font-semibold mb-2">Add Current Track to Playlist</h3>
          <div className="flex space-x-2">
            <select
              value={activePlaylist || ''}
              onChange={(e) => setActivePlaylist(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a playlist</option>
              {Object.keys(playlists).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (activePlaylist && currentTrack) {
                  addToPlaylist(activePlaylist);
                }
              }}
              disabled={!activePlaylist}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
