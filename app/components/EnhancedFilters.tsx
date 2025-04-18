"use client";

import React, { useState } from 'react';

interface EnhancedFiltersProps {
  genres: string[];
  moods: string[];
  platforms: string[];
  onFilterChange: (filters: {
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
  }) => void;
}

const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({
  genres,
  moods,
  platforms,
  onFilterChange,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [duration, setDuration] = useState({ min: 0, max: 600 });
  const [tempo, setTempo] = useState({ min: 60, max: 200 });
  const [energy, setEnergy] = useState({ min: 0, max: 1 });
  const [danceability, setDanceability] = useState({ min: 0, max: 1 });

  const handleFilterUpdate = () => {
    onFilterChange({
      genre: selectedGenres,
      mood: selectedMoods,
      platform: selectedPlatforms,
      minDuration: duration.min,
      maxDuration: duration.max,
      minTempo: tempo.min,
      maxTempo: tempo.max,
      minEnergy: energy.min,
      maxEnergy: energy.max,
      minDanceability: danceability.min,
      maxDanceability: danceability.max,
    });
  };

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newSelection = selected.includes(item)
      ? selected.filter(i => i !== item)
      : [...selected, item];
    setSelected(newSelection);
    handleFilterUpdate();
  };

  return (
    <div className="space-y-6 p-4 bg-surface rounded-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedGenres.includes(genre)
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">Moods</h3>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => toggleSelection(mood, selectedMoods, setSelectedMoods)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedMoods.includes(mood)
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => toggleSelection(platform, selectedPlatforms, setSelectedPlatforms)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedPlatforms.includes(platform)
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">Duration (seconds)</h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={duration.min}
              onChange={(e) => {
                setDuration(prev => ({ ...prev, min: Number(e.target.value) }));
                handleFilterUpdate();
              }}
              className="w-24 px-2 py-1 bg-surface border border-gray-600 rounded"
              min="0"
              max={duration.max}
            />
            <span className="text-text-primary">to</span>
            <input
              type="number"
              value={duration.max}
              onChange={(e) => {
                setDuration(prev => ({ ...prev, max: Number(e.target.value) }));
                handleFilterUpdate();
              }}
              className="w-24 px-2 py-1 bg-surface border border-gray-600 rounded"
              min={duration.min}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">Tempo (BPM)</h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={tempo.min}
              onChange={(e) => {
                setTempo(prev => ({ ...prev, min: Number(e.target.value) }));
                handleFilterUpdate();
              }}
              className="w-24 px-2 py-1 bg-surface border border-gray-600 rounded"
              min="0"
              max={tempo.max}
            />
            <span className="text-text-primary">to</span>
            <input
              type="number"
              value={tempo.max}
              onChange={(e) => {
                setTempo(prev => ({ ...prev, max: Number(e.target.value) }));
                handleFilterUpdate();
              }}
              className="w-24 px-2 py-1 bg-surface border border-gray-600 rounded"
              min={tempo.min}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFilters; 