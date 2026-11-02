import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 5050;
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Resolves the backend URL:
 * 1. EXPO_PUBLIC_API_URL from MyMobileApp/.env (use this for production / tunnels)
 * 2. Web: same host the page was opened from
 * 3. Phone / emulator: the IP of the computer running Metro (from Expo's hostUri)
 */
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:${API_PORT}/api/v1`;
  }

  const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (devHost) return `http://${devHost}:${API_PORT}/api/v1`;

  // Android emulator reaches the host machine via 10.0.2.2
  return Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}/api/v1`
    : `http://localhost:${API_PORT}/api/v1`;
}

export const API_URL = resolveApiUrl();

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: FieldError[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  // Server-side validation message for one form field, if any
  fieldError(field: string): string | undefined {
    return this.errors.find((error) => error.field === field)?.message;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FieldError[];
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      `Can't reach the server. Make sure the backend is running and your device is on the same Wi-Fi.`,
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  // The server is reachable but doesn't know this endpoint: it's an old build
  if (response.status === 404 && payload?.message?.startsWith('Route not found')) {
    throw new ApiError(
      'The backend is running an older version. Stop it and start it again with "npm run dev" in the backend folder.',
      404,
    );
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message ?? `Request failed (${response.status})`,
      response.status,
      payload?.errors,
    );
  }

  return payload.data as T;
}
