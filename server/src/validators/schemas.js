import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
const password = z.string().min(8).max(72).regex(/[A-Za-z]/, 'Password must contain a letter').regex(/\d/, 'Password must contain a number');
const body = (schema) => z.object({ body: schema, params: z.any(), query: z.any() });

export const registerSchema = body(z.object({
  name: z.string().trim().min(2).max(100),
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  password,
}));

export const loginSchema = body(z.object({ identifier: z.string().trim().min(3), password: z.string().min(1) }));
export const changePasswordSchema = body(z.object({ currentPassword: z.string().min(1), newPassword: password }));
export const profileSchema = body(z.object({
  name: z.string().trim().min(2).max(100).optional(),
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  phone: z.string().trim().max(30).optional(),
  avatar: z.string().trim().max(500).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required'));

export const notificationSettingsSchema = body(z.object({
  push: z.boolean().optional(),
  sms: z.boolean().optional(),
  orderUpdates: z.boolean().optional(),
  promotions: z.boolean().optional(),
  deliveryAlerts: z.boolean().optional(),
  rewards: z.boolean().optional(),
  appUpdates: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one setting is required'));

export const userStatusSchema = body(z.object({ isActive: z.boolean() }));

const addressFields = z.object({
  label: z.string().trim().min(1).max(40),
  address: z.string().trim().min(5).max(240),
  instructions: z.string().trim().max(300).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional(),
});
export const createAddressSchema = body(addressFields);
export const updateAddressSchema = body(addressFields.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required'));

const categoryFields = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).optional(),
  image: z.string().max(500).optional(),
  backgroundColor: z.string().max(20).optional(),
  textColor: z.string().max(20).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export const createCategorySchema = body(categoryFields);
export const updateCategorySchema = body(categoryFields.partial());

const storeFields = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).optional(),
  owner: objectId.optional(),
  address: z.string().trim().min(5).max(240),
  coverImage: z.string().max(500).optional(),
  logo: z.string().max(500).optional(),
  openingHours: z.string().max(100).optional(),
  deliveryTimeMinutes: z.number().int().min(0).max(360).optional(),
  deliveryFee: z.number().int().min(0).optional(),
  type: z.string().trim().min(2).max(80),
  isOpen: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
export const createStoreSchema = body(storeFields);
export const updateStoreSchema = body(storeFields.partial());

const productFields = z.object({
  store: objectId,
  category: objectId,
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().min(2).max(1000),
  ingredients: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
  nutritionalFacts: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  price: z.number().int().min(0),
  image: z.string().max(500).optional(),
  emoji: z.string().max(20).optional(),
  unit: z.string().max(40).optional(),
  isPopular: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  inventory: z.number().int().min(0).nullable().optional(),
});
export const createProductSchema = body(productFields);
export const updateProductSchema = body(productFields.partial());

export const addCartItemSchema = body(z.object({
  productId: objectId,
  quantity: z.number().int().min(1).max(99).default(1),
  replaceExistingStore: z.boolean().default(false),
}));
export const updateCartItemSchema = body(z.object({ quantity: z.number().int().min(1).max(99) }));
export const promoCodeSchema = body(z.object({ code: z.string().trim().min(2).max(40) }));
export const promoValidationSchema = body(z.object({ code: z.string().trim().min(2).max(40), subtotal: z.number().int().min(0) }));

export const createOrderSchema = body(z.object({ addressId: objectId, paymentMethod: z.enum(['card', 'wallet', 'cash']) }));
export const orderStatusSchema = body(z.object({
  status: z.enum(['confirmed', 'preparing', 'ready_for_pickup', 'on_the_way', 'delivered', 'cancelled']),
  note: z.string().trim().max(300).optional(),
}));
export const cancelOrderSchema = body(z.object({ reason: z.string().trim().min(3).max(300) }));
export const assignRiderSchema = body(z.object({ riderId: objectId }));
export const messageSchema = body(z.object({ message: z.string().trim().min(1).max(2000) }));

export const initializePaymentSchema = body(z.object({ orderId: objectId, callbackUrl: z.string().url().optional() }));
export const refundPaymentSchema = body(z.object({ reason: z.string().trim().max(300).optional() }));

const promoFields = z.object({
  owner: objectId.nullable().optional(),
  code: z.string().trim().min(2).max(40),
  description: z.string().trim().max(300).optional(),
  discountType: z.enum(['fixed', 'percentage']),
  discountValue: z.number().min(0),
  minimumSubtotal: z.number().int().min(0).optional(),
  maximumDiscount: z.number().int().min(0).nullable().optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  perUserLimit: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});
export const createPromoSchema = body(promoFields);
export const updatePromoSchema = body(promoFields.partial());

export const reviewSchema = body(z.object({ order: objectId, product: objectId, rating: z.number().int().min(1).max(5), comment: z.string().trim().max(1000).optional() }));

const rewardFields = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(500),
  pointsCost: z.number().int().min(1),
  promo: objectId.nullable().optional(),
  image: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});
export const createRewardSchema = body(rewardFields);
export const updateRewardSchema = body(rewardFields.partial());

const faqFields = z.object({
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(3000),
  category: z.string().trim().max(80).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export const createFaqSchema = body(faqFields);
export const updateFaqSchema = body(faqFields.partial());
