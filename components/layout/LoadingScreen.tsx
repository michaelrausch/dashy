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
      <div className="relative z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/60"></div>
      </div>
    </div>
  );
};