import { Link } from 'react-router-dom';
import { Mail, Building2, MapPin } from 'lucide-react';
import type { User } from '../../types';
import { Avatar } from '../common/Avatar';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            username={user.username}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>

          {user.company && (
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="truncate">
                {user.company.title} at {user.company.name}
              </span>
            </div>
          )}

          {user.address && (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="truncate">
                {user.address.city}, {user.address.state}
              </span>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/users/${user.id}`}
        className="w-full text-center py-1.5 px-3 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium transition"
      >
        View Profile
      </Link>
    </div>
  );
}
