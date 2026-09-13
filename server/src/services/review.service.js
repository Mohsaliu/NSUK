import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';
import { ApiError } from '../utils/apiError.js';
import { getPagination, pageMeta } from '../utils/pagination.js';

export async function listProductReviews(productId, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { product: productId, isVisible: true };
  const [items, total] = await Promise.all([
    Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, page, limit) };
}

export async function createReview(userId, input) {
  const order = await Order.findOne({ _id: input.order, user: userId, status: 'delivered', 'items.product': input.product });
  if (!order) throw new ApiError(400, 'Only delivered products you ordered can be reviewed');
  const review = await Review.create({ ...input, user: userId });
  const stats = await Review.aggregate([
    { $match: { product: review.product, isVisible: true } },
    { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats[0]) await Product.updateOne({ _id: review.product }, { rating: stats[0].average * 2, reviewsCount: stats[0].count });
  return review;
}

export async function removeReview(userId, reviewId, isAdmin = false) {
  const filter = isAdmin ? { _id: reviewId } : { _id: reviewId, user: userId };
  const review = await Review.findOneAndDelete(filter);
  if (!review) throw new ApiError(404, 'Review not found');
}
