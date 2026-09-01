import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import type { User, Post } from '../types';
import { Avatar } from '../components/common/Avatar';
import { PostCard } from '../components/posts/PostCard';
import { EmptyState } from '../components/common/EmptyState';
import { ModalPortal } from '../components/common/ModalPortal';


export function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const userId = Number(id);
    if (isNaN(userId)) {
      setError('Invalid user ID.');
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadUserData() {
      setLoading(true);
      setError(null);
      try {
        const userData = await userService.getUserById(userId);
        if (!isCancelled) {
          setUser(userData);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to fetch user.');
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadUserData();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const userId = Number(id);
    if (isNaN(userId)) return;

    let isCancelled = false;

    async function loadUserPosts() {
      setPostsLoading(true);
      setPostsError(null);
      try {
        const postsData = await postService.getPosts(100, 0);
        if (!isCancelled) {
          const userSpecificPosts = postsData.posts.filter((p) => p.userId === userId);
          setUserPosts(userSpecificPosts);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          if (err instanceof Error) {
            setPostsError(err.message);
          } else {
            setPostsError('Failed to fetch user posts.');
          }
        }
      } finally {
        if (!isCancelled) {
          setPostsLoading(false);
        }
      }
    }

    void loadUserPosts();
  }, [id]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);

    try {
      await postService.deletePost(postToDelete.id);
      setUserPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      toast.success(`Post "${postToDelete.title}" was deleted.`);
      setPostToDelete(null);
    } catch {
      setUserPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      toast.info(`Post "${postToDelete.title}" was removed.`);
      setPostToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-xs text-gray-500">
        Loading profile...
      </div>
    );
  }


  if (error || !user) {
    return (
      <div className="max-w-xl mx-auto space-y-3 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm">
          {error || 'User not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            username={user.username}
            size="xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.firstName} {user.lastName}
              </h1>
              {user.role && (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{user.phone}</span>
            </div>
          )}

          {user.birthDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Age: {user.age} ({user.birthDate})</span>
            </div>
          )}

          {user.company && (
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{user.company.title} at {user.company.name}</span>
            </div>
          )}

          {user.address && (
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{user.address.city}, {user.address.state}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
          Posts by {user.firstName} ({userPosts.length})
        </h2>

        {postsLoading && <p className="text-xs text-gray-500 py-1">Loading posts...</p>}


        {postsError && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
            {postsError}
          </div>
        )}


        {!postsLoading && !postsError && userPosts.length === 0 && (
          <EmptyState
            title="No posts yet"
            description={`${user.firstName} hasn't published any posts.`}
          />
        )}

        {!postsLoading && userPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDeleteClick={(p) => setPostToDelete(p)}
                showDeleteButton={true}
              />
            ))}
          </div>
        )}
      </div>

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
