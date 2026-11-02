import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CategoryChip } from '@/components/shop/category-chip';
import { ProductGrid } from '@/components/shop/product-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useProducts } from '@/context/products-context';
import { categories } from '@/data/products';
import type { CategoryId } from '@/types/shop';
import { colors, radius, shadows, spacing, typography } from '@/theme';

const sortOptions = [
  { id: 'popular', label: 'Popular' },
  { id: 'rating', label: 'Top rated' },
  { id: 'priceLow', label: 'Price: Low to High' },
  { id: 'priceHigh', label: 'Price: High to Low' },
] as const;

type SortId = (typeof sortOptions)[number]['id'];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { products, status, error, refresh, refreshing } = useProducts();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [sort, setSort] = useState<SortId>('popular');

  // Category chosen from the Home screen
  useEffect(() => {
    const fromParams = categories.find((c) => c.id === params.category)?.id ?? null;
    setCategory(fromParams);
  }, [params.category]);

  const term = query.trim().toLowerCase();

  const results = products
    .filter((product) => !category || product.category === category)
    .filter(
      (product) =>
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.includes(term),
    )
    .sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating;
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        default:
          return b.reviews - a.reviews;
      }
    });

  const resetFilters = () => {
    setQuery('');
    setCategory(null);
    setSort('popular');
  };

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Text style={styles.title} accessibilityRole="header">
        Discover
      </Text>

      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products or brands"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search products"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
            <Icon name="close" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}
      >
        <CategoryChip label="All" icon="store" selected={!category} onPress={() => setCategory(null)} />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.name}
            icon={c.icon}
            selected={category === c.id}
            onPress={() => setCategory(category === c.id ? null : c.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sorts}>
          {sortOptions.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setSort(option.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: sort === option.id }}
              style={[styles.sort, sort === option.id && styles.sortActive]}
            >
              <Text style={[styles.sortText, sort === option.id && styles.sortTextActive]}>{option.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {status !== 'ready' ? (
        <LoadState loading={status === 'loading'} error={error} onRetry={refresh} />
      ) : results.length ? (
        <ProductGrid products={results} />
      ) : (
        <EmptyState
          icon="search"
          title="No products found"
          message="Try a different search term or clear the filters."
          actionLabel="Clear filters"
          onAction={resetFilters}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    outlineWidth: 0,
  },
  chipsScroll: {
    marginTop: spacing.md,
  },
  chips: {
    gap: spacing.xs,
  },
  toolbar: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sorts: {
    gap: spacing.xs,
  },
  sort: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  sortText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sortTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
