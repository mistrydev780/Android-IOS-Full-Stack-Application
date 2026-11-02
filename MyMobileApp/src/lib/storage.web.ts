// Web: SecureStore is not available, so fall back to localStorage.
// `typeof window` guards against static (server) rendering.
const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const storage = {
  get: async (key: string) => (hasStorage() ? window.localStorage.getItem(key) : null),
  set: async (key: string, value: string) => {
    if (hasStorage()) window.localStorage.setItem(key, value);
  },
  remove: async (key: string) => {
    if (hasStorage()) window.localStorage.removeItem(key);
  },
};
