import { type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MessageSquare, Trash2 } from 'lucide-react';
import type { Post } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSavedPost } from '../../store/slices/savedPostsSlice';
import { useAuthor } from '../../hooks/useAuthor';
import { useAuth } from '../../hooks/useAuth';
import { ReactionPicker } from './ReactionPicker';

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
  onDeleteClick?: (post: Post) => void;
  showDeleteButton?: boolean;
}

export function PostCard({
  post,
  onTagClick,
  onDeleteClick,
  showDeleteButton = true,
}: PostCardProps) {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector((state) =>
    state.savedPosts.savedPosts.some((p) => p.id === post.id)
  );

  const { authorName, isOwnPost } = useAuthor(post.userId);

  const initialLikes =
    typeof post.reactions === 'number'
      ? post.reactions
      : post.reactions?.likes ?? 0;

  const handleSaveToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    dispatch(toggleSavedPost(post));
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(post);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Link
            to={`/users/${post.userId}`}
            className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <span>{authorName}</span>
            {isOwnPost && (
              <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                You
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1">
            {isAuthenticated && isOwnPost && showDeleteButton && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 rounded transition"
                aria-label="Delete post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSaveToggle}
                className={`p-1 rounded transition ${
                  isSaved
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
                title={isSaved ? 'Unsave' : 'Save'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <Link to={`/posts/${post.id}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition">
            {post.title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 leading-relaxed">
          {post.body}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
        <ReactionPicker
          initialCount={initialLikes}
          postId={post.id}
          size="sm"
        />

        <Link
          to={`/posts/${post.id}`}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Comments</span>
        </Link>
      </div>
    </article>
  );
}
