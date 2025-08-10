"use client";

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

interface StarfieldProps {
  density?: number; // Number of stars (default: 100)
  className?: string;
}

export const Starfield = ({ density = 100, className = "" }: StarfieldProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < density; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // Percentage
          y: Math.random() * 100, // Percentage
          size: Math.random() * 1.5 + 0.5, // 0.5-2px (smaller)
          opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6 (softer)
          twinkleDelay: Math.random() * 5, // 0-5 seconds delay
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, [density]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.twinkleDelay}s`,
            animationDuration: `${2 + Math.random() * 3}s`, // 2-5 second twinkle
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.4), 0 0 ${star.size * 6}px rgba(255, 255, 255, 0.2), 0 0 ${star.size * 10}px rgba(255, 255, 255, 0.1)`,
          }}
        />
      ))}
      
      {/* Add some special constellation-like patterns */}
      <div className="absolute top-1/4 right-1/3">
        <div className="relative">
          {/* Big Dipper-like pattern */}
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-50" style={{ left: '0px', top: '0px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.3)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-40" style={{ left: '18px', top: '3px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.5), 0 0 6px rgba(255, 255, 255, 0.25)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-60" style={{ left: '35px', top: '2px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.7), 0 0 6px rgba(255, 255, 255, 0.35)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-45" style={{ left: '52px', top: '-1px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.55), 0 0 6px rgba(255, 255, 255, 0.28)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-55" style={{ left: '42px', top: '15px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.65), 0 0 6px rgba(255, 255, 255, 0.32)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-50" style={{ left: '58px', top: '18px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.3)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-40" style={{ left: '74px', top: '16px', boxShadow: '0 0 3px rgba(255, 255, 255, 0.5), 0 0 6px rgba(255, 255, 255, 0.25)' }} />
        </div>
      </div>

      {/* Another constellation pattern */}
      <div className="absolute top-1/3 left-1/4">
        <div className="relative">
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse" style={{ left: '0px', top: '0px', animationDelay: '1s', boxShadow: '0 0 4px rgba(255, 255, 255, 0.7), 0 0 8px rgba(255, 255, 255, 0.4)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" style={{ left: '25px', top: '-12px', animationDelay: '2s', boxShadow: '0 0 3px rgba(255, 255, 255, 0.5), 0 0 6px rgba(255, 255, 255, 0.25)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-pulse" style={{ left: '12px', top: '20px', animationDelay: '0.5s', boxShadow: '0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.3)' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-45 animate-pulse" style={{ left: '35px', top: '8px', animationDelay: '1.5s', boxShadow: '0 0 3px rgba(255, 255, 255, 0.55), 0 0 6px rgba(255, 255, 255, 0.28)' }} />
        </div>
      </div>


    </div>
  );
};