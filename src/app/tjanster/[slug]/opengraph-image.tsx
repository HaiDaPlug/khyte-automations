import { getServiceBySlug, services } from "@/data/services";
import { Check, DEEP, Frame, Headline, INK, MUTED, OG_CONTENT_TYPE, OG_SIZE, Panel, Sub, renderCard } from "@/og/card";

export const alt = "Tjänst från Khyte Automations";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The page's generateStaticParams doesn't reach this route; without its own,
// every card would be rendered on request instead of at build.
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

/** Research time per company, from the Observa case (foretagsresearch). */
function ResearchReceipt() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <Panel x={760} y={170} width={380} rotate={-2}>
        <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Research per företag
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 18 }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: MUTED }}>För hand</div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: MUTED, textDecoration: "line-through" }}>4 min</div>
        </div>
        <div style={{ display: "flex", height: 1, background: "rgba(58,51,48,0.12)", margin: "14px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: INK }}>Automatiskt</div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 900, color: DEEP }}>10 sek</div>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 790, top: 440, display: "flex", fontSize: 19, fontWeight: 600, color: "#FFF4EA" }}>
        Från ett riktigt case: Observa Inkasso
      </div>
    </div>
  );
}

/** The booking flow from the Kom-Fort case — each step done, hence the checks. */
function SystemWindow() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <Panel x={740} y={140} width={410}>
        <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", width: 11, height: 11, borderRadius: 6, background: "#F2C3A0" }} />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: INK, marginBottom: 12 }}>Ert system</div>
        {["Bokning inkommen", "Schema uppdaterat", "Bekräftelse skickad"].map((step) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderTop: "1px solid rgba(58,51,48,0.10)" }}>
            <Check />
            <div style={{ display: "flex", fontSize: 22, fontWeight: 500, color: INK }}>{step}</div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "automatisering") {
    return renderCard(
      <Frame right={<ResearchReceipt />}>
        <Headline lead="Samma sak för hand," accent="varje vecka?" size={66} />
        <Sub width={500}>Vi automatiserar dokument, listor och research – så att ni slipper.</Sub>
      </Frame>,
    );
  }

  if (slug === "egna-system") {
    return renderCard(
      <Frame right={<SystemWindow />}>
        <Headline lead="Färdiga verktyg passar inte?" accent="Vi bygger ert eget." size={62} />
        <Sub width={520}>Skräddarsytt efter hur ni faktiskt jobbar. Ni äger allt vi bygger.</Sub>
      </Frame>,
    );
  }

  // A service added later still gets a card, from its own heading and summary.
  const s = getServiceBySlug(slug);
  return renderCard(
    <Frame>
      <Headline lead={s?.heading.line1 ?? "Våra tjänster"} accent={s?.heading.line2} size={66} />
      {s ? <Sub>{s.summary}</Sub> : null}
    </Frame>,
  );
}
