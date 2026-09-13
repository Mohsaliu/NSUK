import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Store } from '../models/Store.js';
import { ApiError } from '../utils/apiError.js';
import { getPagination, pageMeta } from '../utils/pagination.js';
import { slugify } from '../utils/slug.js';

function publicStoreFilter() { return { isActive: true }; }

export async function listCategories(query = {}) {
  const filter = query.includeInactive === 'true' ? {} : { isActive: true };
  return Category.find(filter).sort({ sortOrder: 1, name: 1 });
}

export async function getCategory(identifier) {
  const filter = /^[a-f\d]{24}$/i.test(identifier) ? { _id: identifier } : { slug: identifier };
  const category = await Category.findOne(filter);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

export async function createCategory(input) {
  return Category.create({ ...input, slug: input.slug || slugify(input.name) });
}

export async function updateCategory(id, input) {
  if (input.name && !input.slug) input.slug = slugify(input.name);
  const category = await Category.findByIdAndUpdate(id, input, { returnDocument: 'after', runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

export async function removeCategory(id) {
  if (await Product.exists({ category: id })) throw new ApiError(409, 'Category has products and cannot be deleted');
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found');
}

export async function listStores(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = publicStoreFilter();
  if (query.type) filter.type = { $regex: query.type, $options: 'i' };
  if (query.isOpen != null) filter.isOpen = query.isOpen === 'true';
  if (query.search) filter.$text = { $search: query.search };
  const sort = query.sort === 'rating' ? { rating: -1 } : { createdAt: -1 };
  const [items, total] = await Promise.all([
    Store.find(filter).sort(sort).skip(skip).limit(limit),
    Store.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, page, limit) };
}

export async function getStore(identifier, productQuery = {}) {
  const idFilter = /^[a-f\d]{24}$/i.test(identifier) ? { _id: identifier } : { slug: identifier };
  const store = await Store.findOne({ ...idFilter, isActive: true });
  if (!store) throw new ApiError(404, 'Store not found');
  const productFilter = { store: store.id, isAvailable: true };
  if (productQuery.category) {
    const category = await Category.findOne({ $or: [{ slug: productQuery.category }, { name: productQuery.category }] });
    if (!category) return { store, products: [] };
    productFilter.category = category.id;
  }
  if (productQuery.tier === 'popular') productFilter.isPopular = true;
  if (productQuery.tier === 'premium') productFilter.isPremium = true;
  const products = await Product.find(productFilter).populate('category').sort({ isPopular: -1, name: 1 });
  return { store, products };
}

export async function createStore(input, actor) {
  const owner = actor.role === 'admin' && input.owner ? input.owner : actor.id;
  return Store.create({ ...input, slug: input.slug || slugify(input.name), owner });
}

export async function updateStore(id, input, actor) {
  const store = await Store.findById(id);
  if (!store) throw new ApiError(404, 'Store not found');
  if (actor.role === 'merchant' && store.owner?.toString() !== actor.id) throw new ApiError(403, 'You can only update your own store');
  const updates = { ...input };
  if (actor.role === 'merchant') delete updates.owner;
  Object.assign(store, updates);
  if (input.name && !input.slug) store.slug = slugify(input.name);
  await store.save();
  return store;
}

export async function removeStore(id) {
  const store = await Store.findByIdAndUpdate(id, { isActive: false }, { returnDocument: 'after' });
  if (!store) throw new ApiError(404, 'Store not found');
  return store;
}

export async function listProducts(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = { isAvailable: true };
  if (query.store) {
    const storeFilter = /^[a-f\d]{24}$/i.test(query.store) ? { _id: query.store } : { slug: query.store };
    const store = await Store.findOne(storeFilter).select('_id');
    if (!store) return { items: [], meta: pageMeta(0, page, limit) };
    filter.store = store.id;
  }
  if (query.category) {
    const categoryFilter = /^[a-f\d]{24}$/i.test(query.category)
      ? { _id: query.category }
      : { $or: [{ slug: query.category }, { name: query.category }] };
    const category = await Category.findOne(categoryFilter).select('_id');
    if (!category) return { items: [], meta: pageMeta(0, page, limit) };
    filter.category = category.id;
  }
  if (query.tier === 'popular') filter.isPopular = true;
  if (query.tier === 'premium') filter.isPremium = true;
  if (query.minPrice) filter.price = { ...filter.price, $gte: Number(query.minPrice) };
  if (query.maxPrice) filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
  if (query.search) filter.$text = { $search: query.search };
  const sort = query.sort === 'price_asc' ? { price: 1 } : query.sort === 'price_desc' ? { price: -1 } : { isPopular: -1, createdAt: -1 };
  const [items, total] = await Promise.all([
    Product.find(filter).populate('store', 'name slug logo deliveryFee').populate('category').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, page, limit) };
}

export async function getProduct(id) {
  const filter = /^[a-f\d]{24}$/i.test(id) ? { _id: id } : { $or: [{ legacyId: id }, { slug: id }] };
  const product = await Product.findOne(filter).populate('store').populate('category');
  if (!product || !product.isAvailable) throw new ApiError(404, 'Product not found');
  return product;
}

export async function createProduct(input, actor) {
  const [store, category] = await Promise.all([Store.findById(input.store), Category.findById(input.category)]);
  if (!store) throw new ApiError(404, 'Store not found');
  if (!category) throw new ApiError(404, 'Category not found');
  if (actor.role === 'merchant' && store.owner?.toString() !== actor.id) throw new ApiError(403, 'You can only add products to your own store');
  return Product.create({ ...input, slug: input.slug || slugify(input.name) });
}

export async function updateProduct(id, input, actor) {
  const product = await Product.findById(id).populate('store');
  if (!product) throw new ApiError(404, 'Product not found');
  if (actor.role === 'merchant' && product.store.owner?.toString() !== actor.id) throw new ApiError(403, 'You can only update products in your own store');
  if (input.store) {
    const targetStore = await Store.findById(input.store);
    if (!targetStore) throw new ApiError(404, 'Store not found');
    if (actor.role === 'merchant' && targetStore.owner?.toString() !== actor.id) throw new ApiError(403, 'You can only move products between your own stores');
  }
  if (input.category && !(await Category.exists({ _id: input.category }))) throw new ApiError(404, 'Category not found');
  Object.assign(product, input);
  if (input.name && !input.slug) product.slug = slugify(input.name);
  await product.save();
  return product;
}

export async function removeProduct(id, actor) {
  return updateProduct(id, { isAvailable: false }, actor);
}
