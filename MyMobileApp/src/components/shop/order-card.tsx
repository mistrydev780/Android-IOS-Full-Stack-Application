import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing, typography } from '@/theme';
import type { Order } from '@/types/shop';
import { formatDate, formatPrice } from '@/utils/format';

import { OrderStatusBadge } from './order-status-badge';
import { ProductImage } from './product-image';

type OrderCardProps = {
  order: Order;
  onPress: () => void;
  // Admin view shows who placed the order
  showCustomer?: boolean;
};

export function OrderCard({ order, onPress, showCustomer = false }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const previews = order.items.slice(0, 3);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.orderNumber}, ${order.status}, ${formatPrice(order.total)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.number}>#{order.orderNumber}</Text>
          <Text style={styles.meta}>
            {formatDate(order.createdAt, true)}
            {showCustomer && order.customer ? ` · ${order.customer.name}` : ''}
          </Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <View style={styles.body}>
        <View style={styles.thumbs}>
          {previews.map((item, index) => (
            <ProductImage
              key={item.productId + index}
              uri={item.image}
              style={[styles.thumb, index > 0 && styles.thumbOverlap]}
            />
          ))}
        </View>
        <View style={styles.flex}>
          <Text style={styles.items} numberOfLines={1}>
            {order.items[0]?.name}
            {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
          </Text>
          <Text style={styles.meta}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
        <Icon name="chevronRight" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  number: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  thumbs: {
    flexDirection: 'row',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  thumbOverlap: {
    marginLeft: -14,
  },
  items: {
    ...typography.body,
    fontSize: 14,
    color: colors.text,
  },
  total: {
    ...typography.bodyStrong,
    color: colors.text,
  },
});
