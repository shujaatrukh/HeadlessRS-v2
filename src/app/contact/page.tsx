export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--brand-ink)" }}>
        Get in touch
      </h1>
      <p className="mt-6 text-lg text-black/60">
        Have a project in mind? Reach out at{" "}
        <a
          href="mailto:rukh.shujaat@gmail.com"
          className="font-semibold underline decoration-2 underline-offset-4"
          style={{ color: "var(--brand-purple)" }}
        >
          rukh.shujaat@gmail.com
        </a>
        .
      </p>
    </section>
  );
}
