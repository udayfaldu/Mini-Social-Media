import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, User, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/common/Alert';
import type { LoginCredentials } from '../types';
import { validateUsername } from '../utils/validators';

interface LoginLocationState {
  from?: { pathname?: string };
  registeredUsername?: string;
  successMessage?: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LoginLocationState | null;
  const fromPath = locationState?.from?.pathname || '/';

  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: locationState?.registeredUsername || 'emilys',
    password: locationState?.registeredUsername ? '' : 'emilyspass',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    locationState?.successMessage || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const usernameValidation = validateUsername(credentials.username);
  const isPasswordValid = credentials.password.trim().length >= 6;

  const isFormValid = usernameValidation.isValid && isPasswordValid;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setError(null);

    if (!isFormValid || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await login(credentials);
      navigate(fromPath, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (username: string, pass: string) => {
    setSuccessMessage(null);
    setError(null);
    setCredentials({
      username,
      password: pass,
    });
    setTouched({});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Sign In
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Log in to your account
          </p>
        </div>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <div className="p-2.5 rounded-md bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Demo Accounts:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('emilys', 'emilyspass')}
              className="px-2 py-1 rounded bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-600 text-[11px] font-medium hover:bg-gray-50"
            >
              emilys / emilyspass
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('michaelw', 'michaelwpass')}
              className="px-2 py-1 rounded bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-600 text-[11px] font-medium hover:bg-gray-50"
            >
              michaelw / michaelwpass
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                Username *
              </label>
              {credentials.username && usernameValidation.isValid && (
                <Check className="w-3 h-3 text-green-500" />
              )}
            </div>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                placeholder="Username"
                className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                  touched.username && !usernameValidation.isValid
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
            </div>
            {touched.username && !usernameValidation.isValid && (
              <p className="mt-1 text-[11px] text-red-500 leading-tight">
                {usernameValidation.error}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                Password *
              </label>
              {credentials.password && isPasswordValid && (
                <Check className="w-3 h-3 text-green-500" />
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="Password"
                className={`w-full pl-8 pr-8 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                  touched.password && !isPasswordValid
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {touched.password && !isPasswordValid && (
              <p className="mt-1 text-[11px] text-red-500 leading-tight">
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-2 shadow-xs"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
