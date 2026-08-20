export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--brand-ink)" }}>
        About Rukh Solutions
      </h1>
      <p className="mt-6 text-lg text-black/60">
        We help businesses turn data, cloud, and automation into results —
        from headless WordPress builds to Microsoft Fabric analytics
        engagements.
      </p>
    </section>
  );
}
