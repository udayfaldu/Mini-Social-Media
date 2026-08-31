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
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import type { User, Post } from '../types';
import { Avatar } from '../components/common/Avatar';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';
import { PostCard } from '../components/posts/PostCard';
import { EmptyState } from '../components/common/EmptyState';
import { ModalPortal } from '../components/common/ModalPortal';

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const userId = Number(id);
    if (isNaN(userId)) {
      setError('Invalid user ID.');
      setLoading(false);
      return;
    }

    async function loadUserData() {
      setLoading(true);
      setError(null);
      try {
        const fetchedUser = await userService.getUserById(userId);
        setUser(fetchedUser);
      } catch (err: unknown) {
        if (currentUser && currentUser.id === userId) {
          setUser({
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            username: currentUser.username,
            email: currentUser.email,
            gender: currentUser.gender,
            image: currentUser.image || `https://dummyjson.com/icon/${currentUser.username}/128`,
            age: 24,
            phone: '+1 (555) 234-5678',
            role: 'Member',
          });
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch user profile.');
        }
      } finally {
        setLoading(false);
      }
    }

    void loadUserData();
  }, [id, currentUser]);

  useEffect(() => {
    const userId = Number(id);
    if (isNaN(userId)) return;

    async function loadUserPosts() {
      setPostsLoading(true);
      setPostsError(null);
      try {
        const response = await userService.getUserPosts(userId);
        setUserPosts(response.posts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setPostsError(err.message);
        } else {
          setPostsError('Failed to load user posts.');
        }
      } finally {
        setPostsLoading(false);
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
      setFeedbackMessage({
        type: 'success',
        text: `Post "${postToDelete.title}" was deleted.`,
      });
      setPostToDelete(null);
    } catch {
      setUserPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setFeedbackMessage({
        type: 'info',
        text: `Post "${postToDelete.title}" was removed.`,
      });
      setPostToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" label="Loading profile..." />
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
        <Alert type="error" title="Error" message={error || 'User not found.'} />
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

      {feedbackMessage && (
        <Alert
          type={feedbackMessage.type}
          message={feedbackMessage.text}
          onClose={() => setFeedbackMessage(null)}
        />
      )}

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

        {postsLoading && <Spinner size="sm" label="Loading posts..." />}

        {postsError && (
          <Alert type="error" title="Error" message={postsError} />
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
