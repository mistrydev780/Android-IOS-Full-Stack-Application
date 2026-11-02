import type { Tabs } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/context/auth-context';
import { colors, radius, spacing, typography } from '@/theme';
import { confirm } from '@/utils/confirm';
import { initials } from '@/utils/format';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

type SideNavProps = TabBarProps & {
  // Small label next to the logo, e.g. "Admin"
  tag?: string;
  // Optional card shown below the navigation
  promo?: ReactNode;
};

type PressState = { pressed: boolean; hovered?: boolean };

export const SIDE_NAV_WIDTH = 272;

// Desktop sidebar used in place of the bottom tab bar on wide screens
export function SideNav({ state, descriptors, emitter, navigateToTab, insets, tag, promo }: SideNavProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (await confirm('Sign out', 'Are you sure you want to sign out?', 'Sign out')) {
      await signOut();
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.brand}>
        <Logo size={34} />
        {tag ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.navContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>MENU</Text>

        <View role="tablist" style={styles.items}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const focused = index === state.index;
            const label = typeof options.title === 'string' ? options.title : route.name;
            const badge = options.tabBarBadge;
            const tint = focused ? colors.textInverse : colors.textSecondary;

            const onPress = () => {
              const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigateToTab(route.key);
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                role="tab"
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                style={(state) => {
                  const { pressed, hovered } = state as PressState;
                  return [
                    styles.item,
                    hovered && !focused && styles.itemHovered,
                    pressed && !focused && styles.itemPressed,
                    focused && styles.itemActive,
                  ];
                }}
              >
                {options.tabBarIcon?.({ focused, color: tint, size: 22 })}
                <Text style={[styles.itemLabel, focused && styles.itemLabelActive]}>{label}</Text>
                {badge !== undefined ? (
                  <View style={[styles.badge, focused && styles.badgeActive]}>
                    <Text style={[styles.badgeText, focused && styles.badgeTextActive]}>{badge}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {promo ? <View style={styles.promo}>{promo}</View> : null}
      </ScrollView>

      {user ? (
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.name)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            hitSlop={8}
            style={(state) => {
              const { pressed, hovered } = state as PressState;
              return [styles.signOut, (hovered || pressed) && styles.signOutActive];
            }}
          >
            <Icon name="logout" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: SIDE_NAV_WIDTH,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    gap: spacing.lg,
  },
  flex: {
    flex: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  tagText: {
    ...typography.overline,
    fontSize: 10,
    color: colors.primary,
  },
  navContent: {
    gap: spacing.xs,
  },
  section: {
    ...typography.overline,
    color: colors.textMuted,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xxs,
  },
  items: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  itemHovered: {
    backgroundColor: colors.surfaceMuted,
  },
  itemPressed: {
    backgroundColor: colors.border,
  },
  itemActive: {
    backgroundColor: colors.ink,
    boxShadow: '0px 3px 10px rgba(14, 14, 22, 0.14)',
  },
  itemLabel: {
    flex: 1,
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemLabelActive: {
    color: colors.textInverse,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: colors.textInverse,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '800',
    color: colors.textInverse,
  },
  badgeTextActive: {
    color: colors.ink,
  },
  promo: {
    marginTop: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textInverse,
  },
  userName: {
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.text,
  },
  userEmail: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
  },
  signOut: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutActive: {
    backgroundColor: colors.dangerSoft,
  },
});
