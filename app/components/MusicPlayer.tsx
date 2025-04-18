"use client";

import React, { useState, useEffect } from 'react';
import { MusicTrack } from './PlayerControls';
import AdvancedSearch from './AdvancedSearch';
import EnhancedFilters from './EnhancedFilters';
import TrackList from './TrackList';
import PlayerControls from './PlayerControls';
import AudioPlayer from './AudioPlayer';
import PlaylistManager from './PlaylistManager';
import { useMusicTracks } from '../hooks/useMusicTracks';
import { searchMusicTracks, filterMusicTracks, fetchFilterOptions } from '../lib/supabaseClient';

const MusicPlayer: React.FC = () => {
  const { tracks, loading, error, getTrackStreamingUrl } = useMusicTracks();
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    searchFields: ['name', 'artist']
  });
  const [filterOptions, setFilterOptions] = useState({
    genres: [] as string[],
    moods: [] as string[],
    platforms: [] as string[]
  });
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch filter options when component mounts
  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await fetchFilterOptions();
      setFilterOptions(options);
    };
    loadFilterOptions();
  }, []);

  // Apply filters and search whenever tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      setFilteredTracks(tracks);
    }
  }, [tracks]);

  const handleAdvancedSearch = async (params: {
    query: string;
    searchFields: string[];
  }) => {
    setIsSearching(true);
    setSearchParams(params);
    const results = await searchMusicTracks(params.query, params.searchFields);
    setFilteredTracks(results);
    setIsSearching(false);
  };

  const handleEnhancedFilterChange = async (filters: {
    genre: string[];
    mood: string[];
    platform: string[];
    minDuration: number;
    maxDuration: number;
    minTempo?: number;
    maxTempo?: number;
    minEnergy?: number;
    maxEnergy?: number;
    minDanceability?: number;
    maxDanceability?: number;
  }) => {
    const results = await filterMusicTracks(filters);
    setFilteredTracks(results);
  };

  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleTrackSelectById = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      handleTrackSelect(track);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    handleTrackSelect(filteredTracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
    handleTrackSelect(filteredTracks[prevIndex]);
  };

  const togglePlaylists = () => {
    setShowPlaylists(!showPlaylists);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <AdvancedSearch onSearch={handleAdvancedSearch} />
        </div>
        <div className="mb-4">
          <EnhancedFilters
            genres={filterOptions.genres}
            moods={filterOptions.moods}
            platforms={filterOptions.platforms}
            onFilterChange={handleEnhancedFilterChange}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <TrackList
            tracks={filteredTracks}
            onTrackSelect={handleTrackSelect}
            currentTrackId={currentTrack?.id}
          />
        )}
      </div>
      <div className="border-t">
        <PlayerControls
          track={currentTrack}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onTogglePlaylists={togglePlaylists}
        />
        <AudioPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onEnded={handleNext}
        />
      </div>
      {showPlaylists && (
        <PlaylistManager
          tracks={tracks}
          onTrackSelect={handleTrackSelectById}
          onClose={() => setShowPlaylists(false)}
        />
      )}
    </div>
  );
};

export default MusicPlayer; 