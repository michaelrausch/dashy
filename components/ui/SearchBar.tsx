"use client";

import { useState } from 'react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

// Curated bang examples from the API
const bangExamples = [
  "!gpt build me a neural network",
  "!gh awesome-selfhosted",
  "!yt old mcdonald had a farm",
  "!reddit investing stonks",
  "!maps alien crash sites",
  "!w quantum computing",
  "!so how to exit vim",
  "!nf ET Movie",
  "!gi cyberpunk city art"
];

export const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  
  const { displayText } = useTypingAnimation({
    strings: bangExamples,
    typeSpeed: 50,
    deleteSpeed: 25,
    delayBetweenStrings: 1500,
    loop: true
  });

  // Add blinking cursor to the display text when not focused
  const placeholderText = searchFocused ? "Search the web..." : displayText;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className={`max-w-2xl animate-in fade-in-0 ${className}`} style={{ animationDelay: '600ms', animationDuration: '600ms' }}>
        <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={placeholderText}
            className={`w-full px-6 md:px-8 py-4 md:py-6 pr-20 md:pr-24 text-lg md:text-xl bg-black/30 border border-white/10 rounded-2xl md:rounded-3xl text-white placeholder-gray-400 outline-none ring-0 transition-all duration-200 ease-out hover:bg-black/40 hover:border-white/15 font-sans font-light tracking-wide glass group-hover:border-white/20 ${!searchFocused ? 'typing-placeholder' : ''}`}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              WebkitAppearance: 'none',
              appearance: 'none',
              boxShadow: 'none',
              outline: 'none',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease-out'
            }}
          />
          <button
            type="submit"
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-white/5 font-sans font-light tracking-wide cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/70 group-hover:bg-white/8"
            disabled={!searchQuery.trim()}
          >
            <span className="flex items-center gap-2">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span className="hidden sm:inline">Search</span>
            </span>
          </button>
        </div>
      </form>
    </div>
    </>
  );
};