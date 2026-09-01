import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { postService } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import type { CreatePostInput } from '../types';
import { CreatePostForm } from '../components/posts/CreatePostForm';

export function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const currentUserId = user?.id || 1;

  const handleCreatePost = async (postData: CreatePostInput) => {
    setIsLoading(true);
    try {
      const newPost = await postService.createPost(postData);
      toast.success(`Post "${newPost.title}" published!`);
      navigate('/', { replace: true });
    } catch {
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Create Post
        </h1>
        <p className="text-xs text-gray-500">
          Write and share a post with the community
        </p>
      </div>

      <CreatePostForm
        onSubmit={handleCreatePost}
        userId={currentUserId}
        isLoading={isLoading}
      />
    </div>
  );
}

