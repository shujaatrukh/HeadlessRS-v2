import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo";
import { GET_PRODUCT_BY_SLUG } from "@/lib/queries";
import { formatPrice } from "@/lib/price";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 60;

interface ProductData {
  product: {
    id: string;
    databaseId: number;
    slug: string;
    name: string;
    description?: string | null;
    shortDescription?: string | null;
    image?: { sourceUrl?: string | null; altText?: string | null } | null;
    price?: string | null;
    virtual?: boolean | null;
  } | null;
}

async function fetchProduct(slug: string) {
  const client = getClient();
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
  });
  return data.product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  return {
    title: product?.name || "Service",
    description: product?.shortDescription?.replace(/<[^>]+>/g, ""),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return notFound();

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--brand-gold) 22%, transparent)" }}
      />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div
          className="flex aspect-square items-center justify-center rounded-3xl shadow-xl"
          style={{ background: "var(--brand-ink)" }}
        >
          {product.image?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              className="h-full w-full rounded-3xl object-cover"
            />
          ) : (
            <span
              className="text-6xl font-bold"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-deep))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {product.name.slice(0, 1)}
            </span>
          )}
        </div>

        <div>
          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{ background: "color-mix(in srgb, var(--brand-purple) 12%, transparent)", color: "var(--brand-purple)" }}
          >
            Service
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "var(--brand-ink)" }}>
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold" style={{ color: "var(--brand-ink)" }}>
            {formatPrice(product.price)}
          </p>

          {product.shortDescription ? (
            <div
              className="mt-4 text-black/60 [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          ) : null}

          <div className="mt-8">
            <AddToCartButton productId={product.databaseId} />
          </div>

          {product.description ? (
            <div
              className="entry-content mt-12 border-t pt-10"
              style={{ borderColor: "var(--card-border)" }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
