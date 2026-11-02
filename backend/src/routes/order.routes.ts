import { Router } from 'express';

import * as orderController from '../controllers/order.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

router.use(protect);

// Customer
router.post('/', validateBody(createOrderSchema), orderController.create);
router.get('/mine', orderController.mine);
router.patch('/:id/cancel', orderController.cancel);

// Admin
router.get('/', authorize('admin'), orderController.listAll);
router.patch('/:id/status', authorize('admin'), validateBody(updateOrderStatusSchema), orderController.updateStatus);

// Owner or admin
router.get('/:id', orderController.getOne);

export default router;
