"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getWooClient } from "@/lib/wooClient";
import { GET_ORDER } from "@/lib/queries";

const FREE_PLUGIN_SLUG = "rukh-content-tools-free-wordpress-plugin";
const FREE_PLUGIN_DOWNLOAD_URL =
  "https://cms.rukhsolutions.com/wp-content/uploads/woocommerce_uploads/rukh-content-tools.zip";

interface OrderData {
  order: {
    orderNumber: string;
    status: string;
    total: string;
    date: string;
    lineItems?: {
      nodes: { product: { node: { slug: string; name: string } } | null }[];
    } | null;
  } | null;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const hasFreeDownload = searchParams.get("download") === "1";
  const [order, setOrder] = useState<OrderData["order"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const client = getWooClient();
        const { data } = await client.query<OrderData>({
          query: GET_ORDER,
          variables: { id: orderId },
          fetchPolicy: "network-only",
        });
        setOrder(data?.order || null);
      } catch {
        // Guest sessions may not have access to look up order detail —
        // fall back to the generic confirmation below.
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "color-mix(in srgb, var(--brand-purple) 12%, transparent)",
          color: "var(--brand-purple)",
        }}
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
        Thank you for your order
      </h1>
      {loading ? (
        <p className="mt-3 text-black/50">Confirming your order…</p>
      ) : order ? (
        <p className="mt-3 text-black/60">
          Order #{order.orderNumber} · {order.status} · {order.total}
        </p>
      ) : hasFreeDownload ? (
        <p className="mt-3 text-black/60">
          {orderId ? `Order #${orderId} ` : ""}is all set — grab your download
          below.
        </p>
      ) : (
        <p className="mt-3 text-black/60">
          {orderId ? `Order #${orderId} ` : ""}was submitted to PayPal. We&rsquo;ll
          confirm payment and follow up shortly.
        </p>
      )}

      {hasFreeDownload ||
      order?.lineItems?.nodes.some(
        (item) => item.product?.node.slug === FREE_PLUGIN_SLUG
      ) ? (
        <a
          href={FREE_PLUGIN_DOWNLOAD_URL}
          className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
            color: "#111111",
          }}
        >
          Download Rukh Content Tools (.zip)
        </a>
      ) : null}
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

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
