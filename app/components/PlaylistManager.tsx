"use client";

import React, { useState } from 'react';
import { MusicTrack } from './PlayerControls';

interface PlaylistManagerProps {
  tracks: MusicTrack[];
  onTrackSelect: (trackId: string) => void;
  onClose: () => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  tracks,
  onTrackSelect,
  onClose
}) => {
  const [playlists, setPlaylists] = useState<{ name: string; tracks: string[] }[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      setPlaylists(prev => [...prev, { name: newPlaylistName, tracks: [] }]);
      setNewPlaylistName('');
    }
  };

  const addTrackToPlaylist = (playlistIndex: number, trackId: string) => {
    setPlaylists(prev => {
      const newPlaylists = [...prev];
      if (!newPlaylists[playlistIndex].tracks.includes(trackId)) {
        newPlaylists[playlistIndex].tracks.push(trackId);
      }
      return newPlaylists;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Playlists</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="New playlist name"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={createPlaylist}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              Create
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {playlists.map((playlist, index) => (
            <div key={index} className="border rounded p-4">
              <h3 className="font-medium mb-2">{playlist.name}</h3>
              <div className="space-y-2">
                {tracks.map(track => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-gray-600">{track.artist}</p>
                    </div>
                    <button
                      onClick={() => addTrackToPlaylist(index, track.id)}
                      className="text-primary hover:text-primary-dark"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistManager; 