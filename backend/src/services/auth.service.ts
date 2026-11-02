import { User, toPublicUser, type PublicUser } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { signAccessToken } from '../utils/jwt';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

export type AuthResult = {
  user: PublicUser;
  token: string;
};

export async function register(input: RegisterInput): Promise<AuthResult> {
  const exists = await User.exists({ email: input.email });

  if (exists) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create(input);

  return {
    user: toPublicUser(user),
    token: signAccessToken({ sub: user.id as string, role: user.role }),
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email }).select('+password');

  // Same message for unknown email and wrong password (no account enumeration)
  if (!user || !(await user.comparePassword(input.password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return {
    user: toPublicUser(user),
    token: signAccessToken({ sub: user.id as string, role: user.role }),
  };
}

export async function getUserById(id: string): Promise<PublicUser> {
  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return toPublicUser(user);
}
