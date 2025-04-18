"use client";

import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface EnhancedFiltersProps {
  artists: string[];
  genres: string[];
  platforms: string[];
  onFilterChange: (filters: {
    artist?: string;
    genre?: string;
    platform?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) => void;
}

export function EnhancedFilters({
  artists,
  genres,
  platforms,
  onFilterChange,
}: EnhancedFiltersProps) {
  const [selectedArtist, setSelectedArtist] = React.useState<string>('');
  const [selectedGenre, setSelectedGenre] = React.useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('');
  const [selectedSortBy, setSelectedSortBy] = React.useState<string>('title');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const artistOptions: FilterOption[] = artists.map(artist => ({
    value: artist,
    label: artist,
  }));

  const genreOptions: FilterOption[] = genres.map(genre => ({
    value: genre,
    label: genre,
  }));

  const platformOptions: FilterOption[] = platforms.map(platform => ({
    value: platform,
    label: platform,
  }));

  const sortOptions: SortOption[] = [
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'genre', label: 'Genre' },
    { value: 'uploadedAt', label: 'Upload Date' },
  ];

  const handleArtistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedArtist(value);
    onFilterChange({
      artist: value,
      genre: selectedGenre,
      platform: selectedPlatform,
      sortBy: selectedSortBy,
      sortDirection,
    });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGenre(value);
    onFilterChange({
      artist: selectedArtist,
      genre: value,
      platform: selectedPlatform,
      sortBy: selectedSortBy,
      sortDirection,
    });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onFilterChange({
      artist: selectedArtist,
      genre: selectedGenre,
      platform: value,
      sortBy: selectedSortBy,
      sortDirection,
    });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSortBy(value);
    onFilterChange({
      artist: selectedArtist,
      genre: selectedGenre,
      platform: selectedPlatform,
      sortBy: value,
      sortDirection,
    });
  };

  const handleSortDirectionToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onFilterChange({
      artist: selectedArtist,
      genre: selectedGenre,
      platform: selectedPlatform,
      sortBy: selectedSortBy,
      sortDirection: newDirection,
    });
  };

  const handleClearFilters = () => {
    setSelectedArtist('');
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedSortBy('title');
    setSortDirection('asc');
    onFilterChange({
      artist: '',
      genre: '',
      platform: '',
      sortBy: 'title',
      sortDirection: 'asc',
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Artist
          </label>
          <select
            value={selectedArtist}
            onChange={handleArtistChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Artists</option>
            {artistOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {genreOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Platform
          </label>
          <select
            value={selectedPlatform}
            onChange={handlePlatformChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Platforms</option>
            {platformOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedSortBy}
              onChange={handleSortByChange}
              className="flex-1 bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSortDirectionToggle}
              className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
