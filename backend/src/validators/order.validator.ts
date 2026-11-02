import { z } from 'zod';

import { ORDER_STATUSES, PAYMENT_METHODS } from '../models/order.model';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product id');

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectId,
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, 'Your cart is empty')
    .max(50),
  shippingAddress: z.object({
    fullName: z.string().trim().min(2, 'Enter your full name').max(60),
    phone: z.string().trim().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
    line: z.string().trim().min(5, 'Enter your full address').max(200),
    city: z.string().trim().min(2, 'Enter your city').max(60),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  }),
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
