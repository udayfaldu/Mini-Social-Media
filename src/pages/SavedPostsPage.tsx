import { useState } from 'react';
import { Bookmark, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAllSavedPosts, removeSavedPost } from '../store/slices/savedPostsSlice';
import { PostCard } from '../components/posts/PostCard';
import { EmptyState } from '../components/common/EmptyState';
import { ModalPortal } from '../components/common/ModalPortal';
import { Pagination } from '../components/common/Pagination';
import type { Post } from '../types';

const PAGE_SIZE = 10;

export function SavedPostsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const savedPosts = useAppSelector((state) => state.savedPosts.savedPosts);

  const [page, setPage] = useState<number>(1);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);

  const totalPages = Math.ceil(savedPosts.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const paginatedPosts = savedPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClearAll = () => {
    dispatch(clearAllSavedPosts());
    setIsClearModalOpen(false);
    setPage(1);
  };

  const handleRemovePost = () => {
    if (postToRemove) {
      dispatch(removeSavedPost(postToRemove.id));
      setPostToRemove(null);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Saved Posts
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold">
              {savedPosts.length}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Posts you've bookmarked
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedPosts.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Feed</span>
          </button>
        </div>
      </div>

      {savedPosts.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-6 h-6 text-gray-400" />}
          title="No saved posts"
          description="Click the bookmark icon on any post to save it here."
          action={
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
            >
              Explore Feed
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDeleteClick={(p) => setPostToRemove(p)}
                showDeleteButton={true}
              />
            ))}
          </div>

          {savedPosts.length > PAGE_SIZE && (
            <Pagination
              currentPage={currentPage}
              totalItems={savedPosts.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </>
      )}

      <ModalPortal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Saved Posts?"
        confirmText="Clear All"
        cancelText="Cancel"
        isDestructive={true}
      >
        <p>
          Are you sure you want to remove all <strong>{savedPosts.length}</strong> saved posts?
        </p>
      </ModalPortal>

      <ModalPortal
        isOpen={Boolean(postToRemove)}
        onClose={() => setPostToRemove(null)}
        onConfirm={handleRemovePost}
        title="Remove Bookmark?"
        confirmText="Remove"
        cancelText="Cancel"
        isDestructive={true}
      >
        <p>
          Remove <strong>"{postToRemove?.title}"</strong> from your saved posts?
        </p>
      </ModalPortal>
    </div>
  );
}
