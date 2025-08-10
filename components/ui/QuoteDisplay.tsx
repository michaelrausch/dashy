"use client";

import { useState } from 'react';
import { Quote } from '@/types';

interface QuoteDisplayProps {
  quotes: Quote[];
  className?: string;
}

export const QuoteDisplay = ({ quotes, className = "" }: QuoteDisplayProps) => {
  const [currentQuoteIndex] = useState(() => 
    Math.floor(Math.random() * quotes.length)
  );

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className={`mt-6 animate-in fade-in-0 ${className}`} style={{ animationDelay: '600ms', animationDuration: '800ms' }}>
      <blockquote className="text-gray-300 font-sans font-light text-lg md:text-xl italic leading-relaxed">
        "{currentQuote.text}"
      </blockquote>
      <cite className="block text-gray-500 font-sans font-light text-sm md:text-base mt-3 not-italic">
        — {currentQuote.author}
      </cite>
    </div>
  );
};