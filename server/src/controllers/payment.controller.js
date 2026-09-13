import * as service from '../services/payment.service.js';

export async function initialize(req, res) {
  const { orderId, callbackUrl } = req.validated.body;
  res.status(201).json({ success: true, data: await service.initializePayment(req.user.id, orderId, callbackUrl) });
}

export async function verify(req, res) { res.json({ success: true, data: await service.verifyPayment(req.user.id, req.params.reference) }); }
export async function list(req, res) { res.json({ success: true, data: await service.listPayments(req.user.id) }); }
export async function paystackWebhook(req, res) {
  await service.processPaystackWebhook(req.body, req.get('x-paystack-signature'));
  res.sendStatus(200);
}
export async function refund(req, res) {
  res.json({ success: true, data: await service.refundPayment(req.params.reference, req.validated.body.reason) });
}
