import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SalesChart } from '@/components/admin/sales-chart';
import { StatTile } from '@/components/admin/stat-tile';
import { OrderCard } from '@/components/shop/order-card';
import { OrderStatusBadge } from '@/components/shop/order-status-badge';
import { ProductImage } from '@/components/shop/product-image';
import { SectionHeader } from '@/components/shop/section-header';
import { FadeIn } from '@/components/ui/fade-in';
import { Icon } from '@/components/ui/icon';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { useApiData } from '@/hooks/use-api-data';
import { useResponsive } from '@/hooks/use-responsive';
import { adminService } from '@/services/shop.service';
import { colors, radius, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/shop';
import { formatCompactPrice } from '@/utils/format';

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { isTablet } = useResponsive();

  const { data, loading, error, refreshing, refresh } = useApiData(() => adminService.stats(token!), [token]);

  const openOrders = (status?: OrderStatus) =>
    router.push({ pathname: '/admin/orders', params: status ? { status } : {} });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.overline}>ADMIN</Text>
        <Text style={styles.title}>Hello, {user?.name.split(' ')[0]}</Text>
        <Text style={styles.subtitle}>Here's how your store is doing.</Text>
      </View>

      {!data ? (
        <LoadState loading={loading} error={error} onRetry={refresh} />
      ) : (
        <>
          <View style={styles.tiles}>
            <FadeIn index={0} style={styles.tile}>
              <StatTile label="Revenue" value={formatCompactPrice(data.totals.revenue)} icon="rupee" hint="Excludes cancelled" />
            </FadeIn>
            <FadeIn index={1} style={styles.tile}>
              <StatTile label="Orders" value={String(data.totals.orders)} icon="orders" hint={`${data.ordersByStatus.pending} pending`} />
            </FadeIn>
            <FadeIn index={2} style={styles.tile}>
              <StatTile label="Customers" value={String(data.totals.customers)} icon="users" />
            </FadeIn>
            <FadeIn index={3} style={styles.tile}>
              <StatTile label="Products" value={String(data.totals.products)} icon="store" hint={`${data.lowStock.length} low on stock`} />
            </FadeIn>
          </View>

          <View style={[styles.columns, isTablet && styles.columnsWide]}>
            <View style={[styles.column, isTablet && styles.flex]}>
              <SalesChart sales={data.sales} />

              <View>
                <SectionHeader title="Orders by status" actionLabel="View all" onAction={() => openOrders()} />
                <View style={styles.statusGrid}>
                  {statusOrder.map((status) => (
                    <Pressable
                      key={status}
                      onPress={() => openOrders(status)}
                      accessibilityRole="button"
                      style={({ pressed }) => [styles.statusCell, pressed && styles.pressed]}
                    >
                      <Text style={styles.statusCount}>{data.ordersByStatus[status]}</Text>
                      <OrderStatusBadge status={status} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={[styles.column, isTablet && styles.flex]}>
              <View>
                <SectionHeader title="Low stock" actionLabel="Manage" onAction={() => router.push('/admin/products')} />
                {data.lowStock.length === 0 ? (
                  <Text style={styles.muted}>All products are well stocked.</Text>
                ) : (
                  <View style={styles.listCard}>
                    {data.lowStock.map((product, index) => (
                      <Pressable
                        key={product.id}
                        onPress={() => router.push({ pathname: '/admin/product-form', params: { id: product.id } })}
                        accessibilityRole="button"
                        style={[styles.stockRow, index > 0 && styles.divider]}
                      >
                        <ProductImage uri={product.image} style={styles.stockImage} />
                        <Text style={[styles.flex, styles.stockName]} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <View style={[styles.stockPill, product.stock === 0 && styles.stockPillOut]}>
                          <Icon name="warning" size={12} color={product.stock === 0 ? colors.danger : colors.warning} />
                          <Text style={[styles.stockText, product.stock === 0 && styles.stockTextOut]}>
                            {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View>
                <SectionHeader title="Recent orders" actionLabel="View all" onAction={() => openOrders()} />
                <View style={styles.list}>
                  {data.recentOrders.length === 0 ? (
                    <Text style={styles.muted}>No orders yet.</Text>
                  ) : (
                    data.recentOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        showCustomer
                        onPress={() => router.push({ pathname: '/admin/order/[id]', params: { id: order.id } })}
                      />
                    ))
                  )}
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.md,
    gap: 2,
  },
  overline: {
    ...typography.overline,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    flexGrow: 1,
    flexBasis: 150,
  },
  columns: {
    gap: spacing.xl,
  },
  columnsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    gap: spacing.xl,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusCell: {
    flexGrow: 1,
    // 3 + 2 layout on wide screens, 2 per row on phones
    flexBasis: '30%',
    minWidth: 110,
    padding: spacing.md,
    gap: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  statusCount: {
    ...typography.h2,
    color: colors.text,
  },
  muted: {
    ...typography.body,
    color: colors.textSecondary,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stockImage: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
  },
  stockName: {
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.text,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.warningSoft,
  },
  stockPillOut: {
    backgroundColor: colors.dangerSoft,
  },
  stockText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
  stockTextOut: {
    color: colors.danger,
  },
  list: {
    gap: spacing.sm,
  },
});
