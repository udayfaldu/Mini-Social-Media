import { configureStore } from '@reduxjs/toolkit';
import savedPostsReducer from './slices/savedPostsSlice';
import authReducer from './slices/authSlice';


export const store = configureStore({
  reducer: {
    savedPosts: savedPostsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
