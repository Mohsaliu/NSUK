import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const addressSnapshotSchema = new mongoose.Schema({
  label: String,
  address: { type: String, required: true },
  instructions: String,
  latitude: Number,
  longitude: Number,
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, default: '' },
  at: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  items: { type: [orderItemSchema], required: true },
  deliveryAddress: { type: addressSnapshotSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 },
  promoCode: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'on_the_way', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['card', 'wallet', 'cash'], required: true },
  timeline: { type: [timelineSchema], default: () => [{ status: 'pending', note: 'Order placed' }] },
  cancellationReason: { type: String, default: '' },
  deliveredAt: { type: Date, default: null },
  rewardPointsAwarded: { type: Number, min: 0, default: 0 },
  inventoryRestored: { type: Boolean, default: false },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
export const Order = mongoose.model('Order', orderSchema);
