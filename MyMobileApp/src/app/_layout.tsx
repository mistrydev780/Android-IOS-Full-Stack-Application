import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import '@/global.css';
import { Logo } from '@/components/brand/logo';
import { webHeaderBack } from '@/components/navigation/header-back';
import { AppError } from '@/components/ui/app-error';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { ProductsProvider } from '@/context/products-context';
import { ShopProvider } from '@/context/shop-context';
import { colors } from '@/theme';

// Friendly fallback when any screen throws
export const ErrorBoundary = AppError;

// Keep the native splash visible until the saved session is restored
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { status, user } = useAuth();
  const isSignedIn = status === 'signedIn';
  const isAdmin = isSignedIn && user?.role === 'admin';
  const isMember = isSignedIn && !isAdmin;

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hide();
  }, [status]);

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <Logo size={48} />
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <ProductsProvider>
      {/* Fresh cart & wishlist per signed-in user */}
      <ShopProvider key={user?.id ?? 'guest'}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          {/* Signed out */}
          <Stack.Protected guard={!isSignedIn}>
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
          </Stack.Protected>

          {/* Customers: the store */}
          <Stack.Protected guard={isMember}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="checkout" options={{ headerShown: true, title: 'Checkout', ...webHeaderBack('/cart') }} />
            <Stack.Screen name="orders" options={{ headerShown: true, title: 'My Orders', ...webHeaderBack('/profile') }} />
            <Stack.Screen name="orders/[id]" options={{ headerShown: true, title: 'Order Details', ...webHeaderBack('/orders') }} />
            <Stack.Screen name="account" options={{ headerShown: true, title: 'My Account', ...webHeaderBack('/profile') }} />
            <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings', ...webHeaderBack('/profile') }} />
            <Stack.Screen name="help" options={{ headerShown: true, title: 'Help & Support', ...webHeaderBack('/profile') }} />
          </Stack.Protected>

          {/* Admins: the dashboard */}
          <Stack.Protected guard={isAdmin}>
            <Stack.Screen name="admin" />
          </Stack.Protected>
        </Stack>
      </ShopProvider>
    </ProductsProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    backgroundColor: colors.background,
  },
});
