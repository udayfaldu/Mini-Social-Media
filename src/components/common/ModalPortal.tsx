import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

export interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ModalPortal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}: ModalPortalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            {isDestructive && <AlertTriangle className="w-4 h-4 text-red-500" />}
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 text-sm text-gray-600 dark:text-gray-300">
          {children}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs font-medium rounded-md text-white transition flex items-center gap-1.5 ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading && (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
}
