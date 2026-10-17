import { cases } from "@/data/cases";
import { Frame, Headline, OG_CONTENT_TYPE, OG_SIZE, Pill, Sub, renderCard } from "@/og/card";

export const alt = "Case – automationer Khyte Automations byggt för riktiga företag";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Staggered so the client names read as a loose stack, not a table.
const OFFSETS = [770, 820, 750, 800, 735];

export default function OpengraphImage() {
  return renderCard(
    <Frame
      right={
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {cases.slice(0, OFFSETS.length).map((c, i) => (
            <Pill key={c.slug} x={OFFSETS[i]} y={108 + i * 84}>
              {c.company}
            </Pill>
          ))}
        </div>
      }
    >
      <Headline lead="Det här har vi byggt" accent="för riktiga företag." size={64} />
      <Sub width={500}>Från prospektlistor till plocksedlar – med flöden och resultat.</Sub>
    </Frame>,
  );
}
