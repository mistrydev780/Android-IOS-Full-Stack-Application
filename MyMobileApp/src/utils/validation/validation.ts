
// Mirrors the backend rules in backend/src/validators/auth.validator.ts

export const validateName = (name: string) => {
  if (name.trim().length < 2) {
    return 'Name must have at least 2 characters';
  }

  return '';
};

export const validateEmail = (email: string) => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return 'Enter a valid email';
  }

  return '';
};

export const validatePassword = (password: string) => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Minimum 8 characters required';
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Use at least one letter and one number';
  }

  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return '';
};
