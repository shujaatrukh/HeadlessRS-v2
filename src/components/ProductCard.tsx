import Link from "next/link";
import { formatPrice } from "@/lib/price";

export interface ProductCardData {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  shortDescription?: string | null;
  image?: { sourceUrl?: string | null; altText?: string | null } | null;
  price?: string | null;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-400 group-hover:scale-x-100"
        style={{ background: "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-deep))" }}
      />

      <div
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white shadow-md"
        style={{ background: "var(--brand-ink)" }}
      >
        {product.image?.sourceUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          initials(product.name)
        )}
      </div>

      <h3 className="relative z-10 mt-5 text-lg font-bold tracking-tight" style={{ color: "var(--brand-ink)" }}>
        {product.name}
      </h3>

      {product.shortDescription ? (
        <div
          className="relative z-10 mt-2 line-clamp-3 text-sm text-black/60 [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: product.shortDescription }}
        />
      ) : null}

      <div className="relative z-10 mt-6 flex items-center justify-between">
        <span className="text-base font-bold" style={{ color: "var(--brand-ink)" }}>
          {formatPrice(product.price)}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
            color: "#111111",
          }}
        >
          Get Started
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
