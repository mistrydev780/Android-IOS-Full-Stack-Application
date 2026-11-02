import type {
  DashboardStats,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductInput,
  ShippingAddress,
} from '@/types/shop';

import { apiRequest } from './api';

export const productService = {
  list: (token?: string | null, options: { includeHidden?: boolean } = {}) =>
    apiRequest<{ products: Product[] }>(`/products${options.includeHidden ? '?all=true' : ''}`, { token }),

  get: (id: string, token?: string | null) => apiRequest<{ product: Product }>(`/products/${id}`, { token }),

  create: (token: string, input: ProductInput) =>
    apiRequest<{ product: Product }>('/products', { method: 'POST', token, body: input }),

  update: (token: string, id: string, input: Partial<ProductInput>) =>
    apiRequest<{ product: Product }>(`/products/${id}`, { method: 'PATCH', token, body: input }),

  remove: (token: string, id: string) => apiRequest<void>(`/products/${id}`, { method: 'DELETE', token }),
};

export type CreateOrderInput = {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
};

export const orderService = {
  create: (token: string, input: CreateOrderInput) =>
    apiRequest<{ order: Order }>('/orders', { method: 'POST', token, body: input }),

  mine: (token: string) => apiRequest<{ orders: Order[] }>('/orders/mine', { token }),

  get: (token: string, id: string) => apiRequest<{ order: Order }>(`/orders/${id}`, { token }),

  cancel: (token: string, id: string) =>
    apiRequest<{ order: Order }>(`/orders/${id}/cancel`, { method: 'PATCH', token }),

  // Admin
  listAll: (token: string, status?: OrderStatus) =>
    apiRequest<{ orders: Order[] }>(`/orders${status ? `?status=${status}` : ''}`, { token }),

  updateStatus: (token: string, id: string, status: OrderStatus) =>
    apiRequest<{ order: Order }>(`/orders/${id}/status`, { method: 'PATCH', token, body: { status } }),
};

export const adminService = {
  stats: (token: string) => apiRequest<DashboardStats>('/admin/stats', { token }),
};
