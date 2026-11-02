import * as adminService from '../services/admin.service';
import { asyncHandler } from '../utils/asyncHandler';

export const stats = asyncHandler(async (_req, res) => {
  const data = await adminService.getDashboardStats();
  res.json({ success: true, data });
});
