export default function WpContent({ html }: { html: string }) {
  return (
    <article
      className="entry-content mx-auto w-full max-w-6xl px-6 py-16"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
