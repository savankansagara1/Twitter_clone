import React, { useEffect } from "react";
import TweetForm from "./TweetForm";

interface TweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTweetCreated: () => void;
}

/**
 * Modal overlay for composing a tweet from the Sidebar's "Tweet" button.
 * Closes on Escape key or backdrop click.
 */
const TweetModal: React.FC<TweetModalProps> = ({ isOpen, onClose, onTweetCreated }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTweetCreated = () => {
    onTweetCreated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button
            onClick={onClose}
            className="text-textPrimary hover:bg-surface rounded-full p-2 transition-colors text-lg leading-none"
            title="Close"
          >
            ✕
          </button>
          <span className="text-textSecondary text-sm">Compose Tweet</span>
          <div className="w-8" /> {/* spacer */}
        </div>

        {/* Tweet form inside the modal */}
        <TweetForm onTweetCreated={handleTweetCreated} />
      </div>
    </div>
  );
};

export default TweetModal;
