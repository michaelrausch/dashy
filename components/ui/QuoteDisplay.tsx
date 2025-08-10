"use client";

import { useState, useEffect } from 'react';
import { Quote } from '@/types';

interface QuoteDisplayProps {
  quotes: Quote[];
  className?: string;
}

export const QuoteDisplay = ({ quotes, className = "" }: QuoteDisplayProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => 
    Math.floor(Math.random() * quotes.length)
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuote = quotes[currentQuoteIndex];

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Half of the total animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleQuoteChange = () => {
    setIsAnimating(true);
    // Delay the quote change to allow fade out
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuoteIndex(newIndex);
    }, 150); // Half of fade duration
  };

  return (
    <div className={`mt-6 animate-in fade-in-0 ${className}`} style={{ animationDelay: '600ms', animationDuration: '800ms' }} onClick={handleQuoteChange}>
      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <blockquote className="text-gray-300 font-sans font-light text-lg md:text-xl italic leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        <cite className="block text-gray-500 font-sans font-light text-sm md:text-base mt-3 not-italic">
          — {currentQuote.author}
        </cite>
      </div>
    </div>
  );
};