import * as service from '../services/notification.service.js';
import { ApiError } from '../utils/apiError.js';

export async function list(req, res) { res.json({ success: true, data: await service.listNotifications(req.user.id, req.query) }); }
export async function markRead(req, res) {
  const notification = await service.markNotificationRead(req.user.id, req.params.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.json({ success: true, data: notification });
}
export async function markAllRead(req, res) { await service.markAllNotificationsRead(req.user.id); res.status(204).send(); }
