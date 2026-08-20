/**
 * WooCommerce returns pre-formatted price strings (e.g. "$500.00") when a
 * price is set on the product. If no price has been configured in
 * WooCommerce yet, this renders a friendly fallback instead of "$NaN".
 */
export function formatPrice(price?: string | null): string {
  if (!price) return "Contact for pricing";
  return price;
}

/** Strips currency symbols/formatting from a WooCommerce price string (e.g. "$500.00" -> 500). */
export function parsePrice(price?: string | null): number {
  if (!price) return 0;
  const cleaned = price.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}
