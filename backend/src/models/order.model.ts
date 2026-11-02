import { Schema, Types, model, type HydratedDocument } from 'mongoose';

export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_METHODS = ['upi', 'card', 'cod'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Allowed status changes (admin). Delivered and cancelled are final.
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

interface IOrderItem {
  product: Types.ObjectId;
  // Snapshot at purchase time, so later product edits don't change old orders
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  line: string;
  city: string;
  pincode: string;
}

export interface IOrder {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: {
      type: [orderItemSchema],
      validate: [(items: IOrderItem[]) => items.length > 0, 'Order must have at least one item'],
    },
    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      line: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);

type PopulatedUser = { _id: Types.ObjectId; name: string; email: string };

export function toPublicOrder(order: OrderDocument) {
  const user = order.user as unknown as PopulatedUser | Types.ObjectId;
  const customer =
    user && typeof user === 'object' && 'email' in user
      ? { id: String(user._id), name: user.name, email: user.email }
      : undefined;

  return {
    id: order.id as string,
    orderNumber: order.orderNumber,
    userId: customer?.id ?? String(order.user),
    customer,
    items: order.items.map((item) => ({
      productId: String(item.product),
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
