"use client";

interface SignOutConfirmationModalProps {
  isOpen: boolean;
  isSigningOut: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SignOutConfirmationModal = ({ 
  isOpen, 
  isSigningOut, 
  onConfirm, 
  onCancel 
}: SignOutConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="text-center">
          <div className="text-4xl mb-4">👋</div>
          <h3 className="text-xl font-serif font-light text-white mb-2">
            Sign Out?
          </h3>
          <p className="text-gray-400 font-sans font-light mb-8">
            Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-sans font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSigningOut}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 rounded-xl text-white font-sans font-medium transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Signing out...
                </>
              ) : (
                "Yes, Sign Out"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};