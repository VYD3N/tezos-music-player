"use client";

import React from 'react';

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface EnhancedFiltersProps {
  artists: string[];
  musicTypes: string[];
  platforms: string[];
  onFilterChange: (filters: {
    artist?: string;
    musicType?: string;
    platform?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) => void;
}

const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({
  artists,
  musicTypes,
  platforms,
  onFilterChange
}) => {
  const [selectedArtist, setSelectedArtist] = React.useState<string>('');
  const [selectedMusicType, setSelectedMusicType] = React.useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(true);

  // Convert arrays to filter options with counts
  const artistOptions: FilterOption[] = artists.map(artist => ({
    value: artist,
    label: artist,
    count: 1 // In a real implementation, this would be the count of tracks by this artist
  }));

  const musicTypeOptions: FilterOption[] = musicTypes.map(type => ({
    value: type,
    label: type,
    count: 1 // In a real implementation, this would be the count of tracks of this type
  }));

  const platformOptions: FilterOption[] = platforms.map(platform => ({
    value: platform,
    label: platform,
    count: 1 // In a real implementation, this would be the count of tracks from this platform
  }));

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'artist', label: 'Artist' },
    { value: 'musicType', label: 'Music Type' },
    { value: 'platform', label: 'Platform' }
  ];

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      artist: selectedArtist,
      musicType: selectedMusicType,
      platform: selectedPlatform,
      sortBy,
      sortDirection
    });
  };

  // Handle filter changes
  const handleArtistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedArtist(value);
    onFilterChange({
      artist: value,
      musicType: selectedMusicType,
      platform: selectedPlatform,
      sortBy,
      sortDirection
    });
  };

  const handleMusicTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMusicType(value);
    onFilterChange({
      artist: selectedArtist,
      musicType: value,
      platform: selectedPlatform,
      sortBy,
      sortDirection
    });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onFilterChange({
      artist: selectedArtist,
      musicType: selectedMusicType,
      platform: value,
      sortBy,
      sortDirection
    });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onFilterChange({
      artist: selectedArtist,
      musicType: selectedMusicType,
      platform: selectedPlatform,
      sortBy: value,
      sortDirection
    });
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onFilterChange({
      artist: selectedArtist,
      musicType: selectedMusicType,
      platform: selectedPlatform,
      sortBy,
      sortDirection: newDirection
    });
  };

  const handleClearFilters = () => {
    setSelectedArtist('');
    setSelectedMusicType('');
    setSelectedPlatform('');
    setSortBy('name');
    setSortDirection('asc');
    onFilterChange({});
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={toggleFilters}
          className="text-sm text-gray-400 hover:text-white"
        >
          {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {isFiltersOpen && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Artist filter */}
            <div>
              <label htmlFor="artist-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Artist
              </label>
              <select
                id="artist-filter"
                value={selectedArtist}
                onChange={handleArtistChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Artists</option>
                {artistOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Music Type filter */}
            <div>
              <label htmlFor="music-type-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Music Type
              </label>
              <select
                id="music-type-filter"
                value={selectedMusicType}
                onChange={handleMusicTypeChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {musicTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Platform filter */}
            <div>
              <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Platform
              </label>
              <select
                id="platform-filter"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Platforms</option>
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort options */}
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-400 mb-1">
                Sort By
              </label>
              <div className="flex">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={handleSortByChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 border-l-0 rounded-r-md hover:bg-gray-600"
                >
                  {sortDirection === 'asc' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFilters;
