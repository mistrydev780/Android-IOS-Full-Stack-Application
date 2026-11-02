import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing, typography } from '@/theme';

// Compact sale card for the desktop sidebar
export function PromoCard() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.orb} />
      <View style={styles.tag}>
        <Icon name="bolt" size={12} color={colors.accent} />
        <Text style={styles.tagText}>LIMITED TIME</Text>
      </View>
      <Text style={styles.title}>Up to 40% off premium audio</Text>
      <Pressable
        onPress={() => router.push({ pathname: '/search', params: { category: 'audio' } })}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Shop the sale</Text>
        <Icon name="forward" size={14} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    overflow: 'hidden',
    gap: spacing.xs,
  },
  orb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: radius.pill,
    right: -50,
    top: -60,
    backgroundColor: colors.primary,
    opacity: 0.5,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    ...typography.overline,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  title: {
    ...typography.h3,
    color: colors.textInverse,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.textInverse,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.ink,
  },
});
