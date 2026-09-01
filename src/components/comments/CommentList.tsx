import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, LogIn } from 'lucide-react';
import type { Comment } from '../../types';
import { CommentItem } from './CommentItem';
import { Spinner } from '../common/Spinner';
import { EmptyState } from '../common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { validateComment } from '../../utils/validators';

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  onAddComment?: (body: string) => void;
}

export function CommentList({
  comments,
  loading,
  error,
  onAddComment,
}: CommentListProps) {
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [touched, setTouched] = useState(false);


  const commentValidation = validateComment(commentText);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    if (!commentValidation.isValid || !isAuthenticated) return;

    if (onAddComment) {
      onAddComment(commentText.trim());
      setCommentText('');
      setTouched(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Comments ({comments.length})</span>
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Write a comment..."
              className={`flex-1 px-3 py-1.5 rounded-md border text-xs sm:text-sm bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition ${
                touched && commentText && !commentValidation.isValid
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
              }`}
            />
            <button
              type="submit"
              disabled={!commentValidation.isValid}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>
          {touched && commentText && !commentValidation.isValid && (
            <p className="text-[11px] text-red-500">{commentValidation.error}</p>
          )}
        </form>
      ) : (
        <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-xs text-gray-500 flex items-center justify-between">
          <span>Sign in to participate in the conversation.</span>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {loading && <Spinner size="sm" label="Loading comments..." />}

      {error && (
        <p className="text-xs text-red-500 py-1">
          {error}
        </p>
      )}

      {!loading && !error && comments.length === 0 && (
        <EmptyState
          title="No comments yet"
          description="Be the first to comment on this post."
        />
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-2.5">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
