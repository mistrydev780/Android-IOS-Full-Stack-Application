import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { MenuGroup, MenuItem } from '@/components/ui/menu-item';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { useShop } from '@/context/shop-context';
import { useApiData } from '@/hooks/use-api-data';
import { orderService } from '@/services/shop.service';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { confirm } from '@/utils/confirm';
import { initials } from '@/utils/format';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, token, signOut } = useAuth();
  const { cartCount, wishlist } = useShop();
  const { data: ordersData } = useApiData(() => orderService.mine(token!), [token]);

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '';

  const handleSignOut = async () => {
    if (await confirm('Sign out', 'Are you sure you want to sign out?', 'Sign out')) {
      await signOut();
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        Profile
      </Text>

      {/* Profile card */}
      <View style={styles.card}>
        <View style={styles.orb} />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user?.name ?? '')}</Text>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.name} numberOfLines={1}>
            {user?.name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {user?.email}
          </Text>
          {memberSince ? (
            <View style={styles.memberPill}>
              <Icon name="sparkles" size={12} color={colors.textInverse} />
              <Text style={styles.memberText}>Member since {memberSince}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Stat label="In cart" value={cartCount} onPress={() => router.push('/cart')} />
        <Stat label="Wishlist" value={wishlist.length} onPress={() => router.push('/wishlist')} />
        <Stat label="Orders" value={ordersData?.orders.length ?? 0} onPress={() => router.push('/orders')} />
      </View>

      <MenuGroup title="ACCOUNT">
        <MenuItem icon="orders" label="My orders" description="Track, view and cancel orders" onPress={() => router.push('/orders')} />
        <MenuItem icon="person" label="My account" description="Personal details" onPress={() => router.push('/account')} />
        <MenuItem icon="heart" label="Wishlist" description="Your saved items" onPress={() => router.push('/wishlist')} />
        <MenuItem icon="bag" label="My cart" description="Review and checkout" onPress={() => router.push('/cart')} />
      </MenuGroup>

      <MenuGroup title="PREFERENCES">
        <MenuItem icon="settings" label="Settings" description="Notifications and app preferences" onPress={() => router.push('/settings')} />
        <MenuItem icon="help" label="Help & Support" description="FAQs and contact us" onPress={() => router.push('/help')} />
      </MenuGroup>

      <MenuGroup>
        <MenuItem icon="logout" label="Sign out" danger onPress={handleSignOut} />
      </MenuGroup>
    </Screen>
  );
}

function Stat({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      style={({ pressed }) => [styles.stat, pressed && styles.statPressed]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    maxWidth: 720,
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
    overflow: 'hidden',
    ...shadows.md,
  },
  orb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: radius.pill,
    right: -70,
    top: -90,
    backgroundColor: colors.primary,
    opacity: 0.45,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.ink,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.h2,
    color: colors.textInverse,
  },
  email: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  memberText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textInverse,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statPressed: {
    opacity: 0.6,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
