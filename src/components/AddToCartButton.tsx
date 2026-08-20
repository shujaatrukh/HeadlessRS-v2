"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getWooClient } from "@/lib/wooClient";
import { ADD_TO_CART } from "@/lib/queries";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAdd() {
    setLoading(true);
    setError(null);
    try {
      const client = getWooClient();
      await client.mutate({
        mutation: ADD_TO_CART,
        variables: { productId, quantity: 1 },
      });
      router.push("/cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
          color: "#111111",
          boxShadow:
            "0 10px 24px -8px color-mix(in srgb, var(--brand-gold) 70%, transparent), 0 2px 6px rgb(0 0 0 / 0.08)",
        }}
      >
        {loading ? "Adding…" : "Add to Cart"}
      </button>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
