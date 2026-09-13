import { Reward, RewardRedemption } from '../models/Reward.js';
import { Promo } from '../models/Promo.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { createNotification } from './notification.service.js';

export function listRewards() {
  return Reward.find({ isActive: true }).populate('promo').sort({ pointsCost: 1 });
}

export async function redeemReward(userId, rewardId) {
  const reward = await Reward.findOne({ _id: rewardId, isActive: true }).populate('promo');
  if (!reward) throw new ApiError(404, 'Reward not found');
  if (await RewardRedemption.exists({ user: userId, reward: rewardId })) throw new ApiError(409, 'This reward has already been claimed');
  const user = await User.findOneAndUpdate(
    { _id: userId, rewardPoints: { $gte: reward.pointsCost } },
    { $inc: { rewardPoints: -reward.pointsCost } },
    { returnDocument: 'after' },
  );
  if (!user) throw new ApiError(400, 'Insufficient reward points');
  let claimedPromo = null;
  let redemption;
  try {
    if (reward.promo) {
      const code = `RWD-${Date.now().toString(36)}-${userId.toString().slice(-4)}`.toUpperCase();
      claimedPromo = await Promo.create({
        owner: userId,
        code,
        description: reward.promo.description || reward.description,
        discountType: reward.promo.discountType,
        discountValue: reward.promo.discountValue,
        minimumSubtotal: reward.promo.minimumSubtotal,
        maximumDiscount: reward.promo.maximumDiscount,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 1,
        perUserLimit: 1,
        isActive: true,
      });
    }
    redemption = await RewardRedemption.create({
      user: userId,
      reward: rewardId,
      pointsSpent: reward.pointsCost,
      promoCode: claimedPromo?.code || '',
    });
  } catch (error) {
    await User.updateOne({ _id: userId }, { $inc: { rewardPoints: reward.pointsCost } });
    if (claimedPromo) await Promo.deleteOne({ _id: claimedPromo.id });
    throw error;
  }
  await createNotification(userId, 'reward', 'Reward claimed', `${reward.name} has been added to your rewards.`, { rewardId });
  return { redemption, reward, claimedPromo, remainingPoints: user.rewardPoints };
}

export function listRedemptions(userId) {
  return RewardRedemption.find({ user: userId }).populate({ path: 'reward', populate: 'promo' }).sort({ createdAt: -1 });
}

export function createReward(input) { return Reward.create(input); }

export async function updateReward(id, input) {
  const reward = await Reward.findByIdAndUpdate(id, input, { returnDocument: 'after', runValidators: true });
  if (!reward) throw new ApiError(404, 'Reward not found');
  return reward;
}

export async function removeReward(id) {
  const reward = await Reward.findByIdAndUpdate(id, { isActive: false }, { returnDocument: 'after' });
  if (!reward) throw new ApiError(404, 'Reward not found');
  return reward;
}
