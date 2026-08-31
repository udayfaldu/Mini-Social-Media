import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import type { Post, Comment } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSavedPost } from '../store/slices/savedPostsSlice';
import { useAuth } from '../hooks/useAuth';
import { useAuthor } from '../hooks/useAuthor';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';
import { CommentList } from '../components/comments/CommentList';
import { ModalPortal } from '../components/common/ModalPortal';
import { ReactionPicker } from '../components/posts/ReactionPicker';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  const [copied, setCopied] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { authorName, isOwnPost } = useAuthor(post?.userId || 0);

  const isSaved = useAppSelector((state) =>
    post ? state.savedPosts.savedPosts.some((p) => p.id === post.id) : false
  );

  useEffect(() => {
    const postId = Number(id);
    if (isNaN(postId)) {
      setError('Invalid post ID.');
      setLoading(false);
      return;
    }

    async function loadPostData() {
      setLoading(true);
      setError(null);
      try {
        const fetchedPost = await postService.getPostById(postId);
        setPost(fetchedPost);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch post details.');
        }
      } finally {
        setLoading(false);
      }
    }

    void loadPostData();
  }, [id]);

  useEffect(() => {
    const postId = Number(id);
    if (isNaN(postId)) return;

    async function loadComments() {
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const response = await commentService.getCommentsByPostId(postId);
        setComments(response.comments);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setCommentsError(err.message);
        } else {
          setCommentsError('Failed to load comments.');
        }
      } finally {
        setCommentsLoading(false);
      }
    }

    void loadComments();
  }, [id]);

  const handleSaveToggle = () => {
    if (post) {
      dispatch(toggleSavedPost(post));
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setIsDeleting(true);
    try {
      await postService.deletePost(post.id);
      navigate('/', { replace: true });
    } catch {
      navigate('/', { replace: true });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = (commentBody: string) => {
    const newComment: Comment = {
      id: Date.now(),
      body: commentBody,
      postId: post?.id || 1,
      likes: 0,
      user: {
        id: 999,
        username: 'you',
        fullName: 'You',
      },
    };
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" label="Loading post..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto space-y-3 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <Alert type="error" title="Error" message={error || 'Could not load post.'} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Feed</span>
      </button>

      <article className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <Link
            to={`/users/${post.userId}`}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <span>{authorName}</span>
            {isOwnPost && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                You
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1">
            {isOwnPost && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                title="Delete your post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSaveToggle}
                className={`p-1.5 rounded ${
                  isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'
                }`}
                title={isSaved ? 'Unsave' : 'Save'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          {post.title}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {post.body}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
          <ReactionPicker
            initialCount={
              typeof post.reactions === 'number'
                ? post.reactions
                : post.reactions?.likes ?? 0
            }
            postId={post.id}
            size="md"
          />

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </article>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
        <CommentList
          comments={comments}
          loading={commentsLoading}
          error={commentsError}
          onAddComment={handleAddComment}
        />
      </div>

      <ModalPortal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete <strong>"{post.title}"</strong>?
        </p>
      </ModalPortal>
    </div>
  );
}
