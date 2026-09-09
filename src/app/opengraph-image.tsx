import { ImageResponse } from "next/og";

/**
 * Social share card, generated as a real 1200×630 PNG.
 *
 * This replaces the old `opengraph-image.svg` — a 375×374 copy of the logo
 * mark that was declared as 1200×630. LinkedIn, Slack and X do not rasterize
 * SVG, so every share rendered as a blank card.
 *
 * Deliberately type-led with no external assets: satori cannot rasterize the
 * filter/clipPath-heavy logo exports in /public, and neither Bebas nor Satoshi
 * exists on disk as a .ttf to hand it. Building the card out of the espresso
 * tokens instead keeps it brand-correct with no build-time network fetch.
 *
 * Only Geist Regular ships with @vercel/og, so the `fontWeight` values below
 * are inert today — they are kept so the card thickens correctly if a bold
 * face is ever vendored in. Weight is carried by scale and colour instead.
 */

export const alt = "Khyte Automations — automationer som tar bort manuellt arbete";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors :root[data-theme="espresso"] in globals.css.
const INK = "#1B0803";
const CREAM = "#F4F1EF";
const ACCENT = "#D4622B";
const HEAT = "#5E1E10";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Warm bloom from the lower left — the same heat the site's espresso
            bands carry, so the card reads as part of the site. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `radial-gradient(1100px 780px at 2% 112%, ${HEAT} 0%, rgba(120,40,20,0.72) 26%, rgba(94,30,16,0.30) 52%, rgba(27,8,3,0) 78%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `radial-gradient(620px 440px at 96% -14%, rgba(212,98,43,0.34) 0%, rgba(27,8,3,0) 72%)`,
          }}
        />

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 44, height: 4, background: ACCENT }} />
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(244,241,239,0.72)",
              fontWeight: 600,
            }}
          >
            Khyte Automations
          </div>
        </div>

        {/* Headline — two lines with the accent on the second, the same
            treatment PageHeader uses for every page title on the site. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", color: CREAM }}>Inget onödigt skit.</div>
          <div style={{ display: "flex", color: ACCENT }}>Bara automationer</div>
          <div style={{ display: "flex", color: ACCENT }}>som håller.</div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(244,241,239,0.18)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", fontSize: 30, color: CREAM, fontWeight: 700 }}>
            khyte.se
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(244,241,239,0.62)",
              letterSpacing: "0.08em",
            }}
          >
            Borås · Sverige
          </div>
        </div>
      </div>
    ),
    size,
  );
}
