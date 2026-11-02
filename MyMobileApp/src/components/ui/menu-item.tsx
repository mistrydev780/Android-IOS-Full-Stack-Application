import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { Icon, type IconName } from './icon';

type MenuItemProps = {
  icon: IconName;
  label: string;
  description?: string;
  onPress?: () => void;
  danger?: boolean;
  // Replaces the chevron (e.g. a Switch or a value)
  right?: ReactNode;
};

export function MenuItem({ icon, label, description, onPress, danger, right }: MenuItemProps) {
  const tint = danger ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, danger && styles.iconDanger]}>
        <Icon name={icon} size={20} color={tint} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, { color: tint }]}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {right ?? (onPress && !danger ? <Icon name="chevronRight" size={18} color={colors.textMuted} /> : null)}
    </Pressable>
  );
}

// Groups menu items into a rounded card with dividers
export function MenuGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={styles.group}>
      {title ? <Text style={styles.groupTitle}>{title}</Text> : null}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 60,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDanger: {
    backgroundColor: colors.dangerSoft,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.bodyStrong,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  group: {
    gap: spacing.xs,
  },
  groupTitle: {
    ...typography.overline,
    color: colors.textMuted,
    marginLeft: spacing.xxs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
