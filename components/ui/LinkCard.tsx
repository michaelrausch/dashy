"use client";

import { LinkCard as LinkCardType } from '@/types';

interface LinkCardProps {
  link: LinkCardType;
  index: number;
  onClick: (link: LinkCardType) => void;
}

export const LinkCard = ({ link, index, onClick }: LinkCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(link);
    }
  };

  return (
    <button
      onClick={() => onClick(link)}
      onKeyDown={handleKeyDown}
      className="group relative overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 text-left cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationDuration: '600ms',
        animationFillMode: 'both'
      }}
      tabIndex={0}
    >
      <div className={`absolute inset-0 ${link.gradient} opacity-0 group-hover:opacity-10 group-focus:opacity-8 transition-all duration-500`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-6 md:p-8 text-center">
        <div className="text-4xl md:text-5xl mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-focus:scale-105">
          {link.icon}
        </div>
        <h3 className="text-white font-sans font-light text-lg md:text-xl group-hover:text-white group-focus:text-gray-200 transition-colors duration-500 tracking-wide">
          {link.title}
        </h3>
      </div>
      {/* Subtle glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
    </button>
  );
};