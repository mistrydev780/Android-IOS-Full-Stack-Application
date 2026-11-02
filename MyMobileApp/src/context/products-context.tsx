import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { ApiError } from '@/services/api';
import { productService } from '@/services/shop.service';
import type { Product } from '@/types/shop';

type Status = 'loading' | 'ready' | 'error';

type ProductsContextValue = {
  products: Product[];
  status: Status;
  error: string;
  refreshing: boolean;
  refresh: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

// Store catalog, loaded once from the API and shared by every screen
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await productService.list();
      setProducts(data.products);
      setStatus('ready');
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load products');
      // Keep showing the last good catalog if we have one
      setStatus((current) => (current === 'ready' ? 'ready' : 'error'));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const value: ProductsContextValue = {
    products,
    status,
    error,
    refreshing,
    refresh: async () => {
      setRefreshing(true);
      if (status === 'error') setStatus('loading');
      await load();
      setRefreshing(false);
    },
    getProduct: (id) => products.find((product) => product.id === id),
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used inside <ProductsProvider>');
  return context;
}
