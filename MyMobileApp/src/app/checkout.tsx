import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OrderSummary, getOrderTotals } from '@/components/shop/order-summary';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FormAlert } from '@/components/ui/form-alert';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/context/auth-context';
import { useProducts } from '@/context/products-context';
import { useShop } from '@/context/shop-context';
import { ApiError } from '@/services/api';
import { orderService } from '@/services/shop.service';
import type { Order, PaymentMethod } from '@/types/shop';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, radius, spacing, typography } from '@/theme';
import { formatPrice } from '@/utils/format';

const paymentMethods: { id: PaymentMethod; icon: IconName; title: string; text: string }[] = [
  { id: 'upi', icon: 'bolt', title: 'UPI', text: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', icon: 'card', title: 'Credit / Debit card', text: 'Visa, Mastercard, RuPay' },
  { id: 'cod', icon: 'truck', title: 'Cash on delivery', text: 'Pay when it arrives' },
];

type Address = { fullName: string; phone: string; line: string; city: string; pincode: string };

export default function CheckoutScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { refresh: refreshProducts } = useProducts();
  const { cart, cartCount, subtotal, savings, clearCart } = useShop();
  const { isTablet } = useResponsive();

  const [address, setAddress] = useState<Address>({
    fullName: user?.name ?? '',
    phone: '',
    line: '',
    city: '',
    pincode: '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const update = (field: keyof Address) => (value: string) => setAddress((a) => ({ ...a, [field]: value }));

  const placeOrder = async () => {
    if (!address.fullName.trim() || !address.line.trim() || !address.city.trim()) {
      setError('Please fill in your name, address and city.');
      return;
    }
    if (!/^\d{10}$/.test(address.phone.trim())) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setError('Enter a valid 6-digit PIN code.');
      return;
    }

    if (!token) return;

    setError('');
    setPlacing(true);
    try {
      // Prices, stock and totals are verified again on the server
      const { order } = await orderService.create(token, {
        items: cart.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
        shippingAddress: {
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          line: address.line.trim(),
          city: address.city.trim(),
          pincode: address.pincode.trim(),
        },
        paymentMethod: payment,
      });
      setPlacedOrder(order);
      clearCart();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
      // Stock changed (or our copy was stale): reload the catalog
      void refreshProducts();
    }
  };

  if (placedOrder) {
    return (
      <Screen edges={['bottom']} contentStyle={styles.successWrap}>
        <View style={styles.successIcon}>
          <Icon name="check" size={48} color={colors.success} />
        </View>
        <Text style={styles.successTitle}>Order placed!</Text>
        <Text style={styles.successText}>
          Thank you, {address.fullName.split(' ')[0]}. Your order{' '}
          <Text style={styles.bold}>#{placedOrder.orderNumber}</Text> of{' '}
          <Text style={styles.bold}>{formatPrice(placedOrder.total)}</Text> has been placed. We'll notify you when it ships.
        </Text>
        <Button
          title="Track my order"
          icon="truck"
          onPress={() => router.replace({ pathname: '/orders/[id]', params: { id: placedOrder.id } })}
          fullWidth
        />
        <Button title="Continue shopping" variant="outline" onPress={() => router.replace('/')} fullWidth />
      </Screen>
    );
  }

  if (cart.length === 0) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState
          icon="bag"
          title="Nothing to checkout"
          message="Your cart is empty. Add some products first."
          actionLabel="Browse products"
          onAction={() => router.replace('/search')}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']}>
      <View style={[styles.layout, isTablet && styles.layoutWide]}>
        <View style={[styles.main, isTablet && styles.flex]}>
          <Section step={1} title="Delivery address">
            <View style={styles.fields}>
              <TextField label="Full name" icon="person" value={address.fullName} onChangeText={update('fullName')} autoComplete="name" />
              <TextField
                label="Phone"
                icon="phone"
                placeholder="10-digit mobile number"
                value={address.phone}
                onChangeText={update('phone')}
                keyboardType="phone-pad"
                maxLength={10}
                autoComplete="tel"
              />
              <TextField
                label="Address"
                icon="location"
                placeholder="House no., street, area"
                value={address.line}
                onChangeText={update('line')}
                autoComplete="street-address"
              />
              <View style={styles.row}>
                <View style={styles.flex}>
                  <TextField label="City" value={address.city} onChangeText={update('city')} />
                </View>
                <View style={styles.flex}>
                  <TextField
                    label="PIN code"
                    value={address.pincode}
                    onChangeText={update('pincode')}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoComplete="postal-code"
                  />
                </View>
              </View>
            </View>
          </Section>

          <Section step={2} title="Payment method">
            <View style={styles.methods}>
              {paymentMethods.map((method) => {
                const selected = payment === method.id;
                return (
                  <Pressable
                    key={method.id}
                    onPress={() => setPayment(method.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    style={[styles.method, selected && styles.methodSelected]}
                  >
                    <View style={[styles.methodIcon, selected && styles.methodIconSelected]}>
                      <Icon name={method.icon} size={20} color={selected ? colors.textInverse : colors.text} />
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.methodTitle}>{method.title}</Text>
                      <Text style={styles.methodText}>{method.text}</Text>
                    </View>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Section>
        </View>

        <View style={[styles.side, isTablet && styles.sideWide]}>
          <OrderSummary subtotal={subtotal} savings={savings} itemCount={cartCount} />
          <FormAlert message={error} />
          <Button
            title={`Place order · ${formatPrice(getOrderTotals(subtotal).total)}`}
            onPress={placeOrder}
            loading={placing}
            fullWidth
          />
          <Text style={styles.demoNote}>Demo payments — no money is charged. Your order is saved to your account.</Text>
        </View>
      </View>
    </Screen>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.step}>
          <Text style={styles.stepText}>{step}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  layout: {
    gap: spacing.xl,
    paddingTop: spacing.md,
  },
  layoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  main: {
    gap: spacing.xl,
  },
  side: {
    gap: spacing.md,
  },
  sideWide: {
    width: 380,
  },
  section: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  step: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textInverse,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  fields: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  methods: {
    gap: spacing.sm,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  methodSelected: {
    borderColor: colors.ink,
    backgroundColor: colors.surfaceMuted,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconSelected: {
    backgroundColor: colors.ink,
  },
  methodTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  methodText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.ink,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  demoNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    maxWidth: 480,
    paddingVertical: spacing.xxxl,
  },
  successIcon: {
    width: 104,
    height: 104,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    ...typography.h1,
    color: colors.text,
  },
  successText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
});
