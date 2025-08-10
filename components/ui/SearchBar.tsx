"use client";

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <div className={`max-w-2xl animate-in fade-in-0 ${className}`} style={{ animationDelay: '600ms', animationDuration: '600ms' }}>
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search the web..."
            className="w-full px-6 md:px-8 py-4 md:py-6 pr-20 md:pr-24 text-lg md:text-xl bg-black/30 border border-white/10 rounded-2xl md:rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent focus:bg-black/40 transition-all duration-500 hover:bg-black/40 font-sans font-light tracking-wide glass group-hover:border-white/20"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          />
          <button
            type="submit"
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all duration-500 hover:scale-105 shadow-lg font-sans font-light tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!searchQuery.trim()}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};