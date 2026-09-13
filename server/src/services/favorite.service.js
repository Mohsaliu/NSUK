import { Favorite } from '../models/Favorite.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';

export function listFavorites(userId) {
  return Favorite.find({ user: userId })
    .populate({ path: 'product', populate: [{ path: 'store', select: 'name slug logo' }, { path: 'category' }] })
    .sort({ createdAt: -1 });
}

export async function addFavorite(userId, productId) {
  if (!(await Product.exists({ _id: productId, isAvailable: true }))) throw new ApiError(404, 'Product not found');
  return Favorite.findOneAndUpdate(
    { user: userId, product: productId },
    { $setOnInsert: { user: userId, product: productId } },
    { upsert: true, returnDocument: 'after' },
  ).populate('product');
}

export async function removeFavorite(userId, productId) {
  const result = await Favorite.deleteOne({ user: userId, product: productId });
  if (!result.deletedCount) throw new ApiError(404, 'Favorite not found');
}
