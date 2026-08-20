import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo";
import { GET_PAGE_BY_URI } from "@/lib/queries";
import { buildMetadata, jsonLd } from "@/lib/seo";
import WpContent from "@/components/WpContent";

export const revalidate = 60;

interface NodeData {
  nodeByUri: {
    __typename: string;
    title: string;
    content: string;
    date?: string;
    seo?: {
      title?: string | null;
      metaDesc?: string | null;
      canonical?: string | null;
      opengraphTitle?: string | null;
      opengraphDescription?: string | null;
      opengraphImage?: { sourceUrl?: string | null } | null;
    } | null;
  } | null;
}

async function fetchNode(slug: string) {
  const client = getClient();
  const { data } = await client.query<NodeData>({
    query: GET_PAGE_BY_URI,
    variables: { uri: `/${slug}/` },
  });
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchNode(slug);
  return buildMetadata(data.nodeByUri?.seo, data.nodeByUri?.title || slug);
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchNode(slug);

  if (!data.nodeByUri) return notFound();

  const node = data.nodeByUri;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": node.__typename === "Post" ? "Article" : "WebPage",
          headline: node.title,
          ...(node.date ? { datePublished: node.date } : {}),
        })}
      />
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {node.title}
        </h1>
      </section>
      <WpContent html={node.content} />
    </>
  );
}
