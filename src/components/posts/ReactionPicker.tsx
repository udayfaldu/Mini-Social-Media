import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ReactionPickerProps {
  initialCount: number;
  postId: number;
  size?: 'sm' | 'md';
}

export function ReactionPicker({
  initialCount,
  postId,
  size = 'sm',
}: ReactionPickerProps) {
  const { isAuthenticated } = useAuth();
  const storageKey = `miniconnect_liked_post_${postId}`;

  const [isLiked, setIsLiked] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const [count, setCount] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'true' ? initialCount + 1 : initialCount;
    } catch {
      return initialCount;
    }
  });

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    if (isLiked) {
      setIsLiked(false);
      setCount((prev) => Math.max(0, prev - 1));
      localStorage.removeItem(storageKey);
    } else {
      setIsLiked(true);
      setCount((prev) => prev + 1);
      localStorage.setItem(storageKey, 'true');
    }
  };

  const iconClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  if (!isAuthenticated) {
    return (
      <div
        className={`flex items-center gap-1.5 px-2 py-1 text-gray-400 select-none cursor-not-allowed ${
          size === 'md' ? 'text-sm' : 'text-xs'
        }`}
        title="Sign in to like"
      >
        <Heart className={iconClass} />
        <span>{count}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      title={isLiked ? 'Unlike' : 'Like'}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors select-none ${
        isLiked
          ? 'text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/40'
          : 'text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${size === 'md' ? 'text-sm' : 'text-xs'}`}
    >
      <Heart
        className={`${iconClass} transition-transform ${
          isLiked ? 'fill-red-500 text-red-500 scale-110' : ''
        }`}
      />
      <span>{count}</span>
    </button>
  );
}


