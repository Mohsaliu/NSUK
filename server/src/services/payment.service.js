import crypto from 'node:crypto';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Product } from '../models/Product.js';
import { Promo } from '../models/Promo.js';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { createNotification } from './notification.service.js';

function createReference() {
  return `droply_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

async function markPaid(payment, providerResponse = {}) {
  payment.status = 'successful';
  payment.paidAt = new Date();
  payment.providerResponse = providerResponse;
  await payment.save();
  const order = await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' }, { returnDocument: 'after' });
  await createNotification(order.user, 'order', 'Payment confirmed', `Payment for order ${order.orderNumber} was successful.`, { orderId: order.id });
  return { payment, order };
}

export async function initializePayment(userId, orderId, callbackUrl) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.paymentStatus === 'paid') throw new ApiError(409, 'Order has already been paid');
  const existing = await Payment.findOne({ order: orderId });
  if (existing) return existing;

  const reference = createReference();
  if (order.paymentMethod === 'wallet') {
    const user = await User.findOneAndUpdate(
      { _id: userId, walletBalance: { $gte: order.total } },
      { $inc: { walletBalance: -order.total } },
      { returnDocument: 'after' },
    );
    if (!user) throw new ApiError(400, 'Insufficient wallet balance');
    const payment = await Payment.create({ user: userId, order: orderId, provider: 'wallet', reference, amount: order.total });
    return (await markPaid(payment, { source: 'wallet' })).payment;
  }

  if (order.paymentMethod === 'cash') {
    return Payment.create({ user: userId, order: orderId, provider: 'cash', reference, amount: order.total });
  }

  if (env.paymentProvider === 'mock') {
    const payment = await Payment.create({ user: userId, order: orderId, provider: 'mock', reference, amount: order.total });
    return (await markPaid(payment, { source: 'mock' })).payment;
  }

  if (!env.paystackSecretKey) throw new ApiError(503, 'Payment provider is not configured');
  const user = await User.findById(userId);
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.paystackSecretKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user.email,
      amount: order.total * 100,
      currency: 'NGN',
      reference,
      callback_url: callbackUrl,
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.status) throw new ApiError(502, 'Unable to initialize payment');
  return Payment.create({
    user: userId,
    order: orderId,
    provider: 'paystack',
    reference,
    amount: order.total,
    authorizationUrl: payload.data.authorization_url,
    providerResponse: payload.data,
  });
}

export async function verifyPayment(userId, reference) {
  const payment = await Payment.findOne({ reference, user: userId });
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.status === 'successful') return payment;
  if (payment.provider !== 'paystack' || !env.paystackSecretKey) throw new ApiError(400, 'Payment cannot be verified with Paystack');

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${env.paystackSecretKey}` },
  });
  const payload = await response.json();
  if (!response.ok || payload.data?.status !== 'success' || payload.data.amount !== payment.amount * 100) {
    payment.status = 'failed';
    payment.providerResponse = payload;
    await payment.save();
    throw new ApiError(400, 'Payment verification failed');
  }
  return (await markPaid(payment, payload.data)).payment;
}

export async function processPaystackWebhook(rawBody, signature) {
  if (!env.paystackSecretKey) throw new ApiError(503, 'Payment provider is not configured');
  const expected = crypto.createHmac('sha512', env.paystackSecretKey).update(rawBody).digest('hex');
  const receivedBuffer = Buffer.from(signature || '');
  const expectedBuffer = Buffer.from(expected);
  const valid = receivedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  if (!valid) throw new ApiError(401, 'Invalid webhook signature');
  const event = JSON.parse(rawBody.toString('utf8'));
  if (event.event !== 'charge.success') return;
  const payment = await Payment.findOne({ reference: event.data.reference });
  if (payment && payment.status !== 'successful' && event.data.amount === payment.amount * 100) {
    await markPaid(payment, event.data);
  }
}

export function listPayments(userId) {
  return Payment.find({ user: userId }).populate('order', 'orderNumber total status').sort({ createdAt: -1 });
}

export async function refundPayment(reference, reason = '') {
  const payment = await Payment.findOne({ reference }).populate('order');
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.status !== 'successful') throw new ApiError(409, 'Only successful payments can be refunded');

  if (payment.provider === 'paystack') {
    if (!env.paystackSecretKey) throw new ApiError(503, 'Payment provider is not configured');
    const response = await fetch('https://api.paystack.co/refund', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.paystackSecretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: payment.reference, amount: payment.amount * 100, customer_note: reason || undefined }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.status) throw new ApiError(502, 'Payment provider rejected the refund');
    payment.providerResponse = payload.data;
  } else if (payment.provider === 'wallet') {
    await User.updateOne({ _id: payment.user }, { $inc: { walletBalance: payment.amount } });
  }

  payment.status = 'refunded';
  await payment.save();
  const order = payment.order;
  if (order.rewardPointsAwarded > 0) {
    await User.updateOne(
      { _id: order.user },
      [{ $set: { rewardPoints: { $max: [0, { $subtract: ['$rewardPoints', order.rewardPointsAwarded] }] } } }],
      { updatePipeline: true },
    );
    order.rewardPointsAwarded = 0;
  }
  order.paymentStatus = 'refunded';
  if (!['delivered', 'cancelled'].includes(order.status)) {
    if (!order.inventoryRestored) {
      await Promise.all(order.items.map((item) => Product.updateOne(
        { _id: item.product, inventory: { $ne: null } },
        { $inc: { inventory: item.quantity } },
      )));
      order.inventoryRestored = true;
    }
    if (order.promoCode) await Promo.updateOne({ code: order.promoCode, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
    order.status = 'cancelled';
    order.cancellationReason = reason || 'Payment refunded';
    order.timeline.push({ status: 'cancelled', note: order.cancellationReason });
  } else {
    order.timeline.push({ status: order.status, note: reason || 'Payment refunded' });
  }
  await order.save();
  await createNotification(order.user, 'order', 'Payment refunded', `Payment for order ${order.orderNumber} has been refunded.`, { orderId: order.id });
  return payment;
}
