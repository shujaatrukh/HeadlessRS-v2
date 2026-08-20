"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { getWooClient } from "@/lib/wooClient";
import { CHECKOUT } from "@/lib/queries";

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
  const [order, setOrder] = useState<CheckoutResult["checkout"]["order"] | null>(
    null
  );
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
      if (data?.checkout?.order) {
        setOrder(data.checkout.order);
      } else {
        setError("Order could not be created. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--brand-purple) 12%, transparent)", color: "var(--brand-purple)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight" style={{ color: "var(--brand-ink)" }}>
          Order #{order.orderNumber} received
        </h1>
        <p className="mt-3 text-black/60">
          Status: {order.status} · Total: {order.total}
        </p>
        <p className="mt-2 text-sm text-black/50">
          This order was created without a live payment gateway wired up —
          we&rsquo;ll follow up directly to arrange payment.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center rounded-full px-6 py-3 text-sm font-bold"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
            color: "#111111",
          }}
        >
          Continue browsing
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--brand-ink)" }}>
        Checkout
      </h1>
      <p className="mt-2 text-sm text-black/50">
        No live payment gateway is connected yet — submitting creates a
        WooCommerce order that our team will follow up on directly.
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
          {loading ? "Placing order…" : "Place order"}
        </button>
      </form>
    </section>
  );
}
