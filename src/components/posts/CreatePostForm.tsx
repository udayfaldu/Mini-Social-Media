import { useState, type FormEvent, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import type { CreatePostFormData, CreatePostInput } from '../../types';
import { validatePostTitle, validatePostBody, validateTags } from '../../utils/validators';

interface CreatePostFormProps {
  onSubmit: (data: CreatePostInput) => Promise<void>;
  userId: number;
  isLoading?: boolean;
}

const MAX_BODY_CHARS = 500;

export function CreatePostForm({
  onSubmit,
  userId,
  isLoading = false,
}: CreatePostFormProps) {
  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    body: '',
    tags: 'tech, coding',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const titleValidation = validatePostTitle(formData.title);
  const bodyValidation = validatePostBody(formData.body);
  const tagsValidation = validateTags(formData.tags);

  const charCount = formData.body.length;
  const charsRemaining = MAX_BODY_CHARS - charCount;
  const isOverLimit = charsRemaining < 0;

  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, charCount / MAX_BODY_CHARS);
  const strokeDashoffset = circumference - progressRatio * circumference;

  let progressColor = 'stroke-blue-600 dark:stroke-blue-400';
  let counterTextColor = 'text-gray-500';

  if (isOverLimit) {
    progressColor = 'stroke-red-600';
    counterTextColor = 'text-red-600 font-bold';
  } else if (charsRemaining <= 50) {
    progressColor = 'stroke-amber-500';
    counterTextColor = 'text-amber-500 font-semibold';
  }

  const isFormValid =
    titleValidation.isValid && bodyValidation.isValid && tagsValidation.isValid && !isOverLimit;


  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      title: true,
      body: true,
      tags: true,
    });

    if (!isFormValid || isLoading) {
      return;
    }

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.replace(/^#/, '').trim())
      .filter((t) => t.length > 0);

    const postPayload: CreatePostInput = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      userId,
      tags: parsedTags.length > 0 ? parsedTags : ['general'],
    };

    try {
      await onSubmit(postPayload);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit post.';
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 space-y-4 shadow-sm"
    >

      <div>
        <label
          htmlFor="title"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
        >
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          onBlur={() => handleBlur('title')}
          placeholder="Enter post title"
          className={`w-full px-3 py-2 rounded-md border text-sm bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition ${
            touched.title && !titleValidation.isValid
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
          }`}
          disabled={isLoading}
        />
        {touched.title && !titleValidation.isValid && (
          <p className="mt-1 text-xs text-red-500">{titleValidation.error}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="body"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            Content *
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] ${counterTextColor}`}>
              {charsRemaining <= 100 ? `${charsRemaining} left` : `${charCount}/${MAX_BODY_CHARS}`}
            </span>
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r={radius}
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r={radius}
                  className={`${progressColor} transition-all duration-150`}
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
        <textarea
          id="body"
          name="body"
          rows={5}
          value={formData.body}
          onChange={handleChange}
          onBlur={() => handleBlur('body')}
          placeholder="Write your post content..."
          className={`w-full px-3 py-2 rounded-md border text-sm bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition resize-y ${
            (touched.body && !bodyValidation.isValid) || isOverLimit
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
          }`}
          disabled={isLoading}
        />
        {touched.body && !bodyValidation.isValid && (
          <p className="mt-1 text-xs text-red-500">{bodyValidation.error}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
        >
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          onBlur={() => handleBlur('tags')}
          placeholder="e.g. tech, coding, react"
          className={`w-full px-3 py-2 rounded-md border text-sm bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition ${
            touched.tags && !tagsValidation.isValid
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
          }`}
          disabled={isLoading}
        />
        {touched.tags && !tagsValidation.isValid && (
          <p className="mt-1 text-xs text-red-500">{tagsValidation.error}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading || !isFormValid || isOverLimit}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
        >
          {isLoading && (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{isLoading ? 'Publishing...' : 'Publish Post'}</span>
        </button>
      </div>
    </form>
  );
}
