import { Stack } from 'expo-router';

import { webHeaderBack } from '@/components/navigation/header-back';
import { colors } from '@/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="order/[id]" options={{ title: 'Manage Order', ...webHeaderBack('/admin/orders') }} />
      <Stack.Screen name="product-form" options={{ title: 'Product', ...webHeaderBack('/admin/products') }} />
    </Stack>
  );
}
