import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, logoutUser, clearAuthError } from '../store/slices/authSlice';
import type { LoginCredentials, RegisterFormData } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  };

  const register = async (data: RegisterFormData) => {
    return dispatch(registerUser(data)).unwrap();
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}

