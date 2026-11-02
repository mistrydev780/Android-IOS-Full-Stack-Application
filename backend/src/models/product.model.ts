import { Schema, model, type HydratedDocument } from 'mongoose';

export const PRODUCT_CATEGORIES = [
  'audio',
  'wearables',
  'electronics',
  'footwear',
  'accessories',
  'fashion',
] as const;

export const PRODUCT_BADGES = ['New', 'Bestseller', 'Trending'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export interface IProduct {
  name: string;
  brand: string;
  category: ProductCategory;
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
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = HydratedDocument<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    brand: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, required: true, enum: PRODUCT_CATEGORIES, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    image: { type: String, required: true, trim: true },
    badge: { type: String, enum: PRODUCT_BADGES },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    highlights: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    // Inactive products are hidden from the store but kept for past orders
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);

export function toPublicProduct(product: ProductDocument) {
  return {
    id: product.id as string,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    badge: product.badge,
    description: product.description,
    highlights: product.highlights,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt,
  };
}
