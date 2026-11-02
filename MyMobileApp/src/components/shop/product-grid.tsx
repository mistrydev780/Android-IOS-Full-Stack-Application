import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/ui/fade-in';
import type { Product } from '@/types/shop';
import { useResponsive } from '@/hooks/use-responsive';
import { spacing } from '@/theme';

import { ProductCard } from './product-card';

const GAP = spacing.md;

// Columns from the grid's own width, so it also fits next to the desktop sidebar
function columnsFor(width: number) {
  if (width >= 1000) return 4;
  if (width >= 640) return 3;
  return 2;
}

// Responsive grid: 2 columns on phones, 3 on tablets, 4 on wide screens
export function ProductGrid({ products }: { products: Product[] }) {
  const { contentWidth } = useResponsive();
  const [measured, setMeasured] = useState(0);

  const width = measured || contentWidth;
  const columns = columnsFor(width);
  const cardWidth = Math.floor((width - GAP * (columns - 1)) / columns);

  return (
    <View style={styles.grid} onLayout={(event) => setMeasured(Math.floor(event.nativeEvent.layout.width))}>
      {products.map((product, index) => (
        <FadeIn key={product.id} index={index}>
          <ProductCard product={product} width={cardWidth} />
        </FadeIn>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
});
