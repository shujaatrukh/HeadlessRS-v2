import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo";
import { GET_FRONT_PAGE } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import WpContent from "@/components/WpContent";

export const revalidate = 60;

interface FrontPageData {
  generalSettings: { title: string; description: string };
  nodeByUri: {
    __typename: string;
    title: string;
    content: string;
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

async function fetchFrontPage() {
  const client = getClient();
  const { data } = await client.query<FrontPageData>({ query: GET_FRONT_PAGE });
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchFrontPage();
  return buildMetadata(
    data.nodeByUri?.seo,
    data.generalSettings?.title || "rukhsolutions.com"
  );
}

export default async function HomePage() {
  const data = await fetchFrontPage();
  if (!data.nodeByUri) return notFound();

  return <WpContent html={data.nodeByUri.content} />;
}
