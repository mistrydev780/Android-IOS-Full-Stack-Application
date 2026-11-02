import { Router } from 'express';
import mongoose from 'mongoose';

import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;
