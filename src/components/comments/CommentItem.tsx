import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const { isAuthenticated } = useAuth();
  const initialLikes = comment.likes ?? 0;
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);


  const handleLike = () => {
    if (!isAuthenticated) return;
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const username = comment.user?.username || `user_${comment.user?.id || 'anon'}`;
  const fullName = comment.user?.fullName || username;

  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs sm:text-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {fullName}
          </span>
          <span className="text-xs text-gray-400">@{username}</span>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded transition ${
              isLiked
                ? 'text-red-600 font-medium'
                : 'text-gray-400 hover:text-red-600'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>
        ) : (
          <div
            className="flex items-center gap-1 text-xs text-gray-400 select-none cursor-not-allowed"
            title="Sign in to like comments"
          >
            <Heart className="w-3 h-3" />
            <span>{likes}</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-normal">
        {comment.body}
      </p>
    </div>
  );
}
