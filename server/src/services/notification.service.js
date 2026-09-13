import { Notification } from '../models/Notification.js';
import { getPagination, pageMeta } from '../utils/pagination.js';

export function createNotification(user, type, title, message, data = {}) {
  return Notification.create({ user, type, title, message, data });
}

export async function listNotifications(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };
  if (query.unread === 'true') filter.readAt = null;
  const [items, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, readAt: null }),
  ]);
  return { items, unreadCount, meta: pageMeta(total, page, limit) };
}

export function markNotificationRead(userId, notificationId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { readAt: new Date() },
    { returnDocument: 'after' },
  );
}

export async function markAllNotificationsRead(userId) {
  await Notification.updateMany({ user: userId, readAt: null }, { readAt: new Date() });
}
