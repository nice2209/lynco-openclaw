export type LineItemInput = {
  description: string;
  quantity: number;
  unitPriceCents: number;
  discountPercent: number;
  sortOrder: number;
};

export function computeLineTotalCents(item: LineItemInput) {
  const qty = Number(item.quantity || 0);
  const unit = Number(item.unitPriceCents || 0);
  const discount = Math.min(100, Math.max(0, Number(item.discountPercent || 0)));
  const raw = qty * unit;
  const discounted = raw * (1 - discount / 100);
  return Math.round(discounted);
}

export function computeTotals(items: LineItemInput[], taxCents = 0) {
  const lineTotals = items.map((i) => computeLineTotalCents(i));
  const subtotal = lineTotals.reduce((a, b) => a + b, 0);
  const total = subtotal + (taxCents || 0);
  return { subtotalCents: subtotal, taxCents: taxCents || 0, totalCents: total };
}
