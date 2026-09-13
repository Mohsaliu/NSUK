import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  pointsCost: { type: Number, required: true, min: 1 },
  promo: { type: mongoose.Schema.Types.ObjectId, ref: 'Promo', default: null },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const rewardRedemptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  pointsSpent: { type: Number, required: true },
  promoCode: { type: String, default: '' },
}, { timestamps: true });

rewardRedemptionSchema.index({ user: 1, reward: 1 }, { unique: true });

export const Reward = mongoose.model('Reward', rewardSchema);
export const RewardRedemption = mongoose.model('RewardRedemption', rewardRedemptionSchema);
