"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MusicTrack } from '../types/MusicTrack';
import { AdvancedSearch } from './AdvancedSearch';
import { EnhancedFilters } from './EnhancedFilters';
import { TrackList } from './TrackList';
import { PlayerControls } from './PlayerControls';
import { AudioPlayer } from './AudioPlayer';
import { fetchMusicTracksFromSupabase, searchMusicTracks } from '../lib/supabaseClient';

export function MusicPlayer() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artistFilter, setArtistFilter] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch tracks on component mount
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const fetchedTracks = await fetchMusicTracksFromSupabase();
        setTracks(fetchedTracks);
      } catch (err) {
        setError('Failed to load tracks');
        console.error(err);
      }
    };
    loadTracks();
  }, []);

  // Memoize unique arrays for filters
  const uniqueArtists = useMemo(() => 
    Array.from(new Set(tracks.map(track => track.artist))).sort(),
    [tracks]
  );

  const uniqueGenres = useMemo(() => 
    Array.from(new Set(tracks.filter(track => track.genre).map(track => track.genre))).sort(),
    [tracks]
  );

  const uniquePlatforms = useMemo(() => 
    Array.from(new Set(tracks.map(track => track.platform))).sort(),
    [tracks]
  );

  // Filter tracks based on selected filters
  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      const matchesArtist = !artistFilter || track.artist.toLowerCase().includes(artistFilter.toLowerCase());
      const matchesGenre = !genreFilter || track.genre.toLowerCase() === genreFilter.toLowerCase();
      const matchesPlatform = !platformFilter || track.platform.toLowerCase() === platformFilter.toLowerCase();
      return matchesArtist && matchesGenre && matchesPlatform;
    });
  }, [tracks, artistFilter, genreFilter, platformFilter]);

  // Handle track selection
  const handleTrackSelect = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Handle track end
  const handleTrackEnd = useCallback(() => {
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex < filteredTracks.length - 1) {
      setCurrentTrack(filteredTracks[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, filteredTracks]);

  // Handle next track
  const handleNextTrack = useCallback(() => {
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex < filteredTracks.length - 1) {
      setCurrentTrack(filteredTracks[currentIndex + 1]);
      setIsPlaying(true);
    }
  }, [currentTrack, filteredTracks]);

  // Handle previous track
  const handlePrevTrack = useCallback(() => {
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex > 0) {
      setCurrentTrack(filteredTracks[currentIndex - 1]);
      setIsPlaying(true);
    }
  }, [currentTrack, filteredTracks]);

  // Handle search
  const handleSearch = useCallback((params: { query: string; searchFields: string[] }) => {
    const fetchSearchResults = async () => {
      try {
        const searchResults = await searchMusicTracks(params.query, params.searchFields);
        setTracks(searchResults);
      } catch (err) {
        setError('Failed to search tracks');
        console.error(err);
      }
    };
    fetchSearchResults();
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filters: {
    artist?: string;
    genre?: string;
    platform?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) => {
    if (filters.artist !== undefined) setArtistFilter(filters.artist);
    if (filters.genre !== undefined) setGenreFilter(filters.genre);
    if (filters.platform !== undefined) setPlatformFilter(filters.platform);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
    if (filters.sortDirection !== undefined) setSortDirection(filters.sortDirection);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <AdvancedSearch onSearch={handleSearch} />
          <EnhancedFilters
            artists={uniqueArtists}
            genres={uniqueGenres}
            platforms={uniquePlatforms}
            onFilterChange={handleFilterChange}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <TrackList
            tracks={filteredTracks}
            currentTrack={currentTrack}
            onTrackSelect={handleTrackSelect}
            isPlaying={isPlaying}
          />
        </div>

        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <AudioPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onEnded={handleTrackEnd}
              onError={(err) => setError(err.message)}
            />
            <PlayerControls
              track={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNextTrack}
              onPrevious={handlePrevTrack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
