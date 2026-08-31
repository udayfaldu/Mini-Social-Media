import { apiRequest } from './api';
import type { Post, PostsResponse, CreatePostInput } from '../types';

export interface DeletePostResponse {
  id: number;
  isDeleted: boolean;
  deletedOn?: string;
}

export const postService = {
  getPosts(limit: number = 10, skip: number = 0): Promise<PostsResponse> {
    return apiRequest<PostsResponse>(`/posts?limit=${limit}&skip=${skip}`);
  },

  searchPosts(query: string, limit: number = 10, skip: number = 0): Promise<PostsResponse> {
    const encoded = encodeURIComponent(query.trim());
    return apiRequest<PostsResponse>(`/posts/search?q=${encoded}&limit=${limit}&skip=${skip}`);
  },

  getPostsByTag(tag: string, limit: number = 10, skip: number = 0): Promise<PostsResponse> {
    const encoded = encodeURIComponent(tag.trim());
    return apiRequest<PostsResponse>(`/posts/tag/${encoded}?limit=${limit}&skip=${skip}`);
  },

  getPostById(id: number): Promise<Post> {
    return apiRequest<Post>(`/posts/${id}`);
  },

  async getTags(): Promise<string[]> {
    const response = await apiRequest<unknown>('/posts/tags');
    if (Array.isArray(response)) {
      return response.map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null && 'slug' in item) {
          return String((item as { slug: unknown }).slug);
        }
        if (typeof item === 'object' && item !== null && 'name' in item) {
          return String((item as { name: unknown }).name);
        }
        return String(item);
      });
    }
    return ['history', 'american', 'crime', 'french', 'magical', 'english', 'fiction', 'love'];
  },

  createPost(postData: CreatePostInput): Promise<Post> {
    return apiRequest<Post>('/posts/add', {
      method: 'POST',
      body: JSON.stringify({
        title: postData.title,
        body: postData.body,
        userId: postData.userId,
        tags: postData.tags,
        reactions: { likes: 0, dislikes: 0 },
      }),
    });
  },

  deletePost(id: number): Promise<DeletePostResponse> {
    return apiRequest<DeletePostResponse>(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};
