import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { statusLabels } from '@/data/products';
import { colors, radius, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/shop';

const statusStyles: Record<OrderStatus, { fg: string; bg: string; icon: IconName }> = {
  pending: { fg: colors.warning, bg: colors.warningSoft, icon: 'calendar' },
  confirmed: { fg: colors.info, bg: colors.infoSoft, icon: 'check' },
  shipped: { fg: colors.primary, bg: colors.primarySoft, icon: 'truck' },
  delivered: { fg: colors.success, bg: colors.successSoft, icon: 'check' },
  cancelled: { fg: colors.danger, bg: colors.dangerSoft, icon: 'close' },
};

// Status is always shown as icon + label, never color alone
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = statusStyles[status];

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Icon name={style.icon} size={12} color={style.fg} />
      <Text style={[styles.text, { color: style.fg }]}>{statusLabels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
});
