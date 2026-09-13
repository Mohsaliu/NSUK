import { Promo } from '../models/Promo.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { calculateDiscount } from './pricing.service.js';

export async function validatePromo(code, subtotal, userId) {
  const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });
  const now = new Date();
  if (!promo || promo.startsAt > now || promo.expiresAt < now) throw new ApiError(400, 'Promo code is invalid or expired');
  if (promo.owner && promo.owner.toString() !== userId.toString()) throw new ApiError(400, 'Promo code is not assigned to this account');
  if (subtotal < promo.minimumSubtotal) throw new ApiError(400, `A subtotal of at least ₦${promo.minimumSubtotal} is required`);
  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) throw new ApiError(400, 'Promo code usage limit has been reached');
  const userUses = await Order.countDocuments({ user: userId, promoCode: promo.code, status: { $ne: 'cancelled' } });
  if (userUses >= promo.perUserLimit) throw new ApiError(400, 'You have already used this promo code');
  return { promo, discount: calculateDiscount(promo, subtotal) };
}

export function listPromos() { return Promo.find().sort({ createdAt: -1 }); }
export function createPromo(input) { return Promo.create({ ...input, code: input.code.toUpperCase() }); }

export async function updatePromo(id, input) {
  if (input.code) input.code = input.code.toUpperCase();
  const promo = await Promo.findByIdAndUpdate(id, input, { returnDocument: 'after', runValidators: true });
  if (!promo) throw new ApiError(404, 'Promo not found');
  return promo;
}

export async function removePromo(id) {
  const promo = await Promo.findByIdAndDelete(id);
  if (!promo) throw new ApiError(404, 'Promo not found');
}
