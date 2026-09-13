export function createOrderNumber(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `DLY-${date}-${random}`;
}
