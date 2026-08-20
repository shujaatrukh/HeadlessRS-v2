import type { Metadata } from "next";

export interface WpSeo {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: { sourceUrl?: string | null } | null;
}

export function buildMetadata(
  seo: WpSeo | null | undefined,
  fallbackTitle: string
): Metadata {
  const title = seo?.title || fallbackTitle;
  const description = seo?.metaDesc || undefined;
  const ogImage = seo?.opengraphImage?.sourceUrl;

  return {
    title,
    description,
    alternates: seo?.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo?.opengraphTitle || title,
      description: seo?.opengraphDescription || description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify({ "@context": "https://schema.org", ...data }),
  };
}
