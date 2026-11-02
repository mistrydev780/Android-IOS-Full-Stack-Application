import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OrderDetails } from '@/components/shop/order-details';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { type IconName } from '@/components/ui/icon';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { statusLabels, statusTransitions } from '@/data/products';
import { useApiData } from '@/hooks/use-api-data';
import { ApiError } from '@/services/api';
import { orderService } from '@/services/shop.service';
import { colors, radius, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/shop';
import { confirm } from '@/utils/confirm';

const actionIcons: Record<OrderStatus, IconName> = {
  pending: 'calendar',
  confirmed: 'check',
  shipped: 'truck',
  delivered: 'store',
  cancelled: 'close',
};

const actionLabels: Partial<Record<OrderStatus, string>> = {
  confirmed: 'Confirm order',
  shipped: 'Mark as shipped',
  delivered: 'Mark as delivered',
  cancelled: 'Cancel order',
};

export default function AdminOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  const { data, setData, loading, error, refreshing, refresh } = useApiData(
    () => orderService.get(token!, id),
    [token, id],
  );
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const [actionError, setActionError] = useState('');

  const order = data?.order;
  const nextStatuses = order ? statusTransitions[order.status] : [];

  const changeStatus = async (status: OrderStatus) => {
    if (!order || !token) return;
    if (status === 'cancelled') {
      const ok = await confirm('Cancel order', 'Items will be returned to stock. This cannot be undone.', 'Cancel order');
      if (!ok) return;
    }

    setUpdating(status);
    setActionError('');
    try {
      setData(await orderService.updateStatus(token, order.id, status));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not update the order');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Screen edges={['bottom']} refreshing={refreshing} onRefresh={refresh} contentStyle={styles.content}>
      {!order ? (
        <LoadState loading={loading} error={error} onRetry={refresh} />
      ) : (
        <View style={styles.stack}>
          {nextStatuses.length > 0 ? (
            <View style={styles.actions}>
              <Text style={styles.actionsTitle}>Update status</Text>
              <Text style={styles.actionsHint}>Currently {statusLabels[order.status].toLowerCase()}</Text>
              <View style={styles.buttons}>
                {nextStatuses.map((status) => (
                  <Button
                    key={status}
                    title={actionLabels[status] ?? statusLabels[status]}
                    icon={actionIcons[status]}
                    variant={status === 'cancelled' ? 'danger' : 'primary'}
                    size="md"
                    loading={updating === status}
                    disabled={updating !== null}
                    onPress={() => changeStatus(status)}
                    style={styles.flex}
                  />
                ))}
              </View>
              <FormAlert message={actionError} />
            </View>
          ) : null}

          <OrderDetails order={order} showCustomer />
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
  stack: {
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  actions: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    gap: spacing.xs,
  },
  actionsTitle: {
    ...typography.h3,
    color: colors.text,
  },
  actionsHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
