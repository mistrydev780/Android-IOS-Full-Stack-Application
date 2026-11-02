import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';
import type { UserRole } from '../models/user.model';

export type TokenPayload = {
  sub: string;
  role: UserRole;
};

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }

  return { sub: decoded.sub, role: decoded.role as UserRole };
}
