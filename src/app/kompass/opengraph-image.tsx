import { Frame, Headline, OG_CONTENT_TYPE, OG_SIZE, Result, Sub, renderCard } from "@/og/card";

/**
 * khyte.se's own card for the kompass, in the site's share-card style.
 * @/kompass/og is left as is: it is the module's card for the standalone app.
 */

export const alt = "Var tappar ni mest tid? – Automationskompassen";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgBild() {
  return renderCard(
    <Frame right={<Result steps={["3"]} label="konkreta förslag, direkt" />}>
      <Headline lead="Var tappar ni" accent="mest tid?" size={80} />
      <Sub width={520}>Ett par minuters snabba frågor om ert företag.</Sub>
    </Frame>,
  );
}
