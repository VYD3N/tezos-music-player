"use client";

import React, { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (params: { query: string; searchFields: string[] }) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchFields, setSearchFields] = useState<string[]>(['name', 'artist']);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, searchFields });
  };

  const toggleSearchField = (field: string) => {
    setSearchFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search music..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['name', 'artist', 'musicType', 'platform'].map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => toggleSearchField(field)}
              className={`px-3 py-1 rounded-full text-sm ${
                searchFields.includes(field)
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default AdvancedSearch; 