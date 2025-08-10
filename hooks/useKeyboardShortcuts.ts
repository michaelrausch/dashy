import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  showSignOutConfirm: boolean;
  isSigningOut: boolean;
  setShowSignOutConfirm: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  handleSignOut: () => void;
}

export const useKeyboardShortcuts = ({
  showSignOutConfirm,
  isSigningOut,
  setShowSignOutConfirm,
  setSearchQuery,
  handleSignOut
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Sign out confirmation dialog shortcuts
      if (showSignOutConfirm) {
        if (e.key === "Escape") {
          setShowSignOutConfirm(false);
        } else if (e.key === "Enter" && !isSigningOut) {
          handleSignOut();
        }
      }
      
      // Global search shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
      
      // Clear search on Escape when search is focused
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput === document.activeElement) {
          searchInput.blur();
          setSearchQuery("");
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showSignOutConfirm, isSigningOut, setShowSignOutConfirm, setSearchQuery, handleSignOut]);
};