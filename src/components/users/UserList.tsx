import type { User } from '../../types';
import { UserCard } from './UserCard';
import { Alert } from '../common/Alert';
import { EmptyState } from '../common/EmptyState';
import { Users as UsersIcon } from 'lucide-react';

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function UserList({ users, loading, error, onRetry }: UserListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-1 flex-1">
                <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="h-7 w-full bg-gray-200 dark:bg-gray-800 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Error"
        message={error}
      />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="w-6 h-6 text-gray-400" />}
        title="No users found"
        description="No matching user accounts were found."
        action={
          onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
            >
              Reset Search
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
