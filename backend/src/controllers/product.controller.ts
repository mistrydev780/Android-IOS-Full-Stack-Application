import { PRODUCT_CATEGORIES, type ProductCategory } from '../models/product.model';
import * as productService from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';

const isAdmin = (role?: string) => role === 'admin';

export const list = asyncHandler(async (req, res) => {
  const category = PRODUCT_CATEGORIES.includes(req.query.category as ProductCategory)
    ? (req.query.category as ProductCategory)
    : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 60) : undefined;

  const products = await productService.listProducts({
    category,
    search,
    includeInactive: isAdmin(req.user?.role) && req.query.all === 'true',
  });

  res.json({ success: true, data: { products } });
});

export const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(String(req.params.id), isAdmin(req.user?.role));
  res.json({ success: true, data: { product } });
});

export const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: { product } });
});

export const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(String(req.params.id), req.body);
  res.json({ success: true, data: { product } });
});

export const remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(String(req.params.id));
  res.json({ success: true, message: 'Product removed from store' });
});
