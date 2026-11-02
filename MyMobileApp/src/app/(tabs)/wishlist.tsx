import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ProductGrid } from '@/components/shop/product-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { useShop } from '@/context/shop-context';
import { colors, spacing, typography } from '@/theme';

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist } = useShop();

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        Wishlist
      </Text>
      <Text style={styles.subtitle}>
        {wishlist.length ? `${wishlist.length} saved ${wishlist.length === 1 ? 'item' : 'items'}` : 'Save items you love'}
      </Text>

      {wishlist.length ? (
        <ProductGrid products={wishlist} />
      ) : (
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here for later."
          actionLabel="Explore products"
          onAction={() => router.push('/search')}
        />
      )}
    </Screen>
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
});
