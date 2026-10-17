import { facts } from "@/data/facts";
import { Frame, Headline, HaiPhoto, OG_CONTENT_TYPE, OG_SIZE, Pill, Sub, renderCard } from "@/og/card";

export const alt = "Kontakta Khyte Automations – berätta vad som tar er tid";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard(
    <Frame
      right={
        <HaiPhoto>
          <Pill x={720} y={540}>
            Introsamtal · {facts.introCall.minutes} min · kostnadsfritt
          </Pill>
        </HaiPhoto>
      }
    >
      <Headline lead="Berätta vad som" accent="tar er tid." size={76} width={600} />
      <Sub width={500}>Boka ett intro eller skriv till oss. Vi svarar inom 24 timmar.</Sub>
    </Frame>,
  );
}
