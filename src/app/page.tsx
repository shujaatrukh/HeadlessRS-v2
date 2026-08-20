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

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[color-mix(in_srgb,var(--wp--preset--color--accent-3)_8%,white)] to-white">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {data.nodeByUri.title || data.generalSettings?.title}
          </h1>
          {data.generalSettings?.description ? (
            <p className="mx-auto mt-4 max-w-xl text-black/60">
              {data.generalSettings.description}
            </p>
          ) : null}
        </div>
      </section>
      <WpContent html={data.nodeByUri.content} />
    </>
  );
}
