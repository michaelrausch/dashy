"use client";

import { Starfield } from './Starfield';

interface BackgroundEffectsProps {
  timeOverride?: number | null;
}

export const BackgroundEffects = ({ timeOverride }: BackgroundEffectsProps) => {
  const hour = timeOverride !== null && timeOverride !== undefined 
    ? timeOverride 
    : new Date().getHours();
  
  const isNightTime = hour >= 19 || hour < 7;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Standard background effects */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/2 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/2 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500/2 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      
      {/* Starfield appears only at night */}
      {isNightTime && (
        <Starfield 
          density={200} 
          className="opacity-50 animate-in fade-in-0" 
        />
      )}
    </div>
  );
};