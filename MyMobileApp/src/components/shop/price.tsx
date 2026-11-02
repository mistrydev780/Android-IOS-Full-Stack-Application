import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors, spacing, typography } from '@/theme';
import { discountPercent, formatPrice } from '@/utils/format';

type PriceProps = {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'lg';
};

export function Price({ price, originalPrice, size = 'sm' }: PriceProps) {
  const discount = discountPercent(price, originalPrice);
  const large = size === 'lg';

  return (
    <View style={styles.row}>
      <Text style={[styles.price, large && styles.priceLarge]}>{formatPrice(price)}</Text>
      {discount > 0 ? (
        <>
          <Text style={[styles.original, large && styles.originalLarge]}>{formatPrice(originalPrice!)}</Text>
          <Text style={[styles.discount, large && styles.discountLarge]}>{discount}% off</Text>
        </>
      ) : null}
    </View>
  );
}

type RatingProps = {
  rating: number;
  reviews?: number;
};

export function Rating({ rating, reviews }: RatingProps) {
  return (
    <View style={styles.row} accessibilityLabel={`Rated ${rating} out of 5`}>
      <Icon name="star" size={13} color={colors.star} />
      <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      {reviews !== undefined ? (
        <Text style={styles.reviews}>({reviews.toLocaleString()})</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xxs + 2,
  },
  price: {
    ...typography.bodyStrong,
    fontWeight: '800',
    color: colors.text,
  },
  priceLarge: {
    ...typography.h1,
  },
  original: {
    ...typography.caption,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  originalLarge: {
    fontSize: 16,
  },
  discount: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  discountLarge: {
    fontSize: 15,
  },
  rating: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  reviews: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
