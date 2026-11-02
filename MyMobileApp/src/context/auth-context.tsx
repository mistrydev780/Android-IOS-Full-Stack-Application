import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { storage } from '@/lib/storage';
import { ApiError } from '@/services/api';
import { authService, type AuthResponse, type User } from '@/services/auth.service';

const TOKEN_KEY = 'dev-ecommerce.token';
const USER_KEY = 'dev-ecommerce.user';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type AuthState = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
};

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const signedOut: AuthState = { status: 'signedOut', user: null, token: null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null, token: null });

  // Restore the session on app start
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const [token, cachedUser] = await Promise.all([storage.get(TOKEN_KEY), storage.get(USER_KEY)]);

      if (!token) {
        if (!cancelled) setState(signedOut);
        return;
      }

      try {
        const { user } = await authService.me(token);
        await storage.set(USER_KEY, JSON.stringify(user));
        if (!cancelled) setState({ status: 'signedIn', user, token });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          // Token expired or account removed
          await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]);
          if (!cancelled) setState(signedOut);
        } else if (cachedUser) {
          // Offline / server down: keep the user signed in with cached profile
          if (!cancelled) setState({ status: 'signedIn', user: JSON.parse(cachedUser), token });
        } else if (!cancelled) {
          setState(signedOut);
        }
      }
    }

    void restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = async ({ user, token }: AuthResponse) => {
    await Promise.all([storage.set(TOKEN_KEY, token), storage.set(USER_KEY, JSON.stringify(user))]);
    setState({ status: 'signedIn', user, token });
  };

  const value: AuthContextValue = {
    ...state,

    signIn: async (email, password) => {
      await startSession(await authService.login(email.trim(), password));
    },

    signUp: async (name, email, password) => {
      await startSession(await authService.register(name.trim(), email.trim(), password));
    },

    signOut: async () => {
      const { token } = state;
      await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]);
      setState(signedOut);
      // Best effort: the session is already cleared locally
      if (token) authService.logout(token).catch(() => {});
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
