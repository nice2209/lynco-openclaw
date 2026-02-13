export function cents(n: number) {
  return Math.round(n);
}

export function formatMoney(centsValue: number, currency: string) {
  const value = (centsValue ?? 0) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency || "USD"} ${value.toFixed(2)}`;
  }
}
