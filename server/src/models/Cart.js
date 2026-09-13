import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, max: 99 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  items: { type: [cartItemSchema], default: [] },
  promo: { type: mongoose.Schema.Types.ObjectId, ref: 'Promo', default: null },
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
