import type { Post } from '../../types';
import { PostCard } from './PostCard';
import { Alert } from '../common/Alert';
import { EmptyState } from '../common/EmptyState';
import { FileQuestion, RefreshCw } from 'lucide-react';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onTagClick?: (tag: string) => void;
  onDeleteClick?: (post: Post) => void;
  onRetry?: () => void;
  showDeleteButton?: boolean;
}

export function PostList({
  posts,
  loading,
  error,
  onTagClick,
  onDeleteClick,
  onRetry,
  showDeleteButton = false,
}: PostListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3"
          >
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4">
        <Alert type="error" title="Error" message={error}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </Alert>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileQuestion className="w-6 h-6 text-gray-400" />}
        title="No posts found"
        description="Try changing your search keywords or active filters."
        action={
          onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
            >
              Reset Filters
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onTagClick={onTagClick}
          onDeleteClick={onDeleteClick}
          showDeleteButton={showDeleteButton}
        />
      ))}
    </div>
  );
}
