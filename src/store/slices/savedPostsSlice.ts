import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../../types';

interface SavedPostsState {
  savedPosts: Post[];
}

const STORAGE_KEY = 'miniconnect_saved_posts';

const loadSavedPosts = (): Post[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const persistSavedPosts = (posts: Post[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
};

const initialState: SavedPostsState = {
  savedPosts: loadSavedPosts(),
};

export const savedPostsSlice = createSlice({
  name: 'savedPosts',
  initialState,
  reducers: {
    addSavedPost: (state, action: PayloadAction<Post>) => {
      if (!state.savedPosts.some((p) => p.id === action.payload.id)) {
        state.savedPosts.unshift(action.payload);
        persistSavedPosts(state.savedPosts);
      }
    },
    removeSavedPost: (state, action: PayloadAction<number>) => {
      state.savedPosts = state.savedPosts.filter((p) => p.id !== action.payload);
      persistSavedPosts(state.savedPosts);
    },
    toggleSavedPost: (state, action: PayloadAction<Post>) => {
      const index = state.savedPosts.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.savedPosts.splice(index, 1);
      } else {
        state.savedPosts.unshift(action.payload);
      }
      persistSavedPosts(state.savedPosts);
    },
    clearAllSavedPosts: (state) => {
      state.savedPosts = [];
      persistSavedPosts([]);
    },
  },
});

export const {
  addSavedPost,
  removeSavedPost,
  toggleSavedPost,
  clearAllSavedPosts,
} = savedPostsSlice.actions;

export default savedPostsSlice.reducer;
