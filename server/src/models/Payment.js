import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  provider: { type: String, enum: ['mock', 'paystack', 'wallet', 'cash'], required: true },
  reference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'NGN' },
  status: { type: String, enum: ['initialized', 'successful', 'failed', 'refunded'], default: 'initialized' },
  authorizationUrl: { type: String, default: '' },
  providerResponse: { type: mongoose.Schema.Types.Mixed, select: false },
  paidAt: { type: Date, default: null },
}, { timestamps: true });

paymentSchema.methods.toJSON = function toJSON() {
  const object = this.toObject();
  delete object.providerResponse;
  delete object.__v;
  return object;
};

export const Payment = mongoose.model('Payment', paymentSchema);
