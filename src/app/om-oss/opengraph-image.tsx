import { Frame, Headline, HaiPhoto, OG_CONTENT_TYPE, OG_SIZE, Pill, Sub, renderCard } from "@/og/card";

export const alt = "Hai Bui, grundare av Khyte Automations";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard(
    <Frame
      right={
        <HaiPhoto>
          <Pill x={760} y={540}>
            Hai Bui · Grundare
          </Pill>
        </HaiPhoto>
      }
    >
      <Headline lead="Hej! Jag heter Hai" accent="och grundade Khyte." size={62} width={640} />
      <Sub width={520}>Vi bygger automationer och egna system åt svenska företag. Från Borås.</Sub>
    </Frame>,
  );
}
