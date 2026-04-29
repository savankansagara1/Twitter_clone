import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Generic modal overlay — click backdrop or press X to close
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Dark semi-transparent backdrop
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal box — stop click propagation so clicking inside doesn't close */}
      <div
        className="bg-surface rounded-2xl w-full max-w-lg border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {title && <h2 className="text-lg font-bold text-textPrimary">{title}</h2>}
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary transition-colors ml-auto"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
