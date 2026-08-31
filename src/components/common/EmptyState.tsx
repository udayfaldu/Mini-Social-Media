import { type ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-3">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
