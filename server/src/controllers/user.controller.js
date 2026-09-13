import * as userService from '../services/user.service.js';

export async function me(req, res) {
  res.json({ success: true, data: await userService.getProfile(req.user.id) });
}

export async function updateMe(req, res) {
  res.json({ success: true, data: await userService.updateProfile(req.user.id, req.validated.body) });
}

export async function updateNotificationSettings(req, res) {
  res.json({ success: true, data: await userService.updateNotificationSettings(req.user.id, req.validated.body) });
}

export async function listUsers(req, res) {
  res.json({ success: true, data: await userService.listUsers(req.query) });
}

export async function setUserStatus(req, res) {
  res.json({ success: true, data: await userService.setUserStatus(req.params.id, req.validated.body.isActive) });
}
