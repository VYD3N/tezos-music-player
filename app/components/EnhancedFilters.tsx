"use client";

import React, { useState } from 'react';

interface EnhancedFiltersProps {
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
  genres: string[];
  moods: string[];
  platforms: string[];
}

const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({ 
  onFilterChange,
  genres = [],
  moods = [],
  platforms = []
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedPlatforms, setPlatforms] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState({ min: 0, max: 600 });
  const [tempoRange, setTempoRange] = useState({ min: 0, max: 200 });
  const [energyRange, setEnergyRange] = useState({ min: 0, max: 1 });
  const [danceabilityRange, setDanceabilityRange] = useState({ min: 0, max: 1 });

  const handleGenreChange = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handlePlatformChange = (plat: string) => {
    setPlatforms(prev =>
      prev.includes(plat)
        ? prev.filter(p => p !== plat)
        : [...prev, plat]
    );
  };

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>
  ) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const applyFilters = () => {
    onFilterChange({
      genre: selectedGenres,
      mood: selectedMoods,
      platform: selectedPlatforms,
      minDuration: durationRange.min,
      maxDuration: durationRange.max,
      minTempo: tempoRange.min,
      maxTempo: tempoRange.max,
      minEnergy: energyRange.min,
      maxEnergy: energyRange.max,
      minDanceability: danceabilityRange.min,
      maxDanceability: danceabilityRange.max
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Genre</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedGenres.includes(genre)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Mood</h3>
          <div className="flex flex-wrap gap-2">
            {moods.map(mood => (
              <button
                key={mood}
                onClick={() => handleMoodChange(mood)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedMoods.includes(mood)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Platform</h3>
          <div className="flex flex-wrap gap-2">
            {platforms.map(plat => (
              <button
                key={plat}
                onClick={() => handlePlatformChange(plat)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedPlatforms.includes(plat)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Duration (seconds)</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="min"
                min="0"
                max="600"
                value={durationRange.min}
                onChange={(e) => handleRangeChange(e, setDurationRange)}
                className="w-full"
              />
              <span>{durationRange.min}s</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="max"
                min="0"
                max="600"
                value={durationRange.max}
                onChange={(e) => handleRangeChange(e, setDurationRange)}
                className="w-full"
              />
              <span>{durationRange.max}s</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tempo (BPM)</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="min"
                min="0"
                max="200"
                value={tempoRange.min}
                onChange={(e) => handleRangeChange(e, setTempoRange)}
                className="w-full"
              />
              <span>{tempoRange.min} BPM</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="max"
                min="0"
                max="200"
                value={tempoRange.max}
                onChange={(e) => handleRangeChange(e, setTempoRange)}
                className="w-full"
              />
              <span>{tempoRange.max} BPM</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Energy Level</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="min"
                min="0"
                max="1"
                step="0.1"
                value={energyRange.min}
                onChange={(e) => handleRangeChange(e, setEnergyRange)}
                className="w-full"
              />
              <span>{energyRange.min}</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="max"
                min="0"
                max="1"
                step="0.1"
                value={energyRange.max}
                onChange={(e) => handleRangeChange(e, setEnergyRange)}
                className="w-full"
              />
              <span>{energyRange.max}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Danceability</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="min"
                min="0"
                max="1"
                step="0.1"
                value={danceabilityRange.min}
                onChange={(e) => handleRangeChange(e, setDanceabilityRange)}
                className="w-full"
              />
              <span>{danceabilityRange.min}</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="max"
                min="0"
                max="1"
                step="0.1"
                value={danceabilityRange.max}
                onChange={(e) => handleRangeChange(e, setDanceabilityRange)}
                className="w-full"
              />
              <span>{danceabilityRange.max}</span>
            </div>
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default EnhancedFilters; 