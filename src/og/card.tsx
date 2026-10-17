import type { ReactElement, ReactNode } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/**
 * Shared kit for the social share cards (opengraph-image.tsx in each route).
 *
 * Every card is the same frame: the espresso-to-orange backdrop with the white
 * logo top left, a headline and sub on the dark side, and the page's proof on
 * the glow to the right (Hai, a case result, or a small piece of UI).
 *
 * The backdrop's film grain makes a PNG weigh ~1.2 MB, which WhatsApp and
 * iMessage previews can drop. renderCard() re-encodes to JPEG (~135 KB), so
 * every route exports contentType "image/jpeg".
 *
 * Assets are read once at import. Cards are prerendered at build, so this runs
 * there and nowhere else.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/jpeg";

// Every path is written out in full so the build traces only these files;
// a path passed in as a variable makes it trace the whole project.
const dataUri = (file: Buffer, type: "png" | "jpeg") => `data:image/${type};base64,${file.toString("base64")}`;

export const assets = {
  backdrop: dataUri(readFileSync(join(process.cwd(), "src/og/assets/backdrop.jpg")), "jpeg"),
  logo: dataUri(readFileSync(join(process.cwd(), "src/og/assets/logo-white.png")), "png"),
  /** Cutout of the studio portrait in /public, background keyed out. */
  hai: dataUri(readFileSync(join(process.cwd(), "src/og/assets/hai.png")), "png"),
  sebastian: dataUri(readFileSync(join(process.cwd(), "public/sebastian.jpg")), "jpeg"),
  mattias: dataUri(readFileSync(join(process.cwd(), "public/mattiashietala.jpg")), "jpeg"),
};

const fonts = [
  { name: "Satoshi", data: readFileSync(join(process.cwd(), "src/og/fonts/Satoshi-Medium.ttf")), weight: 500 as const, style: "normal" as const },
  { name: "Satoshi", data: readFileSync(join(process.cwd(), "src/og/fonts/Satoshi-Bold.ttf")), weight: 700 as const, style: "normal" as const },
  { name: "Satoshi", data: readFileSync(join(process.cwd(), "src/og/fonts/Satoshi-Black.ttf")), weight: 900 as const, style: "normal" as const },
];

// Espresso palette from globals.css; the accent is lifted for contrast on the dark side.
const CREAM = "#F7F1EA";
const SOFT = "rgba(247,241,234,0.74)";
const FAINT = "rgba(247,241,234,0.55)";
const GLOW = "#F6A266";
export const DEEP = "#D4622B";
const ESPRESSO = "#1B0803";
const WASH = "#FFE2C6";
export const INK = "#1E1A16";
export const MUTED = "#6B5F55";

export async function renderCard(card: ReactElement): Promise<Response> {
  const png = await new ImageResponse(card, { ...OG_SIZE, fonts }).arrayBuffer();
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": OG_CONTENT_TYPE } });
}

/* ---------- frame and type ---------- */

export function Frame({ children, right, footer = <Site /> }: { children: ReactNode; right?: ReactNode; footer?: ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: ESPRESSO, fontFamily: "Satoshi" }}>
      <img src={assets.backdrop} width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: "absolute", left: 0, top: 0 }} />
      {right}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 54,
          bottom: 56,
          width: 640,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <img src={assets.logo} width={182} height={72} />
        <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
        {footer}
      </div>
    </div>
  );
}

/** Two parts, the second in the accent — the same split PageHeader uses. */
export function Headline({ lead, accent, size = 66, width = 620 }: { lead: string; accent?: string; size?: number; width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.06,
        letterSpacing: "-0.035em",
        color: CREAM,
        width,
      }}
    >
      <div style={{ display: "flex", textWrap: "balance" }}>{lead}</div>
      {accent ? <div style={{ display: "flex", textWrap: "balance", color: GLOW }}>{accent}</div> : null}
    </div>
  );
}

export function Sub({ children, width = 540 }: { children: ReactNode; width?: number }) {
  return (
    <div style={{ display: "flex", marginTop: 24, fontSize: 27, lineHeight: 1.4, color: SOFT, fontWeight: 500, width }}>
      {children}
    </div>
  );
}

/* ---------- footers ---------- */

function FooterText({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: FAINT }}>{children}</div>;
}

export function Site() {
  return <FooterText>khyte.se</FooterText>;
}

/** Names the client on case cards. */
export function Client({ name }: { name: string }) {
  return <FooterText>Case: {name}</FooterText>;
}

/** A client's own words. Quote them verbatim. */
export function Quote({ photo, quote, name, role }: { photo: string; quote: string; name: string; role: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <img src={photo} width={56} height={56} style={{ borderRadius: 28, border: "2px solid rgba(246,162,102,0.6)" }} />
      <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
        <div style={{ display: "flex", fontSize: 21, fontWeight: 700, color: CREAM, lineHeight: 1.3 }}>”{quote}”</div>
        <div style={{ display: "flex", fontSize: 18, fontWeight: 500, color: FAINT }}>
          {name}, {role}
        </div>
      </div>
    </div>
  );
}

/* ---------- right-hand visuals ---------- */

/** Hai standing in the glow, with a warm light behind his head. */
export function HaiPhoto({ children }: { children?: ReactNode }) {
  const x = 790;
  const top = 96;
  const width = 382;
  const light = 660;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          left: x + width / 2 - light / 2,
          top: top - 150,
          width: light,
          height: light,
          display: "flex",
          background:
            "radial-gradient(circle at 50% 50%, rgba(246,162,102,0.42) 0%, rgba(232,131,58,0.16) 42%, rgba(232,131,58,0) 70%)",
        }}
      />
      <img src={assets.hai} width={width} height={720} style={{ position: "absolute", left: x, top }} />
      {children}
    </div>
  );
}

export function Pill({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        padding: "14px 26px",
        borderRadius: 999,
        background: CREAM,
        fontSize: 23,
        fontWeight: 700,
        color: INK,
        boxShadow: "0 14px 34px rgba(20,6,2,0.45)",
      }}
    >
      {children}
    </div>
  );
}

export function Panel({ x, y, width, rotate, children }: { x: number; y: number; width: number; rotate?: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        borderRadius: 22,
        padding: "22px 26px",
        boxShadow: "0 22px 50px rgba(20,6,2,0.45)",
        ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
      }}
    >
      {children}
    </div>
  );
}

/** For things that are done. Not decoration. */
export function Check() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="13" fill={WASH} />
      <path d="M7.5 13.5l3.5 3.5 7.5-8" stroke={DEEP} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A result in a thin ring, read top to bottom: ["4 min", "10 sek"] stacks with arrows between. */
export function Result({ steps, label }: { steps: string[]; label: string }) {
  const longest = Math.max(...steps.map((s) => s.length));
  const stepSize = steps.length === 1 ? 120 : Math.min(steps.length > 2 ? 46 : 64, Math.floor(820 / longest));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          left: 985 - 255,
          top: 330 - 255,
          width: 510,
          height: 510,
          borderRadius: 255,
          display: "flex",
          border: "1.5px solid rgba(255,226,198,0.34)",
          background: "radial-gradient(circle at 50% 50%, rgba(255,190,130,0.20) 0%, rgba(255,190,130,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 735,
          top: 80,
          width: 500,
          height: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFF8F1",
          textAlign: "center",
        }}
      >
        {steps.map((step, i) => (
          <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 ? <div style={{ display: "flex", fontSize: 34, fontWeight: 500, opacity: 0.7, margin: "2px 0" }}>↓</div> : null}
            <div style={{ display: "flex", fontSize: stepSize, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{step}</div>
          </div>
        ))}
        <div style={{ display: "flex", marginTop: 22, fontSize: 23, fontWeight: 500, opacity: 0.9, width: 380, justifyContent: "center" }}>
          {label}
        </div>
      </div>
    </div>
  );
}
