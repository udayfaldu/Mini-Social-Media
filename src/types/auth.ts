export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | 'other';
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}
