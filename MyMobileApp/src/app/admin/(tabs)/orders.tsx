import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryChip } from '@/components/shop/category-chip';
import { OrderCard } from '@/components/shop/order-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { statusLabels } from '@/data/products';
import { useApiData } from '@/hooks/use-api-data';
import { orderService } from '@/services/shop.service';
import { colors, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/shop';

const filters: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams<{ status?: string }>();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  // Status chosen from the dashboard
  useEffect(() => {
    const fromParams = filters.find((f) => f === params.status);
    setFilter(fromParams ?? 'all');
  }, [params.status]);

  const { data, loading, error, refreshing, refresh } = useApiData(
    () => orderService.listAll(token!, filter === 'all' ? undefined : filter),
    [token, filter],
  );
  const orders = data?.orders ?? [];

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Text style={styles.title} accessibilityRole="header">
        Orders
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={styles.filtersScroll}>
        {filters.map((status) => (
          <CategoryChip
            key={status}
            label={status === 'all' ? 'All' : statusLabels[status]}
            selected={filter === status}
            onPress={() => setFilter(status)}
          />
        ))}
      </ScrollView>

      {loading || (error && !data) ? (
        <LoadState loading={loading} error={error} onRetry={refresh} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="orders"
          title="No orders here"
          message={filter === 'all' ? 'Orders will appear here as customers check out.' : `No ${statusLabels[filter as OrderStatus].toLowerCase()} orders.`}
        />
      ) : (
        <View style={styles.list}>
          <Text style={styles.count}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </Text>
          {orders.map((order, index) => (
            <FadeIn key={order.id} index={index}>
              <OrderCard
                order={order}
                showCustomer
                onPress={() => router.push({ pathname: '/admin/order/[id]', params: { id: order.id } })}
              />
            </FadeIn>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.text,
    paddingTop: spacing.md,
  },
  filtersScroll: {
    marginVertical: spacing.md,
  },
  filters: {
    gap: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
