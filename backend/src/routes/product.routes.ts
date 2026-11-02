import { Router } from 'express';

import * as productController from '../controllers/product.controller';
import { authorize, optionalAuth, protect } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { productSchema, updateProductSchema } from '../validators/product.validator';

const router = Router();

// Public catalog (admins may pass ?all=true to include hidden products)
router.get('/', optionalAuth, productController.list);
router.get('/:id', optionalAuth, productController.getOne);

// Admin
router.post('/', protect, authorize('admin'), validateBody(productSchema), productController.create);
router.patch('/:id', protect, authorize('admin'), validateBody(updateProductSchema), productController.update);
router.delete('/:id', protect, authorize('admin'), productController.remove);

export default router;
