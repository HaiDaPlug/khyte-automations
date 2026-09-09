/**
 * Renders a JSON-LD <script> block.
 *
 * Non-ASCII is escaped to \uXXXX so Swedish diacritics survive regardless of
 * how the response is encoded, and so no character in the payload can close
 * the surrounding <script> tag.
 */
export default function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(
    /[\u007f-\uffff]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
