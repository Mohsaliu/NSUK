import * as service from '../services/address.service.js';

export async function list(req, res) {
  res.json({ success: true, data: await service.listAddresses(req.user.id) });
}

export async function create(req, res) {
  res.status(201).json({ success: true, data: await service.createAddress(req.user.id, req.validated.body) });
}

export async function update(req, res) {
  res.json({ success: true, data: await service.updateAddress(req.user.id, req.params.id, req.validated.body) });
}

export async function remove(req, res) {
  await service.removeAddress(req.user.id, req.params.id);
  res.status(204).send();
}

export async function setDefault(req, res) {
  res.json({ success: true, data: await service.setDefaultAddress(req.user.id, req.params.id) });
}
