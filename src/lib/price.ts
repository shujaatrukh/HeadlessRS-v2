/**
 * WooCommerce returns pre-formatted price strings (e.g. "$500.00") when a
 * price is set on the product. If no price has been configured in
 * WooCommerce yet, this renders a friendly fallback instead of "$NaN".
 */
export function formatPrice(price?: string | null): string {
  if (!price) return "Contact for pricing";
  return price;
}
