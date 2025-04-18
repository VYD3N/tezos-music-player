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
import { searchMusicTracks, filterMusicTracks } from '../lib/supabaseClient';

const MusicPlayer: React.FC = () => {
  const { tracks, loading, error, getTrackStreamingUrl } = useMusicTracks();
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    searchFields: ['name', 'artist']
  });
  const [filters, setFilters] = useState({
    artist: '',
    musicType: '',
    platform: '',
    sortBy: 'name',
    sortDirection: 'asc' as 'asc' | 'desc'
  });
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Extract unique values for filter dropdowns
  const artists = React.useMemo(() => 
    Array.from(new Set(tracks.map(track => track.artist))),
    [tracks]
  );
  
  const musicTypes = React.useMemo(() => 
    Array.from(new Set(tracks.map(track => track.musicType))),
    [tracks]
  );
  
  const platforms = React.useMemo(() => 
    Array.from(new Set(tracks.map(track => track.platform))),
    [tracks]
  );

  // Apply filters and search whenever tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      applyFiltersAndSearch();
    }
  }, [tracks]);

  // Handle advanced search
  const handleAdvancedSearch = async (params: {
    query: string;
    searchFields: string[];
  }) => {
    setSearchParams(params);
    
    if (params.query) {
      setIsSearching(true);
      try {
        // Use Supabase search function
        const results = await searchMusicTracks(params.query, params.searchFields);
        if (results.length > 0) {
          setFilteredTracks(results);
        } else {
          // If no results from Supabase, fall back to client-side filtering
          applyFiltersAndSearch();
        }
      } catch (error) {
        console.error('Error searching tracks:', error);
        // Fall back to client-side filtering
        applyFiltersAndSearch();
      } finally {
        setIsSearching(false);
      }
    } else {
      // If no query, just apply filters
      applyFiltersAndSearch();
    }
  };

  // Handle enhanced filter changes
  const handleEnhancedFilterChange = async (newFilters: {
    artist?: string;
    musicType?: string;
    platform?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) => {
    const updatedFilters = {
      artist: newFilters.artist ?? '',
      musicType: newFilters.musicType ?? '',
      platform: newFilters.platform ?? '',
      sortBy: newFilters.sortBy ?? 'name',
      sortDirection: newFilters.sortDirection ?? 'asc'
    };
    
    setFilters(updatedFilters);
    
    // If we have specific filters, try to use Supabase filtering
    if (updatedFilters.artist || updatedFilters.musicType || updatedFilters.platform) {
      setIsSearching(true);
      try {
        const results = await filterMusicTracks({
          artist: updatedFilters.artist || undefined,
          musicType: updatedFilters.musicType || undefined,
          platform: updatedFilters.platform || undefined
        });
        
        if (results.length > 0) {
          // Apply sorting to the results
          const sortedResults = sortTracks(results, updatedFilters.sortBy, updatedFilters.sortDirection);
          setFilteredTracks(sortedResults);
        } else {
          // If no results from Supabase, fall back to client-side filtering
          applyFiltersAndSearch();
        }
      } catch (error) {
        console.error('Error filtering tracks:', error);
        // Fall back to client-side filtering
        applyFiltersAndSearch();
      } finally {
        setIsSearching(false);
      }
    } else {
      // If no specific filters, just apply sorting
      applyFiltersAndSearch();
    }
  };

  // Sort tracks based on field and direction
  const sortTracks = (tracksToSort: MusicTrack[], sortBy: string, sortDirection: 'asc' | 'desc') => {
    return [...tracksToSort].sort((a, b) => {
      const fieldA = a[sortBy as keyof MusicTrack];
      const fieldB = b[sortBy as keyof MusicTrack];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });
  };

  // Apply both filters and search client-side
  const applyFiltersAndSearch = () => {
    if (!tracks.length) return;
    
    let result = [...tracks];
    
    // Apply search
    if (searchParams.query) {
      const lowerQuery = searchParams.query.toLowerCase();
      result = result.filter(track => {
        return searchParams.searchFields.some(field => {
          const fieldValue = track[field as keyof MusicTrack];
          return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(lowerQuery);
        });
      });
    }
    
    // Apply filters
    if (filters.artist) {
      result = result.filter(track => track.artist === filters.artist);
    }
    
    if (filters.musicType) {
      result = result.filter(track => track.musicType === filters.musicType);
    }
    
    if (filters.platform) {
      result = result.filter(track => track.platform === filters.platform);
    }
    
    // Apply sorting
    result = sortTracks(result, filters.sortBy, filters.sortDirection);
    
    setFilteredTracks(result);
  };

  // Handle track selection
  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Handle track selection by ID (for playlists)
  const handleTrackSelectById = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      handleTrackSelect(track);
    }
  };

  // Player controls
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (!currentTrack || filteredTracks.length === 0) return;
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    handleTrackSelect(filteredTracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentTrack || filteredTracks.length === 0) return;
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
    handleTrackSelect(filteredTracks[prevIndex]);
  };

  // Toggle playlists view
  const togglePlaylists = () => {
    setShowPlaylists(!showPlaylists);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tezos Music Player</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-${showPlaylists ? '2' : '3'}`}>
          <AdvancedSearch onSearch={handleAdvancedSearch} />
          
          <EnhancedFilters 
            artists={artists}
            musicTypes={musicTypes}
            platforms={platforms}
            onFilterChange={handleEnhancedFilterChange}
          />
          
          {loading || isSearching ? (
            <div className="w-full max-w-4xl mx-auto p-8 text-center bg-gray-800 rounded-lg">
              <p className="text-gray-400 animate-pulse">Loading music tracks...</p>
            </div>
          ) : error ? (
            <div className="w-full max-w-4xl mx-auto p-8 text-center bg-gray-800 rounded-lg border border-red-500">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'} found
              </div>
              <TrackList 
                tracks={filteredTracks}
                currentTrack={currentTrack}
                onTrackSelect={handleTrackSelect}
              />
            </>
          )}
        </div>
        
        {showPlaylists && (
          <div className="lg:col-span-1">
            <PlaylistManager 
              tracks={tracks}
              currentTrack={currentTrack}
              onTrackSelect={handleTrackSelectById}
            />
          </div>
        )}
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <PlayerControls 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
          
          <button 
            onClick={togglePlaylists}
            className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
          >
            {showPlaylists ? 'Hide Playlists' : 'Show Playlists'}
          </button>
        </div>
        
        <AudioPlayer 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
          onTrackEnd={handleNext}
          getStreamingUrl={getTrackStreamingUrl}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
