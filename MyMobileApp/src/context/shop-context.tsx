import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Product } from '@/types/shop';

import { useProducts } from './products-context';

export type CartLine = {
  product: Product;
  quantity: number;
};

type ShopContextValue = {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  savings: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: Product[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
};

const MAX_QUANTITY = 10;

// Highest quantity a customer can buy of one product
export function maxQuantityFor(product: Product) {
  return Math.max(0, Math.min(MAX_QUANTITY, product.stock));
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useProducts();

  // productId -> quantity (insertion order = order added)
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Products that disappeared or sold out drop out of the cart automatically
  const cart = Object.entries(quantities).flatMap(([id, quantity]) => {
    const product = getProduct(id);
    if (!product || product.stock === 0) return [];
    return [{ product, quantity: Math.min(quantity, maxQuantityFor(product)) }];
  });

  const clamp = (productId: string, quantity: number) => {
    const product = getProduct(productId);
    return product ? Math.min(quantity, maxQuantityFor(product)) : 0;
  };

  const value: ShopContextValue = {
    cart,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    savings: cart.reduce(
      (sum, line) =>
        sum + Math.max(0, (line.product.originalPrice ?? line.product.price) - line.product.price) * line.quantity,
      0,
    ),

    addToCart: (productId, quantity = 1) =>
      setQuantities((current) => {
        const next = clamp(productId, (current[productId] ?? 0) + quantity);
        return next > 0 ? { ...current, [productId]: next } : current;
      }),

    updateQuantity: (productId, quantity) =>
      setQuantities((current) => {
        if (quantity <= 0) {
          const { [productId]: _removed, ...rest } = current;
          return rest;
        }
        return { ...current, [productId]: clamp(productId, quantity) };
      }),

    removeFromCart: (productId) =>
      setQuantities((current) => {
        const { [productId]: _removed, ...rest } = current;
        return rest;
      }),

    clearCart: () => setQuantities({}),

    wishlist: wishlistIds.flatMap((id) => getProduct(id) ?? []),
    isWishlisted: (productId) => wishlistIds.includes(productId),
    toggleWishlist: (productId) =>
      setWishlistIds((current) =>
        current.includes(productId) ? current.filter((id) => id !== productId) : [productId, ...current],
      ),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside <ShopProvider>');
  return context;
}
