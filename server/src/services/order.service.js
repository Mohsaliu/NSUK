import { Address } from '../models/Address.js';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { Promo } from '../models/Promo.js';
import { Product } from '../models/Product.js';
import { Store } from '../models/Store.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { createOrderNumber } from '../utils/orderNumber.js';
import { getPagination, pageMeta } from '../utils/pagination.js';
import { calculateTotals } from './pricing.service.js';
import { validatePromo } from './promo.service.js';
import { createNotification } from './notification.service.js';

const transitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['on_the_way', 'cancelled'],
  on_the_way: ['delivered'],
  delivered: [],
  cancelled: [],
};

async function restoreInventory(order) {
  if (order.inventoryRestored) return;
  await Promise.all(order.items.map((item) => Product.updateOne(
    { _id: item.product, inventory: { $ne: null } },
    { $inc: { inventory: item.quantity } },
  )));
  order.inventoryRestored = true;
}

export async function createOrder(userId, { addressId, paymentMethod }) {
  const [cart, address] = await Promise.all([
    Cart.findOne({ user: userId }).populate('items.product').populate('store').populate('promo'),
    Address.findOne({ _id: addressId, user: userId }),
  ]);
  if (!cart?.items.length || !cart.store) throw new ApiError(400, 'Cart is empty');
  if (!address) throw new ApiError(404, 'Delivery address not found');
  if (!cart.store.isActive || !cart.store.isOpen) throw new ApiError(400, 'Store is currently unavailable');
  if (cart.items.some((item) => !item.product?.isAvailable)) throw new ApiError(400, 'One or more cart products are unavailable');

  const priceItems = cart.items.map((item) => ({ price: item.product.price, quantity: item.quantity }));
  let promo = null;
  if (cart.promo) {
    const subtotal = priceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    promo = (await validatePromo(cart.promo.code, subtotal, userId)).promo;
  }
  const totals = calculateTotals({ items: priceItems, deliveryFee: cart.store.deliveryFee, promo });

  const reservations = [];
  for (const item of cart.items) {
    if (item.product.inventory == null) continue;
    const reserved = await Product.updateOne(
      { _id: item.product.id, inventory: { $gte: item.quantity } },
      { $inc: { inventory: -item.quantity } },
    );
    if (!reserved.modifiedCount) {
      await Promise.all(reservations.map((entry) => Product.updateOne({ _id: entry.product }, { $inc: { inventory: entry.quantity } })));
      throw new ApiError(409, `${item.product.name} no longer has enough stock`);
    }
    reservations.push({ product: item.product.id, quantity: item.quantity });
  }

  let orderNumber;
  do { orderNumber = createOrderNumber(); } while (await Order.exists({ orderNumber }));
  let order;
  try {
    order = await Order.create({
      orderNumber,
      user: userId,
      store: cart.store.id,
      items: cart.items.map((item) => ({
        product: item.product.id,
        name: item.product.name,
        image: item.product.image,
        unitPrice: item.product.price,
        quantity: item.quantity,
        lineTotal: item.product.price * item.quantity,
      })),
      deliveryAddress: {
        label: address.label,
        address: address.address,
        instructions: address.instructions,
        latitude: address.latitude,
        longitude: address.longitude,
      },
      ...totals,
      promoCode: promo?.code || '',
      paymentMethod,
    });
  } catch (error) {
    await Promise.all(reservations.map((entry) => Product.updateOne({ _id: entry.product }, { $inc: { inventory: entry.quantity } })));
    throw error;
  }

  await Cart.updateOne({ _id: cart.id }, { items: [], store: null, promo: null });
  if (promo) await Promo.updateOne({ _id: promo.id }, { $inc: { usedCount: 1 } });
  await createNotification(userId, 'order', 'Order placed', `Your order ${order.orderNumber} has been received.`, { orderId: order.id });
  return order.populate('store', 'name slug logo');
}

async function scopeFor(actor) {
  if (actor.role === 'customer') return { user: actor.id };
  if (actor.role === 'rider') return { rider: actor.id };
  if (actor.role === 'merchant') {
    const storeIds = await Store.find({ owner: actor.id }).distinct('_id');
    return { store: { $in: storeIds } };
  }
  return {};
}

export async function listOrders(actor, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = await scopeFor(actor);
  if (query.status) filter.status = query.status;
  if (query.store) filter.store = query.store;
  const [items, total] = await Promise.all([
    Order.find(filter).populate('store', 'name slug logo').populate('rider', 'name phone avatar rating').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, page, limit) };
}

export async function getOrder(actor, orderId) {
  const order = await Order.findOne({ _id: orderId, ...(await scopeFor(actor)) })
    .populate('store', 'name slug logo address')
    .populate('rider', 'name phone avatar rating')
    .populate('user', 'name phone');
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
}

export async function updateOrderStatus(actor, orderId, status, note = '') {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (actor.role === 'rider' && order.rider?.toString() !== actor.id) throw new ApiError(403, 'This order is not assigned to you');
  if (actor.role === 'merchant' && !(await Store.exists({ _id: order.store, owner: actor.id }))) throw new ApiError(403, 'This order does not belong to your store');
  if (actor.role === 'merchant' && !['confirmed', 'preparing', 'ready_for_pickup', 'cancelled'].includes(status)) {
    throw new ApiError(403, 'Merchants cannot set this delivery status');
  }
  if (actor.role === 'rider' && !['on_the_way', 'delivered'].includes(status)) {
    throw new ApiError(403, 'Riders can only update delivery progress');
  }
  if (status === 'cancelled' && order.paymentStatus === 'paid') {
    throw new ApiError(409, 'Paid orders must be refunded before cancellation');
  }
  if (!transitions[order.status].includes(status)) throw new ApiError(409, `Order cannot move from ${order.status} to ${status}`);
  order.status = status;
  order.timeline.push({ status, note });
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.rewardPointsAwarded = Math.floor(order.total / 100);
    await User.updateOne({ _id: order.user }, { $inc: { rewardPoints: order.rewardPointsAwarded } });
  }
  if (status === 'cancelled') {
    await restoreInventory(order);
    if (order.promoCode) await Promo.updateOne({ code: order.promoCode, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
  }
  await order.save();
  await createNotification(
    order.user,
    status === 'on_the_way' ? 'delivery' : 'order',
    'Order update',
    `Order ${order.orderNumber} is now ${status.replaceAll('_', ' ')}.`,
    { orderId: order.id, status },
  );
  return order;
}

export async function cancelOrder(userId, orderId, reason) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (!['pending', 'confirmed'].includes(order.status)) throw new ApiError(409, 'This order can no longer be cancelled');
  if (order.paymentStatus === 'paid') throw new ApiError(409, 'Paid orders require a refund before cancellation');
  order.status = 'cancelled';
  order.cancellationReason = reason;
  order.timeline.push({ status: 'cancelled', note: reason });
  await restoreInventory(order);
  if (order.promoCode) await Promo.updateOne({ code: order.promoCode, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
  await order.save();
  return order;
}

export async function assignRider(orderId, riderId) {
  if (!(await User.exists({ _id: riderId, role: 'rider', isActive: true }))) throw new ApiError(400, 'Rider is not active or does not exist');
  const order = await Order.findByIdAndUpdate(orderId, { rider: riderId }, { returnDocument: 'after', runValidators: true })
    .populate('rider', 'name phone avatar rating');
  if (!order) throw new ApiError(404, 'Order not found');
  await createNotification(riderId, 'delivery', 'New delivery assignment', `You have been assigned order ${order.orderNumber}.`, { orderId: order.id });
  return order;
}

export async function reorder(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  const requested = new Map(order.items.map((item) => [item.product.toString(), item.quantity]));
  const available = await Product.find({ _id: { $in: [...requested.keys()] }, store: order.store, isAvailable: true });
  if (!available.length) throw new ApiError(409, 'None of the products in this order are currently available');
  const items = available.map((product) => ({ product: product.id, quantity: requested.get(product.id) }));
  await Cart.findOneAndUpdate(
    { user: userId },
    { user: userId, store: order.store, items, promo: null },
    { upsert: true, returnDocument: 'after', runValidators: true },
  );
  return { added: items.length, unavailable: order.items.length - items.length };
}
