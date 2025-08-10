"use client";

import { useState } from 'react';

interface TimeDebuggerProps {
  onTimeOverride: (hour: number | null) => void;
  currentHour: number | null;
}

const timeSlots = [
  { name: "Sunrise", hour: 6, description: "5-8 AM" },
  { name: "Morning", hour: 10, description: "8-12 PM" },
  { name: "Afternoon", hour: 14, description: "12-5 PM" },
  { name: "Sunset", hour: 18, description: "5-8 PM" },
  { name: "Evening", hour: 20, description: "8-9 PM" },
  { name: "Night", hour: 23, description: "9 PM - 5 AM" },
];

export const TimeDebugger = ({ onTimeOverride, currentHour }: TimeDebuggerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const actualHour = new Date().getHours();
  
  const getCurrentSlotName = () => {
    const hour = currentHour ?? actualHour;
    if (hour >= 5 && hour < 8) return "Sunrise";
    if (hour >= 8 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 20) return "Sunset";
    if (hour >= 20 && hour < 21) return "Evening";
    return "Night";
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 text-white/70 hover:text-white/90 font-sans font-light text-xs hover:bg-black/80 transition-all duration-300 flex items-center gap-1.5 opacity-40 hover:opacity-100"
        >
          <span className="text-xs">⏰</span>
          <span>{getCurrentSlotName()}</span>
          {currentHour !== null && (
            <span className="text-orange-400 text-xs">●</span>
          )}
        </button>
      ) : (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 min-w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-sans font-medium text-sm">Time Debugger</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={() => onTimeOverride(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                currentHour === null 
                  ? 'bg-purple-500/20 border border-purple-400/30 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Auto (Real Time)</span>
                <span className="text-xs">{actualHour}:00</span>
              </div>
            </button>
            
            {timeSlots.map((slot) => (
              <button
                key={slot.name}
                onClick={() => onTimeOverride(slot.hour)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentHour === slot.hour 
                    ? 'bg-purple-500/20 border border-purple-400/30 text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{slot.name}</span>
                  <span className="text-xs">{slot.description}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 border-t border-white/10 pt-2">
            {currentHour !== null ? (
              <span>Override active: {currentHour}:00</span>
            ) : (
              <span>Using real time: {actualHour}:00</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};