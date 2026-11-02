import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useShop } from '@/context/shop-context';
import { LOW_STOCK_THRESHOLD } from '@/data/products';
import type { Product } from '@/types/shop';
import { colors, radius, shadows, spacing, typography } from '@/theme';

import { Price, Rating } from './price';
import { ProductImage } from './product-image';

type ProductCardProps = {
  product: Product;
  width: number;
};

export function ProductCard({ product, width }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.brand}`}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <View>
        <ProductImage uri={product.image} style={[styles.image, { height: width }]} />

        {soldOut ? (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Sold out</Text>
          </View>
        ) : null}

        {product.badge && !soldOut ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => toggleWishlist(product.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          style={styles.wishlist}
        >
          <Icon
            name={wishlisted ? 'heartFill' : 'heart'}
            size={18}
            color={wishlisted ? colors.danger : colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Rating rating={product.rating} reviews={product.reviews} />
        {lowStock ? <Text style={styles.lowStock}>Only {product.stock} left</Text> : null}

        <View style={styles.footer}>
          <View style={styles.priceWrap}>
            <Price price={product.price} originalPrice={product.originalPrice} />
          </View>

          <Pressable
            onPress={() => addToCart(product.id)}
            disabled={soldOut}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart`}
            accessibilityState={{ disabled: soldOut }}
            style={({ pressed }) => [styles.add, pressed && styles.addPressed, soldOut && styles.addDisabled]}
          >
            <Icon name="plus" size={18} color={colors.textInverse} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textInverse,
    letterSpacing: 0.4,
  },
  wishlist: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  body: {
    padding: spacing.sm,
    gap: spacing.xxs + 2,
  },
  brand: {
    ...typography.overline,
    color: colors.textMuted,
  },
  name: {
    ...typography.bodyStrong,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
    minHeight: 38,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  priceWrap: {
    flex: 1,
  },
  add: {
    width: 36,
    height: 36,
    borderRadius: radius.md - 2,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
  addDisabled: {
    backgroundColor: colors.borderStrong,
  },
  soldOut: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    ...typography.overline,
    color: colors.textInverse,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  lowStock: {
    ...typography.caption,
    fontSize: 12,
    color: colors.warning,
    fontWeight: '700',
  },
});
