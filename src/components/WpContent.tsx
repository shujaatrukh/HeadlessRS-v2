import ScrollReveal from "./ScrollReveal";

export default function WpContent({ html }: { html: string }) {
  return (
    <>
      <ScrollReveal />
      <article
        className="entry-content mx-auto w-full max-w-6xl px-6 py-16 sm:py-20"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
