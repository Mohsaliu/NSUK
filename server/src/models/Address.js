import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  label: { type: String, required: true, trim: true, maxlength: 40 },
  address: { type: String, required: true, trim: true, maxlength: 240 },
  instructions: { type: String, trim: true, maxlength: 300, default: '' },
  latitude: Number,
  longitude: Number,
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

addressSchema.index({ user: 1, createdAt: -1 });
export const Address = mongoose.model('Address', addressSchema);
