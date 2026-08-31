import { type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Alert({
  type = 'info',
  title,
  message,
  children,
  className = '',
  onClose,
}: AlertProps) {
  const styles = {
    error: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-900/50',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/50',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-900/50',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-900/50',
  };

  const icons = {
    error: <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 p-3 rounded-lg border ${styles[type]} ${className}`}
    >
      {icons[type]}
      <div className="flex-1 text-xs sm:text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        {message && <p>{message}</p>}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs opacity-60 hover:opacity-100 p-0.5"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}
