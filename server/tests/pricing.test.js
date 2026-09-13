import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscount, calculateTotals } from '../src/services/pricing.service.js';

test('calculates fixed discounts without making totals negative', () => {
  assert.equal(calculateDiscount({ discountType: 'fixed', discountValue: 500 }, 300), 300);
});

test('caps percentage discounts and includes delivery', () => {
  const result = calculateTotals({
    items: [{ price: 2000, quantity: 2 }, { price: 500, quantity: 1 }],
    deliveryFee: 300,
    promo: { discountType: 'percentage', discountValue: 25, maximumDiscount: 1000 },
  });
  assert.deepEqual(result, { subtotal: 4500, deliveryFee: 300, discount: 1000, total: 3800 });
});
