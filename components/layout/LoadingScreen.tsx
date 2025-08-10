"use client";

import { BackgroundEffects } from './BackgroundEffects';

interface LoadingScreenProps {
  gradientClass?: string;
  timeOverride?: number | null;
}

export const LoadingScreen = ({ gradientClass, timeOverride }: LoadingScreenProps) => {
  return (
    <div className={`min-h-screen ${gradientClass || 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'} relative overflow-hidden flex items-center justify-center`}>
      <BackgroundEffects timeOverride={timeOverride} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
        <div className="text-white/80 text-lg font-sans font-light">Loading...</div>
      </div>
    </div>
  );
};