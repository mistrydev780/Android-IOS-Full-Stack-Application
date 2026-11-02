import type { RequestHandler } from 'express';

import { User, type UserRole } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyAccessToken } from '../utils/jwt';

function readBearerToken(header?: string) {
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : null;
}

// Requires a valid `Authorization: Bearer <token>` header
export const protect = asyncHandler(async (req, _res, next) => {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    throw ApiError.unauthorized('Please sign in to continue');
  }

  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.sub).select('_id role').lean();

  if (!user) {
    throw ApiError.unauthorized('Account no longer exists');
  }

  req.user = { id: String(user._id), role: user.role };
  next();
});

// Attaches req.user when a valid token is sent, but never rejects the request
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = readBearerToken(req.headers.authorization);

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub).select('_id role').lean();
      if (user) req.user = { id: String(user._id), role: user.role };
    } catch {
      // Invalid tokens are treated as anonymous
    }
  }

  next();
});

// Use after `protect`: allows only the given roles
export function authorize(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do this'));
    }
    next();
  };
}
