import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { formatPrice } from '@/utils/format';

export const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 99;

export function getOrderTotals(subtotal: number) {
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return { delivery, total: subtotal + delivery };
}

type OrderSummaryProps = {
  subtotal: number;
  savings: number;
  itemCount: number;
};

export function OrderSummary({ subtotal, savings, itemCount }: OrderSummaryProps) {
  const { delivery, total } = getOrderTotals(subtotal);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order summary</Text>

      <Row label={`Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`} value={formatPrice(subtotal)} />
      {savings > 0 ? <Row label="You save" value={`− ${formatPrice(savings)}`} highlight /> : null}
      <Row label="Delivery" value={delivery === 0 ? 'FREE' : formatPrice(delivery)} highlight={delivery === 0} />

      {delivery > 0 ? (
        <Text style={styles.hint}>
          Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
        </Text>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>
      <Text style={styles.tax}>Inclusive of all taxes</Text>
    </View>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.valueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  valueHighlight: {
    color: colors.success,
  },
  hint: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    padding: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xxs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.h3,
    color: colors.text,
  },
  totalValue: {
    ...typography.h2,
    color: colors.text,
  },
  tax: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
