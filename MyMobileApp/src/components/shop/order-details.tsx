import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { paymentLabels, statusLabels } from '@/data/products';
import { colors, radius, spacing, typography } from '@/theme';
import type { Order, OrderStatus } from '@/types/shop';
import { formatDate, formatPrice } from '@/utils/format';

import { OrderStatusBadge } from './order-status-badge';
import { ProductImage } from './product-image';

const progressSteps: { status: OrderStatus; icon: IconName }[] = [
  { status: 'pending', icon: 'calendar' },
  { status: 'confirmed', icon: 'check' },
  { status: 'shipped', icon: 'truck' },
  { status: 'delivered', icon: 'store' },
];

// Full order view shared by the customer and admin screens
export function OrderDetails({ order, showCustomer = false }: { order: Order; showCustomer?: boolean }) {
  return (
    <View style={styles.stack}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.number}>#{order.orderNumber}</Text>
            <Text style={styles.muted}>Placed {formatDate(order.createdAt, true)}</Text>
          </View>
          <OrderStatusBadge status={order.status} />
        </View>
        <StatusTracker status={order.status} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
        </Text>
        {order.items.map((item, index) => (
          <View key={item.productId + index} style={[styles.item, index > 0 && styles.divider]}>
            <ProductImage uri={item.image} style={styles.itemImage} />
            <View style={styles.flex}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.muted}>
                {item.quantity} × {formatPrice(item.price)}
              </Text>
            </View>
            <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      {showCustomer && order.customer ? (
        <InfoCard icon="person" title="Customer">
          <Text style={styles.body}>{order.customer.name}</Text>
          <Text style={styles.muted}>{order.customer.email}</Text>
        </InfoCard>
      ) : null}

      <InfoCard icon="location" title="Delivery address">
        <Text style={styles.body}>{order.shippingAddress.fullName}</Text>
        <Text style={styles.muted}>
          {order.shippingAddress.line}, {order.shippingAddress.city} – {order.shippingAddress.pincode}
        </Text>
        <Text style={styles.muted}>Phone: {order.shippingAddress.phone}</Text>
      </InfoCard>

      <InfoCard icon="card" title="Payment">
        <Row label="Method" value={paymentLabels[order.paymentMethod]} />
        <Row label="Subtotal" value={formatPrice(order.subtotal)} />
        <Row label="Delivery" value={order.deliveryFee ? formatPrice(order.deliveryFee) : 'FREE'} />
        <View style={styles.divider} />
        <Row label="Total" value={formatPrice(order.total)} strong />
      </InfoCard>
    </View>
  );
}

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <View style={styles.cancelled}>
        <Icon name="close" size={16} color={colors.danger} />
        <Text style={styles.cancelledText}>This order was cancelled. Any items were returned to stock.</Text>
      </View>
    );
  }

  const current = progressSteps.findIndex((step) => step.status === status);

  return (
    <View style={styles.tracker} accessibilityLabel={`Order status: ${statusLabels[status]}`}>
      {progressSteps.map((step, index) => {
        const done = index <= current;
        return (
          <View key={step.status} style={styles.step}>
            <View style={styles.stepTop}>
              <View style={[styles.line, index === 0 && styles.hidden, index <= current && styles.lineDone]} />
              <View style={[styles.dot, done && styles.dotDone]}>
                <Icon name={step.icon} size={14} color={done ? colors.textInverse : colors.textMuted} />
              </View>
              <View
                style={[
                  styles.line,
                  index === progressSteps.length - 1 && styles.hidden,
                  index < current && styles.lineDone,
                ]}
              />
            </View>
            <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{statusLabels[step.status]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function InfoCard({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoTitle}>
        <Icon name={icon} size={18} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.infoBody}>{children}</View>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={strong ? styles.strong : styles.muted}>{label}</Text>
      <Text style={strong ? styles.strong : styles.body}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  number: {
    ...typography.h2,
    color: colors.text,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  muted: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  strong: {
    ...typography.h3,
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  itemBrand: {
    ...typography.overline,
    color: colors.textMuted,
  },
  itemName: {
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.text,
  },
  itemTotal: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  infoTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoBody: {
    gap: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  tracker: {
    flexDirection: 'row',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  line: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
  },
  lineDone: {
    backgroundColor: colors.ink,
  },
  hidden: {
    opacity: 0,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.ink,
  },
  stepLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  stepLabelDone: {
    color: colors.text,
    fontWeight: '700',
  },
  cancelled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  cancelledText: {
    flex: 1,
    ...typography.caption,
    color: colors.danger,
  },
});
