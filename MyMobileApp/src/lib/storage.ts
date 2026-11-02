import * as SecureStore from 'expo-secure-store';

// Native (iOS/Android): values are encrypted in the Keychain / Keystore
export const storage = {
  get: (key: string) => SecureStore.getItemAsync(key),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
};
