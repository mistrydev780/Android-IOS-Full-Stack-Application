import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import * as authController from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

// Slow down brute-force attempts on credential endpoints
const credentialsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again in a few minutes' },
});

router.post('/register', credentialsLimiter, validateBody(registerSchema), authController.register);
router.post('/login', credentialsLimiter, validateBody(loginSchema), authController.login);
router.get('/me', protect, authController.me);
router.post('/logout', protect, authController.logout);

export default router;
