"use client";

import { signIn } from "next-auth/react";

interface AuthButtonProps {
  isSigningOut: boolean;
  onSignOut: () => void;
  isAuthenticated: boolean;
  onOpenSettings?: () => void;
}

export const AuthButton = ({ isSigningOut, onSignOut, isAuthenticated, onOpenSettings }: AuthButtonProps) => {
  if (isAuthenticated) {
    return (
      <div className="absolute top-0 right-0 p-6 md:p-8 z-20 flex gap-3">
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="group relative px-4 py-2 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-400/20 rounded-xl text-white/80 hover:text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 backdrop-blur-sm text-sm"
          >
            <span className="text-xs">⚙️</span>
            <span>Settings</span>
          </button>
        )}
        <button
          onClick={onSignOut}
          disabled={isSigningOut}
          className="group relative px-4 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-400/20 rounded-xl text-white/80 hover:text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 backdrop-blur-sm text-sm"
        >
          <span className="text-xs">👋</span>
          <span>
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </span>
          {isSigningOut && (
            <div className="animate-spin rounded-full h-3 w-3 border border-white/30 border-t-white"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-0 right-0 p-6 md:p-8 z-20">
      <button
        onClick={() => signIn("auth0")}
        className="group relative px-4 py-2 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-400/20 rounded-xl text-white/80 hover:text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 backdrop-blur-sm text-sm"
      >
        <span className="text-xs">🔑</span>
        <span>Sign In</span>
      </button>
    </div>
  );
};