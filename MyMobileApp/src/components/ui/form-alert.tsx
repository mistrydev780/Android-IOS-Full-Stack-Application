import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { Icon } from './icon';

export function FormAlert({ message }: { message: string }) {
  if (!message) return null;

  return (
    <View style={styles.alert} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Icon name="info" size={18} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  text: {
    flex: 1,
    ...typography.caption,
    color: colors.danger,
  },
});
