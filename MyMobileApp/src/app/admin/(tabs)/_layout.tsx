import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { SideNav } from '@/components/navigation/side-nav';
import { Icon, type IconName } from '@/components/ui/icon';
import { useResponsive } from '@/hooks/use-responsive';
import { colors } from '@/theme';

const tabIcon =
  (name: IconName) =>
  ({ color }: { color: ColorValue }) => <Icon name={name} size={24} color={color} />;

export default function AdminTabLayout() {
  const { isDesktop } = useResponsive();

  return (
    <Tabs
      tabBar={isDesktop ? (props) => <SideNav {...props} tag="Admin" /> : undefined}
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
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: tabIcon('grid') }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: tabIcon('orders') }} />
      <Tabs.Screen name="products" options={{ title: 'Products', tabBarIcon: tabIcon('store') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}
