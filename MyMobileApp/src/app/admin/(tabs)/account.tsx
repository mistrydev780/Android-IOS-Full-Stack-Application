import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { MenuGroup, MenuItem } from '@/components/ui/menu-item';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/services/api';
import { colors, radius, spacing, typography } from '@/theme';
import { confirm } from '@/utils/confirm';
import { initials } from '@/utils/format';

export default function AdminAccountScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (await confirm('Sign out', 'Sign out of the admin panel?', 'Sign out')) {
      await signOut();
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        Account
      </Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user?.name ?? '')}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>Administrator</Text>
          </View>
        </View>
      </View>

      <MenuGroup title="MANAGE">
        <MenuItem icon="orders" label="Orders" onPress={() => router.push('/admin/orders')} />
        <MenuItem icon="store" label="Products" onPress={() => router.push('/admin/products')} />
        <MenuItem icon="plus" label="Add a product" onPress={() => router.push('/admin/product-form')} />
      </MenuGroup>

      {__DEV__ ? (
        <MenuGroup title="DEVELOPER">
          <MenuItem icon="globe" label="API server" description={API_URL} />
        </MenuGroup>
      ) : null}

      <MenuGroup>
        <MenuItem icon="logout" label="Sign out" danger onPress={handleSignOut} />
      </MenuGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    maxWidth: 720,
  },
  flex: {
    flex: 1,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    paddingTop: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.ink,
  },
  name: {
    ...typography.h2,
    color: colors.textInverse,
  },
  email: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  rolePill: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  roleText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
