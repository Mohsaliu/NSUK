export function calculateDiscount(promo, subtotal) {
  if (!promo) return 0;
  const raw = promo.discountType === 'percentage'
    ? Math.round(subtotal * (promo.discountValue / 100))
    : promo.discountValue;
  return Math.min(subtotal, promo.maximumDiscount == null ? raw : Math.min(raw, promo.maximumDiscount));
}

export function calculateTotals({ items, deliveryFee = 0, promo = null }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(promo, subtotal);
  return { subtotal, deliveryFee, discount, total: Math.max(0, subtotal + deliveryFee - discount) };
}
