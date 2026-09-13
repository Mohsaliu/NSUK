import { Faq } from '../models/Faq.js';
import { ApiError } from '../utils/apiError.js';

export function listFaqs(includeInactive = false) {
  return Faq.find(includeInactive ? {} : { isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
}

export function createFaq(input) { return Faq.create(input); }

export async function updateFaq(id, input) {
  const faq = await Faq.findByIdAndUpdate(id, input, { returnDocument: 'after', runValidators: true });
  if (!faq) throw new ApiError(404, 'FAQ not found');
  return faq;
}

export async function removeFaq(id) {
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
}
