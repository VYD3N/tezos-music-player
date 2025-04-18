import React from 'react';
import { MusicTrack } from './PlayerControls';

interface FilterProps {
  artists: string[];
  musicTypes: string[];
  platforms: string[];
  onFilterChange: (filters: {
    artist?: string;
    musicType?: string;
    platform?: string;
  }) => void;
}

const Filters: React.FC<FilterProps> = ({
  artists,
  musicTypes,
  platforms,
  onFilterChange
}) => {
  const [selectedArtist, setSelectedArtist] = React.useState<string>('');
  const [selectedMusicType, setSelectedMusicType] = React.useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('');

  const handleArtistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedArtist(value);
    onFilterChange({ artist: value, musicType: selectedMusicType, platform: selectedPlatform });
  };

  const handleMusicTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMusicType(value);
    onFilterChange({ artist: selectedArtist, musicType: value, platform: selectedPlatform });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onFilterChange({ artist: selectedArtist, musicType: selectedMusicType, platform: value });
  };

  const handleClearFilters = () => {
    setSelectedArtist('');
    setSelectedMusicType('');
    setSelectedPlatform('');
    onFilterChange({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-gray-800 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
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
            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
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
            {musicTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
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
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
