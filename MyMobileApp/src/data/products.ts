import type { IconName } from '@/components/ui/icon';
import type { CategoryId, OrderStatus, PaymentMethod } from '@/types/shop';

// Products now come from the backend (seeded with `npm run seed` in /backend).
// This file keeps the static lookup data used across the app.

export type Category = {
  id: CategoryId;
  name: string;
  icon: IconName;
};

export const categories: Category[] = [
  { id: 'audio', name: 'Audio', icon: 'audio' },
  { id: 'wearables', name: 'Wearables', icon: 'wearables' },
  { id: 'electronics', name: 'Electronics', icon: 'electronics' },
  { id: 'footwear', name: 'Footwear', icon: 'footwear' },
  { id: 'accessories', name: 'Accessories', icon: 'accessories' },
  { id: 'fashion', name: 'Fashion', icon: 'fashion' },
];

export const paymentLabels: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Credit / Debit card',
  cod: 'Cash on delivery',
};

export const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Mirrors STATUS_TRANSITIONS in backend/src/models/order.model.ts
export const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const LOW_STOCK_THRESHOLD = 5;
