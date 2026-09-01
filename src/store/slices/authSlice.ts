import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import type { AuthUser, LoginCredentials, RegisterFormData } from '../../types';

export interface AuthSliceState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialAuthState = (): AuthSliceState => {
  try {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();
    if (storedUser && storedToken) {
      return {
        user: storedUser,
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch {
    authService.logout();
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

export const loginUser = createAsyncThunk<
  AuthUser,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid credentials';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  AuthUser,
  RegisterFormData,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    return await authService.register(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token || action.payload.user.token || 'demo-token';
      state.isAuthenticated = true;
      state.error = null;
    },
    logoutUser: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token || 'demo-token';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { setCredentials, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

