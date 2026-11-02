// Formats a number as Indian Rupees with Indian digit grouping: ₹1,24,999
export function formatPrice(amount: number): string {
  const fixed = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  const [whole, fraction] = fixed.split('.');

  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}`
    : lastThree;

  return `₹${grouped}${fraction ? `.${fraction}` : ''}`;
}

// Short form for dashboards: ₹950, ₹9.9K, ₹1.6L, ₹2.4Cr
export function formatCompactPrice(amount: number): string {
  const units: [number, string][] = [
    [1e7, 'Cr'],
    [1e5, 'L'],
    [1e3, 'K'],
  ];
  for (const [size, suffix] of units) {
    if (amount >= size) return `₹${Number((amount / size).toFixed(1))}${suffix}`;
  }
  return formatPrice(Math.round(amount));
}

export function discountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatDate(iso: string, withTime = false): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (!withTime) return day;
  return `${day}, ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
