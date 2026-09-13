import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { calculateTotals } from './pricing.service.js';
import { validatePromo } from './promo.service.js';

async function loadCart(userId) {
  return Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  ).populate('items.product').populate('store').populate('promo');
}

export async function serializeCart(userId) {
  const cart = await loadCart(userId);
  const validItems = cart.items.filter((item) => item.product?.isAvailable);
  const priceItems = validItems.map((item) => ({ price: item.product.price, quantity: item.quantity }));
  const totals = calculateTotals({ items: priceItems, deliveryFee: cart.store?.deliveryFee || 0, promo: cart.promo });
  return { id: cart.id, store: cart.store, items: validItems, promo: cart.promo, ...totals };
}

export async function addItem(userId, productId, quantity = 1, replaceExistingStore = false) {
  const product = await Product.findOne({ _id: productId, isAvailable: true });
  if (!product) throw new ApiError(404, 'Product not found');
  const cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId });
  if (cart.store && cart.store.toString() !== product.store.toString()) {
    if (!replaceExistingStore) throw new ApiError(409, 'Cart contains items from another store', { code: 'CART_STORE_CONFLICT' });
    cart.items = [];
    cart.promo = null;
  }
  cart.store = product.store;
  const item = cart.items.find((entry) => entry.product.toString() === productId);
  const desiredQuantity = item ? Math.min(99, item.quantity + quantity) : quantity;
  if (product.inventory != null && desiredQuantity > product.inventory) throw new ApiError(409, 'Requested quantity is not available');
  if (item) item.quantity = desiredQuantity;
  else cart.items.push({ product: productId, quantity });
  await cart.save();
  return serializeCart(userId);
}

export async function setItemQuantity(userId, productId, quantity) {
  const [cart, product] = await Promise.all([
    Cart.findOne({ user: userId }),
    Product.findById(productId),
  ]);
  if (!cart) throw new ApiError(404, 'Cart not found');
  const item = cart.items.find((entry) => entry.product.toString() === productId);
  if (!item) throw new ApiError(404, 'Cart item not found');
  if (product?.inventory != null && quantity > product.inventory) throw new ApiError(409, 'Requested quantity is not available');
  if (quantity === 0) cart.items = cart.items.filter((entry) => entry.product.toString() !== productId);
  else item.quantity = quantity;
  if (!cart.items.length) { cart.store = null; cart.promo = null; }
  await cart.save();
  return serializeCart(userId);
}

export async function removeItem(userId, productId) { return setItemQuantity(userId, productId, 0); }

export async function clearCart(userId) {
  await Cart.findOneAndUpdate({ user: userId }, { items: [], store: null, promo: null });
  return serializeCart(userId);
}

export async function applyPromo(userId, code) {
  const snapshot = await serializeCart(userId);
  if (!snapshot.items.length) throw new ApiError(400, 'Cannot apply a promo to an empty cart');
  const { promo } = await validatePromo(code, snapshot.subtotal, userId);
  await Cart.findOneAndUpdate({ user: userId }, { promo: promo.id });
  return serializeCart(userId);
}

export async function removePromo(userId) {
  await Cart.findOneAndUpdate({ user: userId }, { promo: null });
  return serializeCart(userId);
}
