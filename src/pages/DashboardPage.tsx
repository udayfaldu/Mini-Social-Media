import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { postService } from '../services/postService';
import type { Post, PostFilterState } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { PostFilter } from '../components/posts/PostFilter';
import { PostList } from '../components/posts/PostList';
import { Pagination } from '../components/common/Pagination';
import { ModalPortal } from '../components/common/ModalPortal';

const PAGE_SIZE = 10;

export function DashboardPage() {
  const [allFetchedPosts, setAllFetchedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [filters, setFilters] = useState<PostFilterState>({
    searchQuery: '',
    selectedTags: [],
    sortBy: 'latest',
  });

  const debouncedSearch = useDebounce(filters.searchQuery, 400);

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.selectedTags]);

  useEffect(() => {
    async function loadTags() {
      try {
        const fetchedTags = await postService.getTags();
        setTags(fetchedTags);
      } catch {
        setTags(['history', 'crime', 'magical', 'french', 'fiction', 'love', 'american', 'mystery']);
      }
    }
    void loadTags();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadPosts() {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (debouncedSearch.trim()) {
          response = await postService.searchPosts(debouncedSearch.trim(), 100, 0);
        } else if (filters.selectedTags.length === 1) {
          response = await postService.getPostsByTag(filters.selectedTags[0], 100, 0);
        } else if (filters.selectedTags.length > 1) {
          response = await postService.getPosts(150, 0);
        } else {
          response = await postService.getPosts(100, 0);
        }

        if (!isCancelled) {
          setAllFetchedPosts(response.posts);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to fetch posts.');
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, filters.selectedTags]);

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...allFetchedPosts];

    if (filters.selectedTags.length > 0) {
      result = result.filter((post) =>
        filters.selectedTags.every((selectedTag) =>
          post.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
        )
      );
    }

    if (filters.sortBy === 'popular') {
      result.sort((a, b) => {
        const likesA = typeof a.reactions === 'number' ? a.reactions : a.reactions?.likes || 0;
        const likesB = typeof b.reactions === 'number' ? b.reactions : b.reactions?.likes || 0;
        return likesB - likesA;
      });
    } else if (filters.sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [allFetchedPosts, filters.selectedTags, filters.sortBy]);

  const totalPostsCount = filteredAndSortedPosts.length;
  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredAndSortedPosts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedPosts, page]);

  const handleTagClick = (tag: string) => {
    setFilters((prev) => {
      const isSelected = prev.selectedTags.includes(tag);
      return {
        ...prev,
        selectedTags: isSelected
          ? prev.selectedTags.filter((t) => t !== tag)
          : [...prev.selectedTags, tag],
      };
    });
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);

    try {
      await postService.deletePost(postToDelete.id);
      setAllFetchedPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      toast.success(`Post "${postToDelete.title}" was deleted.`);
      setPostToDelete(null);
    } catch {
      setAllFetchedPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      toast.info(`Post "${postToDelete.title}" was removed.`);
      setPostToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Feed
        </h1>
        <p className="text-xs text-gray-500">
          Explore community posts
        </p>
      </div>


      <PostFilter
        filters={filters}
        onFilterChange={setFilters}
        availableTags={tags}
      />

      <PostList
        posts={paginatedPosts}
        loading={loading}
        error={error}
        onTagClick={handleTagClick}
        onDeleteClick={(post) => setPostToDelete(post)}
        onRetry={() => {
          setFilters({ searchQuery: '', selectedTags: [], sortBy: 'latest' });
          setPage(1);
        }}
        showDeleteButton={true}
      />

      {!loading && !error && totalPostsCount > PAGE_SIZE && (
        <Pagination
          currentPage={page}
          totalItems={totalPostsCount}
          pageSize={PAGE_SIZE}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      <ModalPortal
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete <strong>"{postToDelete?.title}"</strong>?
        </p>
      </ModalPortal>
    </div>
  );
}
