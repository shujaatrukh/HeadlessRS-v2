import type { Metadata } from "next";
import { getClient } from "@/lib/apollo";
import { GET_PRODUCTS } from "@/lib/queries";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description: "Website audits, WordPress development, data analytics, and care plans.",
};

interface ProductsData {
  products: { nodes: ProductCardData[] };
}

export default async function ShopPage() {
  const client = getClient();
  const { data } = await client.query<ProductsData>({ query: GET_PRODUCTS });
  const products = data?.products?.nodes || [];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] pb-24 pt-24 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(55% 70% at 15% 0%, color-mix(in srgb, var(--brand-gold) 18%, transparent), transparent 60%), radial-gradient(45% 55% at 100% 100%, color-mix(in srgb, var(--brand-purple) 22%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{ background: "color-mix(in srgb, var(--brand-gold) 18%, transparent)", color: "var(--brand-gold)" }}
          >
            Services
          </span>
          <h1
            className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{
              backgroundImage: "linear-gradient(90deg, #ffffff 35%, var(--brand-gold) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Work with us
          </h1>
          <p className="mt-4 text-white/60">
            From a one-time audit to an ongoing engagement — pick the service
            that fits where you are today.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-white/50">
            No services are published yet. Check back soon.
          </p>
        ) : null}
      </div>
    </section>
  );
}
