import * as cartService from '../services/cart.service.js';

export async function getCart(req, res) {
  res.json({ success: true, data: await cartService.serializeCart(req.user.id) });
}

export async function addItem(req, res) {
  const { productId, quantity, replaceExistingStore } = req.validated.body;
  await cartService.addItem(req.user.id, productId, quantity, replaceExistingStore);
  res.status(201).json({ success: true, data: await cartService.serializeCart(req.user.id) });
}

export async function updateItem(req, res) {
  await cartService.setItemQuantity(req.user.id, req.params.productId, req.validated.body.quantity);
  res.json({ success: true, data: await cartService.serializeCart(req.user.id) });
}

export async function removeItem(req, res) {
  await cartService.removeItem(req.user.id, req.params.productId);
  res.json({ success: true, data: await cartService.serializeCart(req.user.id) });
}

export async function clear(req, res) {
  await cartService.clearCart(req.user.id);
  res.status(204).send();
}

export async function applyPromo(req, res) {
  res.json({ success: true, data: await cartService.applyPromo(req.user.id, req.validated.body.code) });
}

export async function removePromo(req, res) {
  res.json({ success: true, data: await cartService.removePromo(req.user.id) });
}
