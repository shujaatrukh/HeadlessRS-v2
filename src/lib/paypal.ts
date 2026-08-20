export const PAYPAL_BUSINESS_EMAIL = "shujaatrukh@yahoo.com";

interface PayPalCartItem {
  name: string;
  quantity: number;
  /** Unit price in the store currency, as a plain number (no symbol). */
  unitAmount: number;
}

/**
 * Builds a classic PayPal "Website Payments Standard" hosted-checkout URL.
 * Needs only the receiving email (no API keys/OAuth) — WooCommerce no longer
 * ships this gateway itself, so the redirect is assembled directly here from
 * the cart contents and the WooCommerce order created via the `checkout`
 * GraphQL mutation.
 */
export function buildPayPalCheckoutUrl(params: {
  items: PayPalCartItem[];
  currency?: string;
  invoiceId: string;
  custom: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const { items, currency = "USD", invoiceId, custom, returnUrl, cancelUrl } = params;
  const qs = new URLSearchParams({
    cmd: "_cart",
    upload: "1",
    business: PAYPAL_BUSINESS_EMAIL,
    currency_code: currency,
    invoice: invoiceId,
    custom,
    return: returnUrl,
    cancel_return: cancelUrl,
    no_shipping: "1",
    no_note: "1",
  });

  items.forEach((item, i) => {
    const n = i + 1;
    qs.set(`item_name_${n}`, item.name.slice(0, 127));
    qs.set(`amount_${n}`, item.unitAmount.toFixed(2));
    qs.set(`quantity_${n}`, String(item.quantity));
  });

  return `https://www.paypal.com/cgi-bin/webscr?${qs.toString()}`;
}
