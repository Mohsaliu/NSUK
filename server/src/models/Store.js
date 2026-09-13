import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  address: { type: String, required: true, trim: true },
  coverImage: { type: String, default: '' },
  logo: { type: String, default: '' },
  openingHours: { type: String, default: '' },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewsCount: { type: Number, min: 0, default: 0 },
  deliveryTimeMinutes: { type: Number, min: 0, default: 30 },
  deliveryFee: { type: Number, min: 0, default: 0 },
  type: { type: String, required: true, trim: true },
  isOpen: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

storeSchema.index({ name: 'text', address: 'text', type: 'text' });
export const Store = mongoose.model('Store', storeSchema);
