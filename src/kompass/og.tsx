import { ImageResponse } from "next/og";

/**
 * OG-bild i Khytes stil, för delning i SMS, mejl och på LinkedIn.
 * Ritas av Next vid bygget — ingen bildfil att hålla uppdaterad.
 */

/**
 * Bildens mått och text. Next läser dessa ur appens opengraph-image.tsx, som
 * därför skriver ut dem själv och bara hämtar ritningen härifrån.
 */
export const OG_STORLEK = { width: 1200, height: 630 };
export const OG_ALT = "Var tappar du mest tid? — Khyte Automations";

export function kompassOgBild() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8f6f3",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#c05e20",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: "#c05e20",
            }}
          />
          Automationskompassen
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: "#3a3330",
              textTransform: "uppercase",
            }}
          >
            Var tappar du
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: "#3a3330",
              textTransform: "uppercase",
            }}
          >
            mest tid?
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 32,
              color: "#5a4f48",
            }}
          >
            Ett par minuters snabba frågor. Tre konkreta förslag direkt.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(58,51,48,0.14)",
            paddingTop: 28,
            fontSize: 26,
            color: "#3a3330",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>Khyte Automations</div>
          <div style={{ display: "flex", color: "#9c8e82" }}>khyte.se</div>
        </div>
      </div>
    ),
    OG_STORLEK,
  );
}
