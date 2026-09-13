import { Message } from '../models/Message.js';
import { Order } from '../models/Order.js';
import { Store } from '../models/Store.js';
import { ApiError } from '../utils/apiError.js';
import { createNotification } from './notification.service.js';

async function accessibleOrder(actor, orderId) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  const isCustomer = order.user.toString() === actor.id;
  const isRider = order.rider?.toString() === actor.id;
  const isMerchant = actor.role === 'merchant' && await Store.exists({ _id: order.store, owner: actor.id });
  if (actor.role !== 'admin' && !isCustomer && !isRider && !isMerchant) throw new ApiError(403, 'You cannot access messages for this order');
  return order;
}

export async function listMessages(actor, orderId) {
  await accessibleOrder(actor, orderId);
  await Message.updateMany({ order: orderId, readBy: { $ne: actor.id } }, { $addToSet: { readBy: actor.id } });
  return Message.find({ order: orderId }).populate('sender', 'name avatar role').sort({ createdAt: 1 });
}

export async function sendMessage(actor, orderId, text) {
  const order = await accessibleOrder(actor, orderId);
  const message = await Message.create({ order: orderId, sender: actor.id, message: text, readBy: [actor.id] });
  const recipient = order.user.toString() === actor.id ? order.rider : order.user;
  if (recipient) {
    await createNotification(recipient, 'delivery', 'New order message', `You have a new message about order ${order.orderNumber}.`, { orderId });
  }
  return message.populate('sender', 'name avatar role');
}
