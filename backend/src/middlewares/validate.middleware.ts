import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { ApiError } from '../utils/ApiError';

// Validates and normalizes req.body against a Zod schema
export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(ApiError.badRequest(errors[0]?.message ?? 'Invalid request', errors));
    }

    req.body = result.data;
    next();
  };
}
