"use client";

import { useState, FormEvent } from "react";
import { getWooClient } from "@/lib/wooClient";
import { CHECKOUT, GET_CART } from "@/lib/queries";
import { parsePrice } from "@/lib/price";
import { buildPayPalCheckoutUrl } from "@/lib/paypal";

interface CartData {
  cart: {
    isEmpty: boolean;
    contents: {
      nodes: {
        key: string;
        quantity: number;
        product: { node: { name: string; price?: string | null } };
      }[];
    };
  };
}

interface CheckoutResult {
  checkout: {
    result: string | null;
    redirect: string | null;
    order: {
      id: string;
      databaseId: number;
      orderNumber: string;
      status: string;
      total: string;
    } | null;
  };
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = getWooClient();

      const { data: cartData } = await client.query<CartData>({
        query: GET_CART,
        fetchPolicy: "network-only",
      });
      const cartItems = cartData?.cart?.contents?.nodes || [];
      if (cartData?.cart?.isEmpty || cartItems.length === 0) {
        setError("Your cart is empty.");
        setLoading(false);
        return;
      }

      const billing = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address1: form.address1,
        city: form.city,
        state: form.state,
        postcode: form.postcode,
        country: form.country,
      };
      const { data } = await client.mutate<CheckoutResult>({
        mutation: CHECKOUT,
        variables: {
          input: {
            billing,
            shipping: billing,
            paymentMethod: "cheque",
            isPaid: false,
          },
        },
      });

      const createdOrder = data?.checkout?.order;
      if (!createdOrder) {
        setError("Order could not be created. Please try again.");
        setLoading(false);
        return;
      }

      const origin = window.location.origin;
      const paypalUrl = buildPayPalCheckoutUrl({
        items: cartItems.map((item) => ({
          name: item.product.node.name,
          quantity: item.quantity,
          unitAmount: parsePrice(item.product.node.price),
        })),
        invoiceId: createdOrder.orderNumber,
        custom: String(createdOrder.databaseId),
        returnUrl: `${origin}/order-confirmation?order=${createdOrder.databaseId}`,
        cancelUrl: `${origin}/checkout`,
      });

      window.location.href = paypalUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--brand-ink)" }}>
        Checkout
      </h1>
      <p className="mt-2 text-sm text-black/50">
        Submitting creates your order and takes you to PayPal to complete
        payment securely.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3"
        />
        <input
          required
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3 sm:col-span-2"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3 sm:col-span-2"
        />
        <input
          placeholder="Address"
          value={form.address1}
          onChange={(e) => update("address1", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3 sm:col-span-2"
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3"
        />
        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3"
        />
        <input
          placeholder="Postcode"
          value={form.postcode}
          onChange={(e) => update("postcode", e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-3"
        />
        <input
          placeholder="Country (2-letter code)"
          value={form.country}
          onChange={(e) => update("country", e.target.value.toUpperCase())}
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 sm:col-span-2"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
            color: "#111111",
          }}
        >
          {loading ? "Redirecting to PayPal…" : "Pay with PayPal"}
        </button>
      </form>
    </section>
  );
}
