import { Frame, Headline, INK, MUTED, OG_CONTENT_TYPE, OG_SIZE, Panel, Sub, renderCard } from "@/og/card";

export const alt = "Khyte Automations tjänster – automatisering, egna system och AI-rådgivning";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const SERVICES = [
  ["Automatisering", "Flöden som sköter sig själva"],
  ["Egna system", "Byggda för hur ni jobbar"],
  ["AI-rådgivning", "Utan krav på att vi bygger något"],
];

export default function OpengraphImage() {
  return renderCard(
    <Frame
      right={
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {SERVICES.map(([name, line], i) => (
            <Panel key={name} x={720 + i * 26} y={130 + i * 128} width={400}>
              <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: INK }}>{name}</div>
              <div style={{ display: "flex", fontSize: 19, fontWeight: 500, color: MUTED }}>{line}</div>
            </Panel>
          ))}
        </div>
      }
    >
      <Headline lead="Tre sätt att få" accent="tillbaka er tid." size={72} />
      <Sub width={480}>Kostnadsfri kartläggning och fast pris innan vi bygger.</Sub>
    </Frame>,
  );
}
