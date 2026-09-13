import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Address } from '../models/Address.js';
import { Category } from '../models/Category.js';
import { Faq } from '../models/Faq.js';
import { Product } from '../models/Product.js';
import { Promo } from '../models/Promo.js';
import { Reward } from '../models/Reward.js';
import { Store } from '../models/Store.js';
import { User } from '../models/User.js';
import { slugify } from '../utils/slug.js';

async function loadFrontendCatalog() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const sourcePath = path.resolve(currentDir, '../../../src/data/mockData.ts');
  const source = await fs.readFile(sourcePath, 'utf8');
  const dataStart = source.indexOf('export const MOCK_USER');
  if (dataStart < 0) throw new Error('Unable to find frontend mock catalog');
  const executable = source
    .slice(dataStart)
    .replaceAll('export const ', 'const ')
    .replace(': DeliveryAddress[]', '')
    .replace(': Restaurant[]', '')
    .concat('\n({ MOCK_USER, DELIVERY_ADDRESSES, CATEGORIES, RESTAURANTS });');
  return new vm.Script(executable, { filename: sourcePath }).runInNewContext({});
}

async function ensureUser(input, password) {
  let user = await User.findOne({ email: input.email });
  if (!user) {
    user = new User({ ...input, passwordHash: 'pending' });
    await user.setPassword(password);
    await user.save();
  }
  return user;
}

export async function seedDatabase() {
  const { MOCK_USER, DELIVERY_ADDRESSES, CATEGORIES, RESTAURANTS } = await loadFrontendCatalog();
  const admin = await ensureUser({ name: 'Droply Admin', username: 'admin', email: 'admin@droply.ng', role: 'admin' }, 'Admin123!');
  const customer = await ensureUser({
    name: MOCK_USER.name,
    username: MOCK_USER.username,
    email: `${MOCK_USER.username}@nsuk.edu.ng`,
    avatar: MOCK_USER.avatar,
    walletBalance: MOCK_USER.walletBalance,
    rewardPoints: 2450,
    rating: MOCK_USER.rating,
    role: 'customer',
  }, 'Student123!');
  const merchant = await ensureUser({ name: 'Demo Merchant', username: 'merchant', email: 'merchant@droply.ng', role: 'merchant' }, 'Merchant123!');
  await ensureUser({ name: 'Demo Rider', username: 'rider', email: 'rider@droply.ng', phone: '+2348000000000', role: 'rider', rating: 4.9 }, 'Rider123!');

  const categoryByName = new Map();
  for (const [index, category] of CATEGORIES.entries()) {
    const document = await Category.findOneAndUpdate(
      { slug: slugify(category.name) },
      {
        name: category.name,
        slug: slugify(category.name),
        image: category.image,
        backgroundColor: category.bg,
        textColor: category.textColor,
        sortOrder: index,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', runValidators: true },
    );
    categoryByName.set(category.name, document);
  }

  for (const [index, rawStore] of RESTAURANTS.entries()) {
    const store = await Store.findOneAndUpdate(
      { slug: rawStore.id },
      {
        name: rawStore.name,
        slug: rawStore.id,
        owner: index === 0 ? merchant.id : admin.id,
        address: rawStore.address,
        coverImage: rawStore.coverImage,
        logo: rawStore.logo,
        openingHours: rawStore.openingHours,
        rating: rawStore.rating,
        deliveryTimeMinutes: Number.parseInt(rawStore.deliveryTime, 10) || 30,
        deliveryFee: rawStore.deliveryFee,
        type: rawStore.type,
        isOpen: true,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', runValidators: true },
    );

    for (const rawProduct of rawStore.menu) {
      let category = categoryByName.get(rawProduct.category);
      if (!category) {
        category = await Category.findOneAndUpdate(
          { slug: slugify(rawProduct.category) },
          { name: rawProduct.category, slug: slugify(rawProduct.category), isActive: true },
          { upsert: true, returnDocument: 'after' },
        );
        categoryByName.set(rawProduct.category, category);
      }
      await Product.findOneAndUpdate(
        { legacyId: rawProduct.id },
        {
          legacyId: rawProduct.id,
          store: store.id,
          category: category.id,
          name: rawProduct.name,
          slug: slugify(rawProduct.name),
          description: rawProduct.description,
          price: rawProduct.price,
          image: rawProduct.image || '',
          emoji: rawProduct.emoji || '',
          unit: rawProduct.unit || '',
          rating: rawProduct.rating || 0,
          reviewsCount: rawProduct.reviewsCount || 0,
          isPopular: Boolean(rawProduct.popular),
          isPremium: Boolean(rawProduct.premium),
          isAvailable: true,
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      );
    }
  }

  for (const address of DELIVERY_ADDRESSES) {
    await Address.findOneAndUpdate(
      { user: customer.id, label: address.label },
      { user: customer.id, label: address.label, address: address.address, isDefault: address.selected },
      { upsert: true, returnDocument: 'after' },
    );
  }

  await Promo.findOneAndUpdate(
    { code: 'NSUKFRESH' },
    {
      code: 'NSUKFRESH',
      description: 'Save ₦150 on your campus delivery order',
      discountType: 'fixed',
      discountValue: 150,
      minimumSubtotal: 1000,
      expiresAt: new Date('2030-12-31T23:59:59.999Z'),
      perUserLimit: 20,
      isActive: true,
    },
    { upsert: true, returnDocument: 'after', runValidators: true },
  );
  const rewardPromoTemplate = await Promo.findOneAndUpdate(
    { code: 'REWARD500-TEMPLATE' },
    {
      code: 'REWARD500-TEMPLATE',
      description: 'Save ₦500 on an order above ₦1,500',
      discountType: 'fixed',
      discountValue: 500,
      minimumSubtotal: 1500,
      expiresAt: new Date('2030-12-31T23:59:59.999Z'),
      perUserLimit: 1,
      isActive: false,
    },
    { upsert: true, returnDocument: 'after', runValidators: true },
  );
  await Reward.findOneAndUpdate(
    { name: { $in: ['₦150 Order Discount', '₦500 Off Delivery'] } },
    { name: '₦500 Off Delivery', description: 'Valid for campus food orders above ₦1,500.', pointsCost: 500, promo: rewardPromoTemplate.id, isActive: true },
    { upsert: true, returnDocument: 'after' },
  );
  const additionalRewards = [
    { name: 'Free Green Tea Pack', description: 'Redeem at Mars Cafe during lecture hours.', pointsCost: 800 },
    { name: '₦1,000 Grocery Pack Voucher', description: 'Valid at 4U Supermarket campus branch.', pointsCost: 1500 },
  ];
  for (const reward of additionalRewards) {
    await Reward.findOneAndUpdate(
      { name: reward.name },
      { ...reward, isActive: true },
      { upsert: true, returnDocument: 'after' },
    );
  }

  const faqs = [
    ['How do I place an order?', 'Choose a store, add products to your cart, select a delivery address, and complete checkout.'],
    ['How can I track my delivery?', 'Open Profile, select My Orders, then open your active order to view its current delivery status.'],
    ['Can I order from multiple stores?', 'A cart contains products from one store at a time. Complete that order before ordering from another store.'],
    ['How do reward points work?', 'Eligible completed orders earn points that can be exchanged for active rewards.'],
  ];
  for (const [index, [question, answer]] of faqs.entries()) {
    await Faq.findOneAndUpdate({ question }, { question, answer, category: 'General', sortOrder: index, isActive: true }, { upsert: true, returnDocument: 'after' });
  }

  return {
    stores: RESTAURANTS.length,
    products: RESTAURANTS.reduce((sum, store) => sum + store.menu.length, 0),
    users: 4,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDatabase()
    .then(seedDatabase)
    .then((result) => console.log('Droply seed complete', result))
    .finally(disconnectDatabase)
    .catch((error) => { console.error(error); process.exitCode = 1; });
}
