import { useRouter, type Href } from 'expo-router';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors, radius } from '@/theme';

/**
 * Header back button for web, where a page opened by URL or refreshed has no
 * history (the native header then shows no back button at all).
 * Goes back when possible, otherwise to the given parent screen.
 */
export function HeaderBack({ fallback }: { fallback: Href }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name="back" size={20} color={colors.text} />
    </Pressable>
  );
}

// Only override the native back button on web
export const webHeaderBack = (fallback: Href) =>
  Platform.OS === 'web' ? { headerLeft: () => <HeaderBack fallback={fallback} /> } : {};

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
