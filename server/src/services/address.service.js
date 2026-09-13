import { Address } from '../models/Address.js';
import { ApiError } from '../utils/apiError.js';

export function listAddresses(userId) {
  return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
}

export async function createAddress(userId, input) {
  const count = await Address.countDocuments({ user: userId });
  const makeDefault = input.isDefault || count === 0;
  if (makeDefault) await Address.updateMany({ user: userId }, { isDefault: false });
  return Address.create({ ...input, user: userId, isDefault: makeDefault });
}

export async function updateAddress(userId, addressId, input) {
  if (input.isDefault) await Address.updateMany({ user: userId }, { isDefault: false });
  const address = await Address.findOneAndUpdate({ _id: addressId, user: userId }, input, { returnDocument: 'after', runValidators: true });
  if (!address) throw new ApiError(404, 'Address not found');
  return address;
}

export async function removeAddress(userId, addressId) {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!address) throw new ApiError(404, 'Address not found');
  if (address.isDefault) {
    const next = await Address.findOne({ user: userId }).sort({ createdAt: 1 });
    if (next) { next.isDefault = true; await next.save(); }
  }
}

export async function setDefaultAddress(userId, addressId) {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw new ApiError(404, 'Address not found');
  await Address.updateMany({ user: userId }, { isDefault: false });
  address.isDefault = true;
  await address.save();
  return address;
}
