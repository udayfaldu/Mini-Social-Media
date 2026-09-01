import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Bookmark } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../store/hooks';
import { selectSavedPosts } from '../../store/slices/savedPostsSlice';
import { Avatar } from './Avatar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const savedPosts = useAppSelector(selectSavedPosts);


  const navItems = [
    {
      to: '/',
      label: 'Feed',
      icon: LayoutDashboard,
    },
    ...(user
      ? [
          {
            to: '/saved',
            label: 'Saved Posts',
            icon: Bookmark,
            badge: savedPosts.length > 0 ? savedPosts.length : undefined,
          },
        ]
      : []),
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 w-56 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-150 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-3 overflow-y-auto`}
      >
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-1.5 py-0.2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {user && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <Link
              to={`/users/${user.id}`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                username={user.username}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
