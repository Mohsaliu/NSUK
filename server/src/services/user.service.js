import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { getPagination, pageMeta } from '../utils/pagination.js';

export async function getProfile(userId) {
  const [user, ordersCount] = await Promise.all([
    User.findById(userId),
    Order.countDocuments({ user: userId }),
  ]);
  if (!user) throw new ApiError(404, 'User not found');
  return { ...user.toJSON(), ordersCount };
}

export async function updateProfile(userId, input) {
  const user = await User.findByIdAndUpdate(userId, input, { returnDocument: 'after', runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

export async function updateNotificationSettings(userId, settings) {
  const updates = Object.fromEntries(Object.entries(settings).map(([key, value]) => [`notificationSettings.${key}`, value]));
  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { returnDocument: 'after', runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user.notificationSettings;
}

export async function listUsers(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.role) filter.role = query.role;
  const search = query.search?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { username: { $regex: search, $options: 'i' } },
  ];
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, page, limit) };
}

export async function setUserStatus(userId, isActive) {
  const user = await User.findByIdAndUpdate(userId, { isActive, $inc: { tokenVersion: 1 } }, { returnDocument: 'after' });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}
