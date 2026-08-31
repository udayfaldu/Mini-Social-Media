import { apiRequest } from './api';
import type { CommentsResponse } from '../types';

export const commentService = {
  getCommentsByPostId(postId: number): Promise<CommentsResponse> {
    return apiRequest<CommentsResponse>(`/posts/${postId}/comments`);
  },
};
