import { apiRequest } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export const authService = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  me: (token: string) => apiRequest<{ user: User }>('/auth/me', { token }),

  logout: (token: string) => apiRequest<void>('/auth/logout', { method: 'POST', token }),
};
