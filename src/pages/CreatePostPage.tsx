import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import type { CreatePostInput } from '../types';
import { CreatePostForm } from '../components/posts/CreatePostForm';
import { Alert } from '../components/common/Alert';

export function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentUserId = user?.id || 1;

  const handleCreatePost = async (postData: CreatePostInput) => {
    setIsLoading(true);
    try {
      const newPost = await postService.createPost(postData);
      setSuccessMessage(`Post "${newPost.title}" published.`);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
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

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
        />
      )}

      <CreatePostForm
        onSubmit={handleCreatePost}
        userId={currentUserId}
        isLoading={isLoading}
      />
    </div>
  );
}
