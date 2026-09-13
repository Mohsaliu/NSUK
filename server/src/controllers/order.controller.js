import * as service from '../services/order.service.js';
import { serializeCart } from '../services/cart.service.js';

export async function create(req, res) { res.status(201).json({ success: true, data: await service.createOrder(req.user.id, req.validated.body) }); }
export async function list(req, res) { res.json({ success: true, data: await service.listOrders(req.user, req.query) }); }
export async function get(req, res) { res.json({ success: true, data: await service.getOrder(req.user, req.params.id) }); }
export async function updateStatus(req, res) {
  const { status, note } = req.validated.body;
  res.json({ success: true, data: await service.updateOrderStatus(req.user, req.params.id, status, note) });
}
export async function cancel(req, res) { res.json({ success: true, data: await service.cancelOrder(req.user.id, req.params.id, req.validated.body.reason) }); }
export async function assignRider(req, res) { res.json({ success: true, data: await service.assignRider(req.params.id, req.validated.body.riderId) }); }
export async function reorder(req, res) {
  const result = await service.reorder(req.user.id, req.params.id);
  res.json({ success: true, data: { ...result, cart: await serializeCart(req.user.id) } });
}
