export type CategoryId = 'audio' | 'wearables' | 'electronics' | 'footwear' | 'accessories' | 'fashion';

export type ProductBadge = 'New' | 'Bestseller' | 'Trending';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: ProductBadge;
  description: string;
  highlights: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
};

export type ProductInput = {
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  originalPrice: number | null;
  image: string;
  badge: ProductBadge | null;
  description: string;
  highlights: string[];
  stock: number;
  isActive?: boolean;
};

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'cod';

export type ShippingAddress = {
  fullName: string;
  phone: string;
  line: string;
  city: string;
  pincode: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  customer?: { id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totals: { revenue: number; orders: number; customers: number; products: number };
  ordersByStatus: Record<OrderStatus, number>;
  sales: { date: string; revenue: number; orders: number }[];
  lowStock: Product[];
  recentOrders: Order[];
};
