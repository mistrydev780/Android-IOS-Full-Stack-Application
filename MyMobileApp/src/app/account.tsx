import { StyleSheet, Text, View } from 'react-native';

import { MenuGroup, MenuItem } from '@/components/ui/menu-item';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { colors, radius, spacing, typography } from '@/theme';
import { initials } from '@/utils/format';

export default function AccountScreen() {
  const { user } = useAuth();

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Screen edges={['bottom']} contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user.name)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{user.role === 'admin' ? 'Administrator' : 'Customer'}</Text>
        </View>
      </View>

      <MenuGroup title="PERSONAL DETAILS">
        <MenuItem icon="person" label="Full name" description={user.name} />
        <MenuItem icon="mail" label="Email address" description={user.email} />
        <MenuItem icon="calendar" label="Member since" description={memberSince} />
      </MenuGroup>

      <MenuGroup title="SECURITY">
        <MenuItem icon="shield" label="Password" description="Encrypted and stored securely" />
        <MenuItem icon="lock" label="Session" description="Signed in on this device" />
      </MenuGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    maxWidth: 720,
    paddingTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    ...typography.h1,
    color: colors.textInverse,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  rolePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  roleText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
});
