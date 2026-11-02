import { z } from 'zod';

import { PRODUCT_BADGES, PRODUCT_CATEGORIES } from '../models/product.model';

const productFields = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  brand: z.string().trim().min(1, 'Brand is required').max(60),
  category: z.enum(PRODUCT_CATEGORIES, { error: 'Choose a valid category' }),
  price: z.coerce.number().positive('Price must be greater than 0'),
  originalPrice: z.coerce.number().positive().optional().nullable(),
  image: z.url('Enter a valid image URL'),
  badge: z.enum(PRODUCT_BADGES).optional().nullable(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  highlights: z.array(z.string().trim().min(1).max(80)).max(8).optional(),
  stock: z.coerce.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviews: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

const priceCheck = {
  message: 'Original price must be greater than or equal to the price',
  path: ['originalPrice'],
};

const originalPriceValid = (data: { price?: number; originalPrice?: number | null }) =>
  !data.originalPrice || data.price === undefined || data.originalPrice >= data.price;

export const productSchema = productFields.refine(originalPriceValid, priceCheck);

export const updateProductSchema = productFields.partial().refine(originalPriceValid, priceCheck);

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
