"use client";

import React, { useState, useEffect } from 'react';
import { MusicTrack } from '../types/MusicTrack';
import { AdvancedSearch } from './AdvancedSearch';
import { EnhancedFilters } from './EnhancedFilters';
import { TrackList } from './TrackList';
import { PlayerControls } from './PlayerControls';
import { AudioPlayer } from './AudioPlayer';
import { filterMusicTracks, fetchMusicTracksFromSupabase } from '../lib/supabaseClient';

export function MusicPlayer() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState({
    artist: '',
    genre: '',
    platform: ''
  });

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const fetchedTracks = await fetchMusicTracksFromSupabase();
        setTracks(fetchedTracks);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tracks'));
      }
    };

    loadTracks();
  }, []);

  const artists = React.useMemo(() =>
    Array.from(new Set(tracks.map(track => track.artist))),
    [tracks]
  );

  const genres = React.useMemo(() =>
    Array.from(new Set(tracks.map(track => track.genre))),
    [tracks]
  );

  const platforms = React.useMemo(() =>
    Array.from(new Set(tracks.map(track => track.platform))),
    [tracks]
  );

  const handleFilterChange = async (newFilters: {
    artist?: string;
    genre?: string;
    platform?: string;
  }) => {
    setFilters({
      artist: newFilters.artist ?? '',
      genre: newFilters.genre ?? '',
      platform: newFilters.platform ?? ''
    });

    try {
      const filteredTracks = await filterMusicTracks(
        newFilters.artist || undefined,
        newFilters.genre || undefined,
        newFilters.platform || undefined
      );
      setTracks(filteredTracks);
    } catch (error) {
      console.error('Error filtering tracks:', error);
      setError(error instanceof Error ? error : new Error('Failed to filter tracks'));
    }
  };

  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentTrack || !tracks.length) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentTrack || !tracks.length) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[previousIndex]);
  };

  const handleAudioError = (error: Error) => {
    console.error('Audio playback error:', error);
    setError(error);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Tezos Music Player</h1>
          <div className="mb-8">
            <EnhancedFilters
              artists={artists}
              genres={genres}
              platforms={platforms}
              onFilterChange={handleFilterChange}
            />
          </div>
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            onTrackSelect={handleTrackSelect}
            isPlaying={isPlaying}
          />
        </div>
      </div>
      {currentTrack && (
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700">
          <PlayerControls
            track={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
          <AudioPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onEnded={handleNext}
            onError={handleAudioError}
          />
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {error.message}
        </div>
      )}
    </div>
  );
}
