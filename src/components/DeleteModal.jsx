import React, { useEffect } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function DeleteModal({ isOpen, onClose, onConfirm, taskTitle }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-scale-in z-10">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          {/* Warning Icon Circle */}
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500">
            <FiAlertTriangle className="w-6 h-6 animate-bounce" />
          </div>

          {/* Alert messages */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
              Delete Task
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{taskTitle}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Buttons section */}
        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-700/30 transition-all focus:outline-none"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
