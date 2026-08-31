import { apiRequest } from './api';
import { authService } from './authService';
import type { User, UsersResponse, PostsResponse } from '../types';

export const userService = {
  getUsers(limit: number = 30, skip: number = 0): Promise<UsersResponse> {
    return apiRequest<UsersResponse>(`/users?limit=${limit}&skip=${skip}`);
  },

  searchUsers(query: string): Promise<UsersResponse> {
    const encoded = encodeURIComponent(query.trim());
    return apiRequest<UsersResponse>(`/users/search?q=${encoded}`);
  },

  async getUserById(id: number): Promise<User> {
    const storedUser = authService.getStoredUser();

    if (storedUser && storedUser.id === id) {
      return {
        id: storedUser.id,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        username: storedUser.username,
        email: storedUser.email,
        gender: storedUser.gender,
        image: storedUser.image || `https://dummyjson.com/icon/${storedUser.username}/128`,
        age: 24,
        phone: '+1 (555) 234-5678',
        role: 'Member',
        company: {
          name: 'MiniConnect Community',
          title: 'Creator',
          department: 'Development',
        },
        address: {
          address: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
        },
      };
    }

    try {
      return await apiRequest<User>(`/users/${id}`);
    } catch (err) {
      if (storedUser && storedUser.id === id) {
        return {
          id: storedUser.id,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          username: storedUser.username,
          email: storedUser.email,
          gender: storedUser.gender,
          image: storedUser.image || `https://dummyjson.com/icon/${storedUser.username}/128`,
          age: 24,
          phone: '+1 (555) 234-5678',
          role: 'Member',
        };
      }
      throw err;
    }
  },

  async getUserPosts(userId: number): Promise<PostsResponse> {
    try {
      return await apiRequest<PostsResponse>(`/posts/user/${userId}`);
    } catch {
      return {
        posts: [],
        total: 0,
        skip: 0,
        limit: 0,
      };
    }
  },
};
