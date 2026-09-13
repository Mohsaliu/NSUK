import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  legacyId: { type: String, unique: true, sparse: true, index: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  ingredients: { type: [String], default: [] },
  nutritionalFacts: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  emoji: { type: String, default: '' },
  unit: { type: String, default: '' },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  reviewsCount: { type: Number, min: 0, default: 0 },
  isPopular: { type: Boolean, default: false, index: true },
  isPremium: { type: Boolean, default: false, index: true },
  isAvailable: { type: Boolean, default: true },
  inventory: { type: Number, min: 0, default: null },
}, { timestamps: true });

productSchema.index({ store: 1, slug: 1 }, { unique: true });
productSchema.index({ name: 'text', description: 'text' });
export const Product = mongoose.model('Product', productSchema);
