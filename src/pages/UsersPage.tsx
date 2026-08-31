import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { userService } from '../services/userService';
import type { User } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { UserList } from '../components/users/UserList';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    let isCancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (debouncedSearch.trim()) {
          response = await userService.searchUsers(debouncedSearch.trim());
        } else {
          response = await userService.getUsers(30);
        }

        if (!isCancelled) {
          setUsers(response.users);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to fetch users.');
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <div className="space-y-4 pb-8">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Users
        </h1>
        <p className="text-xs text-gray-500">
          Explore member profiles and their posts
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-8 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <UserList
        users={users}
        loading={loading}
        error={error}
        onRetry={() => setSearchQuery('')}
      />
    </div>
  );
}
