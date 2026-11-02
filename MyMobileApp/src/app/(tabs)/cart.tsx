import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OrderSummary } from '@/components/shop/order-summary';
import { Price } from '@/components/shop/price';
import { ProductImage } from '@/components/shop/product-image';
import { QuantityStepper } from '@/components/shop/quantity-stepper';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { maxQuantityFor, useShop, type CartLine } from '@/context/shop-context';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, radius, spacing, typography } from '@/theme';

export default function CartScreen() {
  const router = useRouter();
  const { cart, cartCount, subtotal, savings } = useShop();
  const { isTablet } = useResponsive();

  if (cart.length === 0) {
    return (
      <Screen>
        <Text style={styles.title} accessibilityRole="header">
          My Cart
        </Text>
        <EmptyState
          icon="bag"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Explore our collection and find something you love."
          actionLabel="Start shopping"
          onAction={() => router.push('/search')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        My Cart
      </Text>
      <Text style={styles.subtitle}>
        {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag
      </Text>

      <View style={[styles.layout, isTablet && styles.layoutWide]}>
        <View style={[styles.items, isTablet && styles.itemsWide]}>
          {cart.map((line, index) => (
            <FadeIn key={line.product.id} index={index} removable>
              <CartItem line={line} />
            </FadeIn>
          ))}
        </View>

        <View style={[styles.summary, isTablet && styles.summaryWide]}>
          <OrderSummary subtotal={subtotal} savings={savings} itemCount={cartCount} />
          <Button title="Proceed to checkout" iconRight="forward" onPress={() => router.push('/checkout')} fullWidth />
          <View style={styles.secure}>
            <Icon name="shield" size={16} color={colors.success} />
            <Text style={styles.secureText}>Safe and secure payments</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

function CartItem({ line }: { line: CartLine }) {
  const router = useRouter();
  const { updateQuantity, removeFromCart } = useShop();
  const { product, quantity } = line;

  return (
    <View style={styles.item}>
      <Pressable
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
        accessibilityRole="imagebutton"
        accessibilityLabel={product.name}
      >
        <ProductImage uri={product.image} style={styles.itemImage} />
      </Pressable>

      <View style={styles.itemBody}>
        <View style={styles.itemTop}>
          <View style={styles.itemText}>
            <Text style={styles.itemBrand}>{product.brand}</Text>
            <Text style={styles.itemName} numberOfLines={2}>
              {product.name}
            </Text>
          </View>
          <Pressable
            onPress={() => removeFromCart(product.id)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${product.name}`}
          >
            <Icon name="trash" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.itemBottom}>
          <Price price={product.price * quantity} />
          <QuantityStepper
            value={quantity}
            min={1}
            max={maxQuantityFor(product)}
            onChange={(value) => updateQuantity(product.id, value)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.text,
    paddingTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  layout: {
    gap: spacing.xl,
  },
  layoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  items: {
    gap: spacing.sm,
  },
  itemsWide: {
    flex: 1,
  },
  summary: {
    gap: spacing.md,
  },
  summaryWide: {
    width: 360,
  },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
  },
  itemBody: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  itemTop: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemBrand: {
    ...typography.overline,
    color: colors.textMuted,
  },
  itemName: {
    ...typography.bodyStrong,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  secureText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
