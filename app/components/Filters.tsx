import React from 'react';
import { MusicTrack } from '../types/MusicTrack';

interface FiltersProps {
  artists: string[];
  genres: string[];
  platforms: string[];
  onFilterChange: (filters: {
    artist?: string;
    genre?: string;
    platform?: string;
  }) => void;
}

export function Filters({ artists, genres, platforms, onFilterChange }: FiltersProps) {
  const [selectedArtist, setSelectedArtist] = React.useState<string>('');
  const [selectedGenre, setSelectedGenre] = React.useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('');

  const handleArtistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedArtist(value);
    onFilterChange({ artist: value, genre: selectedGenre, platform: selectedPlatform });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGenre(value);
    onFilterChange({ artist: selectedArtist, genre: value, platform: selectedPlatform });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onFilterChange({ artist: selectedArtist, genre: selectedGenre, platform: value });
  };

  const handleClearFilters = () => {
    setSelectedArtist('');
    setSelectedGenre('');
    setSelectedPlatform('');
    onFilterChange({ artist: '', genre: '', platform: '' });
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <select
        className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedArtist}
        onChange={handleArtistChange}
      >
        <option value="">All Artists</option>
        {artists.map((artist) => (
          <option key={artist} value={artist}>
            {artist}
          </option>
        ))}
      </select>

      <select
        className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedGenre}
        onChange={handleGenreChange}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <select
        className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedPlatform}
        onChange={handlePlatformChange}
      >
        <option value="">All Platforms</option>
        {platforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </select>

      <button
        onClick={handleClearFilters}
        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors duration-200"
      >
        Clear Filters
      </button>
    </div>
  );
}
