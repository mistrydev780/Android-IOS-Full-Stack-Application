import * as authService from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({ success: true, data: result });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();

  const user = await authService.getUserById(req.user.id);

  res.status(200).json({ success: true, data: { user } });
});

// JWTs are stateless: the client discards its token. This endpoint exists so
// the client has a single place to call (and for future token revocation).
export const logout = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, message: 'Signed out' });
});
