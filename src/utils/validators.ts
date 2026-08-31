export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateName(name: string, fieldLabel = 'Name'): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldLabel} is required.` };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldLabel} must be at least 2 characters.` };
  }
  if (trimmed.length > 30) {
    return { isValid: false, error: `${fieldLabel} must not exceed 30 characters.` };
  }
  const nameRegex = /^[A-Za-z]+([ A-Za-z'-][A-Za-z]+)*$/;
  if (!nameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldLabel} must contain only letters.`,
    };
  }
  return { isValid: true };
}

export function validateUsername(username: string): ValidationResult {
  const trimmed = username.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Username is required.' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters.' };
  }
  if (trimmed.length > 20) {
    return { isValid: false, error: 'Username must not exceed 20 characters.' };
  }
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  if (!usernameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, dots, and underscores.',
    };
  }
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address.',
    };
  }
  return { isValid: true };
}

export function validatePassword(password: string): {
  isValid: boolean;
  rules: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
  error?: string;
} {
  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
  };

  const isValid = Object.values(rules).every(Boolean);
  let error: string | undefined;

  if (!password) {
    error = 'Password is required.';
  } else if (!rules.minLength) {
    error = 'Password must be at least 8 characters long.';
  } else if (!rules.hasUpper) {
    error = 'Password must include at least 1 uppercase letter.';
  } else if (!rules.hasLower) {
    error = 'Password must include at least 1 lowercase letter.';
  } else if (!rules.hasNumber) {
    error = 'Password must include at least 1 number.';
  } else if (!rules.hasSpecial) {
    error = 'Password must include at least 1 special character.';
  }

  return { isValid, rules, error };
}

export function validatePostTitle(title: string): ValidationResult {
  const trimmed = title.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Post title is required.' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, error: 'Title must be at least 5 characters.' };
  }
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Title cannot exceed 100 characters.' };
  }
  return { isValid: true };
}

export function validatePostBody(body: string): ValidationResult {
  const trimmed = body.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Post content is required.' };
  }
  if (trimmed.length < 15) {
    return { isValid: false, error: 'Content must be at least 15 characters.' };
  }
  if (body.length > 500) {
    return { isValid: false, error: 'Content exceeds the maximum 500 characters limit.' };
  }
  return { isValid: true };
}

export function validateTags(tagsString: string): ValidationResult {
  const trimmed = tagsString.trim();
  if (!trimmed) {
    return { isValid: true };
  }

  const tags = trimmed
    .split(/[,\s]+/)
    .map((t) => t.replace(/^#/, '').trim())
    .filter((t) => t.length > 0);

  const tagRegex = /^[a-zA-Z0-9-]+$/;
  for (const tag of tags) {
    if (tag.length < 2) {
      return { isValid: false, error: `Tag "${tag}" must be at least 2 characters.` };
    }
    if (tag.length > 20) {
      return { isValid: false, error: `Tag "${tag}" cannot exceed 20 characters.` };
    }
    if (!tagRegex.test(tag)) {
      return {
        isValid: false,
        error: `Tag "${tag}" contains invalid characters.`,
      };
    }
  }

  return { isValid: true };
}

export function validateComment(comment: string): ValidationResult {
  const trimmed = comment.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Comment cannot be empty.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Comment must be at least 2 characters.' };
  }
  if (trimmed.length > 250) {
    return { isValid: false, error: 'Comment cannot exceed 250 characters.' };
  }
  return { isValid: true };
}
