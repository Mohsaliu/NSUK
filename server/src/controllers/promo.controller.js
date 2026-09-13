import * as service from '../services/promo.service.js';

export async function validate(req, res) {
  res.json({ success: true, data: await service.validatePromo(req.validated.body.code, req.validated.body.subtotal, req.user.id) });
}
export async function list(req, res) { res.json({ success: true, data: await service.listPromos() }); }
export async function create(req, res) { res.status(201).json({ success: true, data: await service.createPromo(req.validated.body) }); }
export async function update(req, res) { res.json({ success: true, data: await service.updatePromo(req.params.id, req.validated.body) }); }
export async function remove(req, res) { await service.removePromo(req.params.id); res.status(204).send(); }
