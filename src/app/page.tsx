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
      <section className="relative overflow-hidden bg-[#0a0a0a]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 80% at 20% 0%, color-mix(in srgb, var(--brand-gold) 22%, transparent), transparent 60%), radial-gradient(50% 60% at 100% 100%, color-mix(in srgb, var(--brand-purple) 25%, transparent), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
          <h1
            className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ffffff 35%, var(--brand-gold) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {data.nodeByUri.title || data.generalSettings?.title}
          </h1>
          {data.generalSettings?.description ? (
            <p className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg">
              {data.generalSettings.description}
            </p>
          ) : null}
        </div>
      </section>
      <WpContent html={data.nodeByUri.content} />
    </>
  );
}
