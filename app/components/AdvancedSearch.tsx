"use client";

import React, { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (params: { query: string; searchFields: string[] }) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchFields, setSearchFields] = useState(['name', 'artist']);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search music..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Search
        </button>
      </div>
      <div className="flex gap-2">
        {['name', 'artist', 'genre', 'mood'].map(field => (
          <button
            key={field}
            type="button"
            onClick={() => toggleSearchField(field)}
            className={`px-3 py-1 rounded-full text-sm capitalize ${
              searchFields.includes(field)
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {field}
          </button>
        ))}
      </div>
    </form>
  );
};

export default AdvancedSearch; 