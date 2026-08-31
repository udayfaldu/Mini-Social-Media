import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Check, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/common/Alert';
import type { RegisterFormData } from '../types';
import {
  validateName,
  validateUsername,
  validateEmail,
  validatePassword,
} from '../utils/validators';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'female',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const firstNameValidation = validateName(formData.firstName, 'First Name');
  const lastNameValidation = validateName(formData.lastName, 'Last Name');
  const usernameValidation = validateUsername(formData.username);
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password);
  const doPasswordsMatch =
    formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const isFormValid =
    firstNameValidation.isValid &&
    lastNameValidation.isValid &&
    usernameValidation.isValid &&
    emailValidation.isValid &&
    passwordValidation.isValid &&
    doPasswordsMatch;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid || isLoading) return;
    setError(null);

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/login', {
        replace: true,
        state: {
          registeredUsername: formData.username,
          successMessage: `Account created for @${formData.username}! Please sign in.`,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Sign up failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Create an Account
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Join the MiniConnect community
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  First Name *
                </label>
                {formData.firstName && firstNameValidation.isValid && (
                  <Check className="w-3 h-3 text-green-500" />
                )}
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                placeholder="John"
                className={`w-full px-2.5 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                  touched.firstName && !firstNameValidation.isValid
                    ? 'border-red-400 focus:border-red-500'
                    : touched.firstName && firstNameValidation.isValid
                    ? 'border-green-500/50 dark:border-green-500/40 focus:border-green-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
              {touched.firstName && !firstNameValidation.isValid && (
                <p className="mt-1 text-[11px] text-red-500 leading-tight">
                  {firstNameValidation.error}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Last Name *
                </label>
                {formData.lastName && lastNameValidation.isValid && (
                  <Check className="w-3 h-3 text-green-500" />
                )}
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur('lastName')}
                placeholder="Doe"
                className={`w-full px-2.5 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                  touched.lastName && !lastNameValidation.isValid
                    ? 'border-red-400 focus:border-red-500'
                    : touched.lastName && lastNameValidation.isValid
                    ? 'border-green-500/50 dark:border-green-500/40 focus:border-green-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
              {touched.lastName && !lastNameValidation.isValid && (
                <p className="mt-1 text-[11px] text-red-500 leading-tight">
                  {lastNameValidation.error}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Username *
                </label>
                {formData.username && usernameValidation.isValid && (
                  <Check className="w-3 h-3 text-green-500" />
                )}
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                placeholder="johndoe"
                className={`w-full px-2.5 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                  touched.username && !usernameValidation.isValid
                    ? 'border-red-400 focus:border-red-500'
                    : touched.username && usernameValidation.isValid
                    ? 'border-green-500/50 dark:border-green-500/40 focus:border-green-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
              {touched.username && !usernameValidation.isValid && (
                <p className="mt-1 text-[11px] text-red-500 leading-tight">
                  {usernameValidation.error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:border-blue-500 transition"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                Email Address *
              </label>
              {formData.email && emailValidation.isValid && (
                <Check className="w-3 h-3 text-green-500" />
              )}
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="john.doe@example.com"
              className={`w-full px-2.5 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                touched.email && !emailValidation.isValid
                  ? 'border-red-400 focus:border-red-500'
                  : touched.email && emailValidation.isValid
                  ? 'border-green-500/50 dark:border-green-500/40 focus:border-green-500'
                  : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
              }`}
            />
            {touched.email && !emailValidation.isValid && (
              <p className="mt-1 text-[11px] text-red-500 leading-tight">
                {emailValidation.error}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-2.5 pr-7 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                    touched.password && !passwordValidation.isValid
                      ? 'border-red-400 focus:border-red-500'
                      : touched.password && passwordValidation.isValid
                      ? 'border-green-500/50 dark:border-green-500/40 focus:border-green-500'
                      : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full pl-2.5 pr-7 py-1.5 rounded-md border text-xs bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none transition ${
                    touched.confirmPassword && !doPasswordsMatch
                      ? 'border-red-400 focus:border-red-500'
                      : touched.confirmPassword && doPasswordsMatch
                      ? 'border-green-500/50 dark:border-green-500/40 focus:border-green-500'
                      : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {formData.confirmPassword.length > 0 && (
            <div className="text-[11px] flex items-center gap-1">
              {doPasswordsMatch ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3 text-green-500" /> Passwords match
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-1 font-medium">
                  <X className="w-3 h-3 text-red-500" /> Passwords do not match
                </span>
              )}
            </div>
          )}

          {formData.password.length > 0 && (
            <div className="p-2.5 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-[11px] space-y-1">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password requirements:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-gray-600 dark:text-gray-400">
                <div className={`flex items-center gap-1.5 ${passwordValidation.rules.minLength ? 'text-green-600 dark:text-green-400 font-medium' : ''}`}>
                  {passwordValidation.rules.minLength ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <X className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasUpper ? 'text-green-600 dark:text-green-400 font-medium' : ''}`}>
                  {passwordValidation.rules.hasUpper ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <X className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span>1 uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasLower ? 'text-green-600 dark:text-green-400 font-medium' : ''}`}>
                  {passwordValidation.rules.hasLower ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <X className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span>1 lowercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasNumber ? 'text-green-600 dark:text-green-400 font-medium' : ''}`}>
                  {passwordValidation.rules.hasNumber ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <X className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span>1 number</span>
                </div>
                <div className={`flex items-center gap-1.5 sm:col-span-2 ${passwordValidation.rules.hasSpecial ? 'text-green-600 dark:text-green-400 font-medium' : ''}`}>
                  {passwordValidation.rules.hasSpecial ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <X className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span>1 special character</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-2 shadow-xs"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
