import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, trim: true, default: '' },
  discountType: { type: String, enum: ['fixed', 'percentage'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minimumSubtotal: { type: Number, min: 0, default: 0 },
  maximumDiscount: { type: Number, min: 0, default: null },
  startsAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, min: 1, default: null },
  usedCount: { type: Number, min: 0, default: 0 },
  perUserLimit: { type: Number, min: 1, default: 1 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Promo = mongoose.model('Promo', promoSchema);
