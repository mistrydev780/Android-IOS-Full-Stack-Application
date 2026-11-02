import { randomBytes } from 'node:crypto';
import { isValidObjectId, Types } from 'mongoose';

import {
  Order,
  STATUS_TRANSITIONS,
  toPublicOrder,
  type OrderStatus,
} from '../models/order.model';
import { Product } from '../models/product.model';
import { ApiError } from '../utils/ApiError';
import type { CreateOrderInput } from '../validators/order.validator';

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 99;

const customerFields = 'name email';

function generateOrderNumber() {
  return `DC${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`;
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  // Merge duplicate lines for the same product
  const quantities = new Map<string, number>();
  for (const item of input.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const products = await Product.find({ _id: { $in: [...quantities.keys()] }, isActive: true });
  if (products.length !== quantities.size) {
    throw ApiError.badRequest('Some items in your cart are no longer available');
  }

  // Reserve stock atomically; roll back if any product runs out
  const reserved: { id: Types.ObjectId; quantity: number }[] = [];
  for (const product of products) {
    const quantity = quantities.get(product.id as string)!;
    const updated = await Product.updateOne(
      { _id: product._id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
    );

    if (updated.modifiedCount === 0) {
      await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { stock: r.quantity } })));
      throw ApiError.badRequest(
        product.stock > 0
          ? `Only ${product.stock} left of "${product.name}"`
          : `"${product.name}" is out of stock`,
      );
    }
    reserved.push({ id: product._id, quantity });
  }

  // Prices always come from the database, never from the client
  const items = products.map((product) => ({
    product: product._id,
    name: product.name,
    brand: product.brand,
    image: product.image,
    price: product.price,
    quantity: quantities.get(product.id as string)!,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  try {
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: userId,
      items,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'pending',
    });

    return toPublicOrder(order);
  } catch (error) {
    await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { stock: r.quantity } })));
    throw error;
  }
}

export async function listMyOrders(userId: string) {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders.map(toPublicOrder);
}

export async function listAllOrders(status?: OrderStatus) {
  const orders = await Order.find(status ? { status } : {})
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('user', customerFields);

  return orders.map(toPublicOrder);
}

export async function getOrder(orderId: string, requester: { id: string; role: string }) {
  if (!isValidObjectId(orderId)) throw ApiError.notFound('Order not found');

  const order = await Order.findById(orderId).populate('user', customerFields);
  if (!order) throw ApiError.notFound('Order not found');

  const ownerId = String((order.user as unknown as { _id: Types.ObjectId })._id ?? order.user);
  if (requester.role !== 'admin' && ownerId !== requester.id) {
    // Don't reveal that the order exists
    throw ApiError.notFound('Order not found');
  }

  return toPublicOrder(order);
}

async function changeStatus(orderId: string, next: OrderStatus) {
  const order = await Order.findById(orderId).populate('user', customerFields);
  if (!order) throw ApiError.notFound('Order not found');

  if (!STATUS_TRANSITIONS[order.status].includes(next)) {
    throw ApiError.badRequest(`Cannot change an order from "${order.status}" to "${next}"`);
  }

  // Cancelled orders return their items to stock
  if (next === 'cancelled') {
    await Promise.all(
      order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })),
    );
  }

  order.status = next;
  await order.save();
  return toPublicOrder(order);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!isValidObjectId(orderId)) throw ApiError.notFound('Order not found');
  return changeStatus(orderId, status);
}

// Customers may cancel their own order until it is shipped
export async function cancelMyOrder(orderId: string, userId: string) {
  if (!isValidObjectId(orderId)) throw ApiError.notFound('Order not found');

  const owned = await Order.exists({ _id: orderId, user: userId });
  if (!owned) throw ApiError.notFound('Order not found');

  return changeStatus(orderId, 'cancelled');
}
