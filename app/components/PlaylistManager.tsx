"use client";

import React, { useState, useEffect } from 'react';
import { MusicTrack } from './PlayerControls';

interface PlaylistManagerProps {
  tracks: MusicTrack[];
  onTrackSelect: (trackId: string) => void;
  onClose: () => void;
}

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  tracks,
  onTrackSelect,
  onClose,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    // Load playlists from localStorage
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  const savePlaylists = (updatedPlaylists: Playlist[]) => {
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
    };
    savePlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
  };

  const deletePlaylist = (playlistId: string) => {
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    savePlaylists(updatedPlaylists);
    if (selectedPlaylist === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId && !playlist.tracks.includes(trackId)) {
        return {
          ...playlist,
          tracks: [...playlist.tracks, trackId],
        };
      }
      return playlist;
    });
    savePlaylists(updatedPlaylists);
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter(id => id !== trackId),
        };
      }
      return playlist;
    });
    savePlaylists(updatedPlaylists);
  };

  const getPlaylistTracks = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    return tracks.filter(track => playlist.tracks.includes(track.id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-surface p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Playlists</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name"
            className="flex-1 px-4 py-2 bg-background border border-gray-600 rounded-lg text-text-primary"
          />
          <button
            onClick={createPlaylist}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90"
          >
            Create
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-2">
            {playlists.map(playlist => (
              <div
                key={playlist.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedPlaylist === playlist.id
                    ? 'bg-accent text-white'
                    : 'bg-background text-text-primary hover:bg-gray-700'
                }`}
                onClick={() => setSelectedPlaylist(playlist.id)}
              >
                <div className="flex justify-between items-center">
                  <span>{playlist.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                    className="text-sm opacity-60 hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm opacity-60">
                  {playlist.tracks.length} tracks
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-2">
            {selectedPlaylist && (
              <div className="space-y-2">
                {getPlaylistTracks(selectedPlaylist).map(track => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div
                      className="flex-1 cursor-pointer hover:text-accent"
                      onClick={() => onTrackSelect(track.id)}
                    >
                      <div className="font-medium text-text-primary">
                        {track.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {track.artist}
                      </div>
                    </div>
                    <button
                      onClick={() => removeTrackFromPlaylist(selectedPlaylist, track.id)}
                      className="text-text-secondary hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistManager; 