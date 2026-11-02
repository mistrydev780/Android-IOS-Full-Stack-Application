import type { UserRole } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      // Set by the `protect` middleware for authenticated requests
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
