import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProductImage } from '@/components/shop/product-image';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { useProducts } from '@/context/products-context';
import { LOW_STOCK_THRESHOLD, categories } from '@/data/products';
import { useApiData } from '@/hooks/use-api-data';
import { productService } from '@/services/shop.service';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Product } from '@/types/shop';
import { formatPrice } from '@/utils/format';

export default function AdminProductsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { refresh: refreshStore } = useProducts();
  const [query, setQuery] = useState('');

  const { data, setData, loading, error, refreshing, refresh } = useApiData(
    () => productService.list(token, { includeHidden: true }),
    [token],
  );

  const term = query.trim().toLowerCase();
  const products = (data?.products ?? []).filter(
    (p) => !term || p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term),
  );

  const restore = async (product: Product) => {
    if (!token) return;
    const { product: updated } = await productService.update(token, product.id, { isActive: true });
    setData((current) =>
      current ? { products: current.products.map((p) => (p.id === updated.id ? updated : p)) } : current,
    );
    void refreshStore();
  };

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Products
        </Text>
        <Button title="Add product" icon="plus" size="md" onPress={() => router.push('/admin/product-form')} />
      </View>

      <View style={styles.search}>
        <Icon name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or brand"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          accessibilityLabel="Search products"
        />
      </View>

      {loading || (error && !data) ? (
        <LoadState loading={loading} error={error} onRetry={refresh} />
      ) : products.length === 0 ? (
        <EmptyState icon="store" title="No products found" message="Try another search or add a new product." />
      ) : (
        <View style={styles.list}>
          <Text style={styles.count}>{products.length} products</Text>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onPress={() => router.push({ pathname: '/admin/product-form', params: { id: product.id } })}
              onRestore={() => restore(product)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function ProductRow({ product, onPress, onRestore }: { product: Product; onPress: () => void; onRestore: () => void }) {
  const category = categories.find((c) => c.id === product.category)?.name;
  const stockTone =
    product.stock === 0 ? styles.stockOut : product.stock <= LOW_STOCK_THRESHOLD ? styles.stockLow : styles.stockOk;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${product.name}`}
      style={({ pressed }) => [styles.row, !product.isActive && styles.rowHidden, pressed && styles.pressed]}
    >
      <ProductImage uri={product.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {product.brand} · {category}
        </Text>
        <View style={styles.tags}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={[styles.stock, stockTone]}>
            {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
          </Text>
          {!product.isActive ? <Text style={[styles.stock, styles.hiddenTag]}>Hidden</Text> : null}
        </View>
      </View>
      {product.isActive ? (
        <Icon name="edit" size={18} color={colors.textMuted} />
      ) : (
        <Button title="Restore" size="md" variant="secondary" onPress={onRestore} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    outlineWidth: 0,
  },
  list: {
    gap: spacing.sm,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowHidden: {
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  price: {
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.text,
  },
  stock: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  stockOk: {
    color: colors.success,
    backgroundColor: colors.successSoft,
  },
  stockLow: {
    color: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  stockOut: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  hiddenTag: {
    color: colors.textSecondary,
    backgroundColor: colors.border,
  },
});
