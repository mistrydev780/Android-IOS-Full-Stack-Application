import type { ErrorRequestHandler, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof jwt.TokenExpiredError) {
    error = ApiError.unauthorized('Session expired, please sign in again');
  } else if (err instanceof jwt.JsonWebTokenError) {
    error = ApiError.unauthorized('Invalid session, please sign in again');
  } else if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid ${err.path}`);
  } else if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    error = ApiError.badRequest(errors[0]?.message ?? 'Validation failed', errors);
  } else if (isDuplicateKeyError(err)) {
    error = ApiError.conflict('An account with this email already exists');
  } else if (err?.type === 'entity.parse.failed') {
    error = ApiError.badRequest('Malformed JSON body');
  } else {
    console.error('💥 Unexpected error:', err);
    error = new ApiError(500, 'Something went wrong, please try again');
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(!env.isProduction && error.statusCode === 500 && { stack: (err as Error)?.stack }),
  });
};

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;
}
