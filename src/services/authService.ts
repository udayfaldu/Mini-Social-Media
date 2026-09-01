import { apiRequest } from './api';
import type { AuthUser, LoginCredentials, RegisterFormData } from '../types';

const AUTH_KEY = 'user';
const TOKEN_KEY = 'token';
const USERS_KEY = 'users';

interface RegisteredUserRecord extends AuthUser {
  password?: string;
}


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const inputUsername = credentials.username.trim().toLowerCase();
    const inputPassword = credentials.password;

    const registeredUsers = authService.getRegisteredUsers();
    const localUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === inputUsername
    );

    if (localUser) {
      if (localUser.password && localUser.password !== inputPassword) {
        throw new Error('Incorrect password. Please try again.');
      }

      const token = localUser.token || `user_session_${Date.now()}`;
      const authUser: AuthUser = {
        id: localUser.id,
        username: localUser.username,
        email: localUser.email,
        firstName: localUser.firstName,
        lastName: localUser.lastName,
        gender: localUser.gender,
        image: localUser.image || `https://dummyjson.com/icon/${localUser.username}/128`,
        token,
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      return authUser;
    }

    try {
      const response = await apiRequest<AuthUser>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password,
          expiresInMins: credentials.expiresInMins || 60,
        }),
      });

      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(response));
      return response;
    } catch {
      throw new Error('Invalid username or password.');
    }
  },

  async register(data: RegisterFormData): Promise<AuthUser> {
    let registeredUser: AuthUser;

    try {
      registeredUser = await apiRequest<AuthUser>('/users/add', {
        method: 'POST',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
          gender: data.gender,
          image: `https://dummyjson.com/icon/${data.username}/128`,
        }),
      });
    } catch {
      registeredUser = {
        id: Date.now(),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: `https://dummyjson.com/icon/${data.username}/128`,
      };
    }

    const dummyToken = `simulated_token_${Date.now()}`;
    const userRecord: RegisteredUserRecord = {
      ...registeredUser,
      password: data.password,
      token: dummyToken,
    };

    const existingList = authService.getRegisteredUsers();
    const filtered = existingList.filter(
      (u) => u.username.toLowerCase() !== data.username.toLowerCase()
    );
    filtered.push(userRecord);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));

    return userRecord;
  },

  getRegisteredUsers(): RegisteredUserRecord[] {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as AuthUser;
      if (parsed && typeof parsed.id === 'number' && typeof parsed.username === 'string') {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};

