import { isValidObjectId } from 'mongoose';

import { Product, toPublicProduct, type ProductCategory } from '../models/product.model';
import { ApiError } from '../utils/ApiError';
import type { ProductInput, UpdateProductInput } from '../validators/product.validator';

type ListOptions = {
  category?: ProductCategory;
  search?: string;
  // Admins also see inactive products
  includeInactive?: boolean;
};

export async function listProducts({ category, search, includeInactive = false }: ListOptions) {
  const filter: Record<string, unknown> = {};

  if (!includeInactive) filter.isActive = true;
  if (category) filter.category = category;
  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: pattern }, { brand: pattern }];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return products.map(toPublicProduct);
}

export async function getProduct(id: string, includeInactive = false) {
  if (!isValidObjectId(id)) throw ApiError.notFound('Product not found');

  const product = await Product.findById(id);
  if (!product || (!product.isActive && !includeInactive)) {
    throw ApiError.notFound('Product not found');
  }

  return toPublicProduct(product);
}

export async function createProduct(input: ProductInput) {
  const product = await Product.create({
    ...input,
    originalPrice: input.originalPrice ?? undefined,
    badge: input.badge ?? undefined,
  });

  return toPublicProduct(product);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  if (!isValidObjectId(id)) throw ApiError.notFound('Product not found');

  // `null` clears an optional field (e.g. removing a badge or discount)
  const $set: Record<string, unknown> = {};
  const $unset: Record<string, ''> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === null) $unset[key] = '';
    else if (value !== undefined) $set[key] = value;
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { $set, ...(Object.keys($unset).length && { $unset }) },
    { new: true, runValidators: true },
  );

  if (!product) throw ApiError.notFound('Product not found');
  return toPublicProduct(product);
}

// Soft delete: keeps the product for existing orders but hides it from the store
export async function deleteProduct(id: string) {
  if (!isValidObjectId(id)) throw ApiError.notFound('Product not found');

  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw ApiError.notFound('Product not found');
}
