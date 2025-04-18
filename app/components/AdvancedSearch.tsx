"use client";

import React, { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (params: {
    query: string;
    searchFields: string[];
  }) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [searchFields, setSearchFields] = useState(['title', 'artist']);

  const handleSubmit = (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search music..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['title', 'artist', 'genre', 'platform'].map(field => (
            <button
              key={field}
              type="button"
              onClick={() => toggleSearchField(field)}
              className={`px-3 py-1 rounded-full text-sm ${
                searchFields.includes(field)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
} 