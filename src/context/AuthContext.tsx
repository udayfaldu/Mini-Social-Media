import { createContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthContextType, AuthUser, LoginCredentials, RegisterFormData } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch {
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const authUser = await authService.login(credentials);
      setUser(authUser);
      setToken(authUser.token || 'demo-token');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
