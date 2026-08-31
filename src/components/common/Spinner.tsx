interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function Spinner({ size = 'md', label, className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-slate-200 dark:border-slate-800 border-t-brand-600 dark:border-t-brand-400 animate-spin`}
        role="status"
        aria-label="loading"
      />
      {label && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
