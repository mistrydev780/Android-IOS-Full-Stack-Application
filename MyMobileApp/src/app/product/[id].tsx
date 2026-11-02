import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Price, Rating } from '@/components/shop/price';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductImage } from '@/components/shop/product-image';
import { QuantityStepper } from '@/components/shop/quantity-stepper';
import { SectionHeader } from '@/components/shop/section-header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon, type IconName } from '@/components/ui/icon';
import { LoadState } from '@/components/ui/load-state';
import { useProducts } from '@/context/products-context';
import { maxQuantityFor, useShop } from '@/context/shop-context';
import { LOW_STOCK_THRESHOLD, categories } from '@/data/products';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, layout, radius, shadows, spacing, typography } from '@/theme';

const promises: { icon: IconName; title: string; text: string }[] = [
  { icon: 'truck', title: 'Free delivery', text: 'Arrives in 2–4 days' },
  { icon: 'returns', title: '7-day returns', text: 'Easy pickup' },
  { icon: 'shield', title: '1-year warranty', text: 'Brand authorised' },
];

export default function ProductDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const { products, getProduct, status, error, refresh } = useProducts();
  const { isTablet, gutter, width } = useResponsive();
  // Align floating buttons with the centered content on wide screens
  const sideInset = Math.max(0, (width - layout.maxContentWidth) / 2);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = getProduct(id);

  // Reset the "Added" confirmation after a moment
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const goBack = () => {
    // No history when the page was opened directly (web refresh / deep link)
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  if (!product && status !== 'ready') {
    return (
      <SafeAreaView style={styles.root}>
        <LoadState loading={status === 'loading'} error={error} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.root}>
        <EmptyState
          icon="search"
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          actionLabel="Back to shop"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const categoryName = categories.find((c) => c.id === product.category)?.name;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id);
  const fallbackRelated = related.length ? related : products.filter((p) => p.id !== product.id).slice(0, 4);
  const maxQuantity = maxQuantityFor(product);
  const soldOut = maxQuantity === 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    router.push('/cart');
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.container, isTablet && styles.containerWide, isTablet && { paddingTop: insets.top + 72, paddingHorizontal: gutter }]}>
          {/* Image */}
          <View style={[styles.media, isTablet && styles.mediaWide]}>
            <ProductImage
              uri={product.image}
              style={[styles.image, isTablet ? styles.imageWide : { height: Math.min(520, 420 + insets.top) }]}
            />
          </View>

          {/* Details */}
          <View style={[styles.details, isTablet ? styles.detailsWide : { paddingHorizontal: gutter }]}>
            <View style={styles.metaRow}>
              <Text style={styles.brand}>{product.brand}</Text>
              {categoryName ? (
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{categoryName}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.name} accessibilityRole="header">
              {product.name}
            </Text>

            <Rating rating={product.rating} reviews={product.reviews} />

            <View style={styles.priceBlock}>
              <Price price={product.price} originalPrice={product.originalPrice} size="lg" />
              <Text style={styles.tax}>Inclusive of all taxes</Text>
            </View>

            <View style={styles.quantityRow}>
              <Text style={styles.label}>Quantity</Text>
              {soldOut ? (
                <Text style={styles.soldOut}>Out of stock</Text>
              ) : (
                <QuantityStepper value={Math.min(quantity, maxQuantity)} onChange={setQuantity} min={1} max={maxQuantity} />
              )}
            </View>
            {!soldOut && product.stock <= LOW_STOCK_THRESHOLD ? (
              <Text style={styles.lowStock}>Hurry! Only {product.stock} left in stock</Text>
            ) : null}

            {isTablet ? (
              <View style={styles.inlineActions}>
                <ActionButtons added={added} soldOut={soldOut} onAdd={handleAddToCart} onBuy={handleBuyNow} />
              </View>
            ) : null}

            <View style={styles.promises}>
              {promises.map((promise) => (
                <View key={promise.title} style={styles.promise}>
                  <Icon name={promise.icon} size={20} color={colors.primary} />
                  <Text style={styles.promiseTitle}>{promise.title}</Text>
                  <Text style={styles.promiseText}>{promise.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this product</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Highlights</Text>
              <View style={styles.highlights}>
                {product.highlights.map((highlight) => (
                  <View key={highlight} style={styles.highlight}>
                    <Icon name="check" size={18} color={colors.success} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Related */}
        <View style={[styles.related, { paddingHorizontal: gutter }]}>
          <SectionHeader title="You may also like" />
          <ProductGrid products={fallbackRelated} />
        </View>
      </ScrollView>

      {/* Floating top bar */}
      <View
        style={[styles.topBar, { top: insets.top + spacing.xs, left: sideInset, right: sideInset, paddingHorizontal: gutter }]}
        pointerEvents="box-none"
      >
        <RoundButton icon="back" label="Go back" onPress={goBack} />
        <RoundButton
          icon={wishlisted ? 'heartFill' : 'heart'}
          color={wishlisted ? colors.danger : colors.text}
          label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onPress={() => toggleWishlist(product.id)}
        />
      </View>

      {/* Sticky bottom actions on phones */}
      {isTablet ? null : (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md), paddingHorizontal: gutter }]}>
          <ActionButtons added={added} soldOut={soldOut} onAdd={handleAddToCart} onBuy={handleBuyNow} />
        </View>
      )}
    </View>
  );
}

type ActionButtonsProps = { added: boolean; soldOut: boolean; onAdd: () => void; onBuy: () => void };

function ActionButtons({ added, soldOut, onAdd, onBuy }: ActionButtonsProps) {
  if (soldOut) {
    return <Button title="Currently unavailable" disabled variant="outline" style={styles.flex} />;
  }

  return (
    <>
      <Button
        title={added ? 'Added' : 'Add to cart'}
        icon={added ? 'check' : 'bag'}
        variant="outline"
        onPress={onAdd}
        style={styles.flex}
        accessibilityHint="Adds the selected quantity to your cart"
      />
      <Button title="Buy now" icon="bolt" onPress={onBuy} style={styles.flex} />
    </>
  );
}

function RoundButton({
  icon,
  label,
  onPress,
  color = colors.text,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.round, pressed && styles.roundPressed]}
    >
      <Icon name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 120,
  },
  container: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  containerWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xxl,
  },
  media: {
    width: '100%',
  },
  mediaWide: {
    flex: 1,
    maxWidth: 560,
  },
  image: {
    width: '100%',
  },
  imageWide: {
    aspectRatio: 1,
    borderRadius: radius.xl,
  },
  details: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  detailsWide: {
    flex: 1,
    paddingTop: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    ...typography.overline,
    color: colors.primary,
  },
  categoryPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  name: {
    ...typography.h1,
    color: colors.text,
  },
  soldOut: {
    ...typography.bodyStrong,
    color: colors.danger,
  },
  lowStock: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
  },
  priceBlock: {
    gap: 2,
  },
  tax: {
    ...typography.caption,
    color: colors.textMuted,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  promises: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  promise: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promiseTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  promiseText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  highlights: {
    gap: spacing.xs,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  highlightText: {
    ...typography.body,
    color: colors.text,
  },
  related: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    marginTop: spacing.xxl,
  },
  topBar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  roundPressed: {
    opacity: 0.75,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
});
