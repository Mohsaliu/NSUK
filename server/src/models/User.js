import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const notificationSettingsSchema = new mongoose.Schema({
  push: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  orderUpdates: { type: Boolean, default: true },
  promotions: { type: Boolean, default: true },
  deliveryAlerts: { type: Boolean, default: true },
  rewards: { type: Boolean, default: true },
  appUpdates: { type: Boolean, default: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  passwordHash: { type: String, required: true, select: false },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'merchant', 'rider', 'admin'], default: 'customer', index: true },
  walletBalance: { type: Number, min: 0, default: 0 },
  rewardPoints: { type: Number, min: 0, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  notificationSettings: { type: notificationSettingsSchema, default: () => ({}) },
  isActive: { type: Boolean, default: true },
  tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toJSON = function toJSON() {
  const object = this.toObject();
  delete object.passwordHash;
  delete object.tokenVersion;
  delete object.__v;
  return object;
};

export const User = mongoose.model('User', userSchema);
