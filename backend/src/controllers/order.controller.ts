import { ORDER_STATUSES, type OrderStatus } from '../models/order.model';
import * as orderService from '../services/order.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

function currentUser(req: Express.Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const create = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(currentUser(req).id, req.body);
  res.status(201).json({ success: true, data: { order } });
});

export const mine = asyncHandler(async (req, res) => {
  const orders = await orderService.listMyOrders(currentUser(req).id);
  res.json({ success: true, data: { orders } });
});

export const getOne = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(String(req.params.id), currentUser(req));
  res.json({ success: true, data: { order } });
});

export const cancel = asyncHandler(async (req, res) => {
  const order = await orderService.cancelMyOrder(String(req.params.id), currentUser(req).id);
  res.json({ success: true, data: { order } });
});

// Admin
export const listAll = asyncHandler(async (req, res) => {
  const status = ORDER_STATUSES.includes(req.query.status as OrderStatus)
    ? (req.query.status as OrderStatus)
    : undefined;

  const orders = await orderService.listAllOrders(status);
  res.json({ success: true, data: { orders } });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(String(req.params.id), req.body.status);
  res.json({ success: true, data: { order } });
});
