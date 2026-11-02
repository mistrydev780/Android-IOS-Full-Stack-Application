import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OrderCard } from '@/components/shop/order-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { useApiData } from '@/hooks/use-api-data';
import { orderService } from '@/services/shop.service';
import { spacing } from '@/theme';

export default function MyOrdersScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const { data, loading, error, refreshing, refresh } = useApiData(
    () => orderService.mine(token!),
    [token],
  );
  const orders = data?.orders ?? [];

  return (
    <Screen edges={['bottom']} refreshing={refreshing} onRefresh={refresh} contentStyle={styles.content}>
      {loading || (error && !data) ? (
        <LoadState loading={loading} error={error} onRetry={refresh} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="orders"
          title="No orders yet"
          message="When you place an order it will show up here so you can track it."
          actionLabel="Start shopping"
          onAction={() => router.replace('/search')}
        />
      ) : (
        <View style={styles.list}>
          {orders.map((order, index) => (
            <FadeIn key={order.id} index={index}>
              <OrderCard
                order={order}
                onPress={() => router.push({ pathname: '/orders/[id]', params: { id: order.id } })}
              />
            </FadeIn>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    maxWidth: 820,
    paddingTop: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
});
