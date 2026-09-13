import * as authService from '../services/auth.service.js';

export async function register(req, res) {
  const data = await authService.register(req.validated.body);
  res.status(201).json({ success: true, data });
}

export async function login(req, res) {
  const data = await authService.login(req.validated.body);
  res.json({ success: true, data });
}

export async function logout(req, res) {
  await authService.logout(req.user);
  res.status(204).send();
}

export async function changePassword(req, res) {
  await authService.changePassword(req.user, req.validated.body);
  res.status(204).send();
}
