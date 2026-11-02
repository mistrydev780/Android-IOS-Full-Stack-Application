import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OrderDetails } from '@/components/shop/order-details';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { useProducts } from '@/context/products-context';
import { useApiData } from '@/hooks/use-api-data';
import { ApiError } from '@/services/api';
import { orderService } from '@/services/shop.service';
import { spacing } from '@/theme';
import { confirm } from '@/utils/confirm';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const { refresh: refreshProducts } = useProducts();

  const { data, setData, loading, error, refreshing, refresh } = useApiData(
    () => orderService.get(token!, id),
    [token, id],
  );
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');

  const order = data?.order;
  const canCancel = order?.status === 'pending' || order?.status === 'confirmed';

  const handleCancel = async () => {
    if (!order || !token) return;
    if (!(await confirm('Cancel order', `Cancel order #${order.orderNumber}?`, 'Cancel order'))) return;

    setCancelling(true);
    setActionError('');
    try {
      setData(await orderService.cancel(token, order.id));
      void refreshProducts();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not cancel the order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Screen edges={['bottom']} refreshing={refreshing} onRefresh={refresh} contentStyle={styles.content}>
      {!order ? (
        <LoadState loading={loading} error={error} onRetry={refresh} />
      ) : (
        <View style={styles.stack}>
          <OrderDetails order={order} />
          <FormAlert message={actionError} />
          {canCancel ? (
            <Button title="Cancel order" variant="danger" icon="close" onPress={handleCancel} loading={cancelling} />
          ) : null}
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
});
