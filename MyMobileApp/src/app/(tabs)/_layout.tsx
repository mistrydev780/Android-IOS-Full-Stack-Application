import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { PromoCard } from '@/components/navigation/promo-card';
import { SideNav } from '@/components/navigation/side-nav';
import { Icon, type IconName } from '@/components/ui/icon';
import { useShop } from '@/context/shop-context';
import { useResponsive } from '@/hooks/use-responsive';
import { colors } from '@/theme';

const tabIcon =
  (name: IconName, focusedName: IconName) =>
  ({ focused, color }: { focused: boolean; color: ColorValue }) => (
    <Icon name={focused ? focusedName : name} size={24} color={color} />
  );

export default function TabLayout() {
  const { cartCount, wishlist } = useShop();
  const { isDesktop } = useResponsive();

  return (
    <Tabs
      // Premium sidebar on desktop web, bottom tabs on phones/tablets
      tabBar={isDesktop ? (props) => <SideNav {...props} promo={<PromoCard />} /> : undefined}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isDesktop ? 'left' : 'bottom',
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderRightColor: colors.border,
        },
        tabBarBadgeStyle: {
          backgroundColor: colors.accent,
          color: colors.textInverse,
          fontSize: 10,
          fontWeight: '700',
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home', 'homeFill') }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: tabIcon('search', 'search') }} />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: tabIcon('heart', 'heartFill'),
          tabBarBadge: wishlist.length > 0 ? wishlist.length : undefined,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: tabIcon('bag', 'bagFill'),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'personFill') }} />
    </Tabs>
  );
}
