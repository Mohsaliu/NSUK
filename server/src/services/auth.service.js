import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { signAccessToken } from '../utils/tokens.js';

function sessionPayload(user) {
  return { user: user.toJSON(), accessToken: signAccessToken(user) };
}

export async function register(input) {
  const email = input.email.toLowerCase();
  const username = input.username.toLowerCase();
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, 'Email or username is already in use');

  const user = new User({ ...input, email, username, passwordHash: 'pending' });
  await user.setPassword(input.password);
  await user.save();
  return sessionPayload(user);
}

export async function login({ identifier, password }) {
  const normalized = identifier.toLowerCase();
  const user = await User.findOne({ $or: [{ email: normalized }, { username: normalized }] }).select('+passwordHash');
  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  return sessionPayload(user);
}

export async function logout(user) {
  user.tokenVersion += 1;
  await user.save();
}

export async function changePassword(user, { currentPassword, newPassword }) {
  const fullUser = await User.findById(user.id).select('+passwordHash');
  if (!(await fullUser.comparePassword(currentPassword))) throw new ApiError(400, 'Current password is incorrect');
  await fullUser.setPassword(newPassword);
  fullUser.tokenVersion += 1;
  await fullUser.save();
}
