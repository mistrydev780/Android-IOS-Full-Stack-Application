import { Router } from 'express';

import * as adminController from '../controllers/admin.controller';
import { authorize, protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/stats', adminController.stats);

export default router;
