"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getWooClient } from "@/lib/wooClient";
import {
  GET_CART,
  UPDATE_CART_ITEM_QUANTITIES,
  REMOVE_ITEMS_FROM_CART,
} from "@/lib/queries";
import { formatPrice } from "@/lib/price";
import { useCart } from "@/lib/cartContext";

interface CartItem {
  key: string;
  quantity: number;
  total: string;
  product: {
    node: {
      id: string;
      databaseId: number;
      name: string;
      slug: string;
      image?: { sourceUrl?: string | null; altText?: string | null } | null;
      price?: string | null;
    };
  };
}

interface CartData {
  cart: {
    isEmpty: boolean;
    subtotal: string;
    total: string;
    contents: { nodes: CartItem[] };
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData["cart"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshCount } = useCart();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const client = getWooClient();
      const { data } = await client.query<CartData>({ query: GET_CART });
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateQty(key: string, quantity: number) {
    const client = getWooClient();
    await client.mutate({
      mutation: UPDATE_CART_ITEM_QUANTITIES,
      variables: { items: [{ key, quantity }] },
    });
    await load();
    refreshCount();
  }

  async function removeItem(key: string) {
    const client = getWooClient();
    await client.mutate({
      mutation: REMOVE_ITEMS_FROM_CART,
      variables: { keys: [key] },
    });
    await load();
    refreshCount();
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--brand-ink)" }}>
        Your Cart
      </h1>

      {loading ? (
        <p className="mt-10 text-black/50">Loading cart…</p>
      ) : error ? (
        <p className="mt-10 text-red-600">{error}</p>
      ) : !cart || cart.isEmpty ? (
        <div
          className="mt-10 rounded-2xl border p-10 text-center"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", boxShadow: "var(--shadow-soft)" }}
        >
          <p className="text-black/60">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
              color: "#111111",
            }}
          >
            Browse services
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div
            className="divide-y rounded-2xl border"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", boxShadow: "var(--shadow-soft)" }}
          >
            {cart.contents.nodes.map((item) => (
              <div key={item.key} className="flex items-center gap-4 p-5">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: "var(--brand-ink)" }}
                >
                  {item.product.node.image?.sourceUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.node.image.sourceUrl}
                      alt=""
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    item.product.node.name.slice(0, 1)
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.node.name}</p>
                  <p className="text-sm text-black/50">
                    {formatPrice(item.product.node.price)}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQty(item.key, Number(e.target.value) || 1)
                  }
                  className="w-16 rounded-lg border border-black/10 px-2 py-1 text-center"
                />
                <p className="w-24 text-right font-semibold">
                  {formatPrice(item.total)}
                </p>
                <button
                  onClick={() => removeItem(item.key)}
                  className="text-sm text-black/40 transition-colors hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div
            className="mt-8 flex items-center justify-between rounded-2xl border p-6"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", boxShadow: "var(--shadow-soft)" }}
          >
            <div>
              <p className="text-sm text-black/50">Total</p>
              <p className="text-2xl font-extrabold" style={{ color: "var(--brand-ink)" }}>
                {formatPrice(cart.total)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="inline-flex items-center rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
                color: "#111111",
                boxShadow: "0 10px 24px -8px color-mix(in srgb, var(--brand-gold) 70%, transparent)",
              }}
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
