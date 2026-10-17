import { Frame, Headline, HaiPhoto, OG_CONTENT_TYPE, OG_SIZE, Sub, renderCard } from "@/og/card";

/**
 * Social share card for the homepage. Also the fallback for every route
 * without its own opengraph-image (Integritetspolicy, Villkor).
 * The shared frame and assets live in src/og/card.tsx.
 */

export const alt = "Khyte Automations – mindre klipp och klistra, mer tid för det som spelar roll";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard(
    <Frame right={<HaiPhoto />}>
      <Headline lead="Mindre klipp och klistra." accent="Mer tid för det som spelar roll." size={56} />
      <Sub>Vi automatiserar arbetsflöden och bygger egna system åt svenska företag.</Sub>
    </Frame>,
  );
}
