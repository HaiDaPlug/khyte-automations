import "server-only";

import { Resend } from "resend";
import {
  CASE,
  FRAGA,
  MAL_FRAS,
  OMRADEN,
  OMRADESNYCKEL,
  SAJT,
  SPECIAL,
} from "@/kompass/data/kompass";
import { malFranText } from "@/kompass/lib/flode";
import { tolkaForslag } from "@/kompass/lib/forslagstext";
import type { SvarsRad } from "@/kompass/server/rad";
import type { SparatForslag } from "@/kompass/lib/sammanstallning";
import { formateraKronor, formateraTal } from "@/kompass/lib/tid";

/**
 * Mejlutskick via Resend.
 *
 * Två mallar: en notis till säljaren och ett resultatmejl till användaren.
 * Båda i Khytes ton — rak, avslappnad, ingen säljighet.
 */

let resend: Resend | null = null;

function klient(): Resend {
  if (resend) return resend;

  const nyckel = process.env.RESEND_API_KEY;
  if (!nyckel) {
    throw new Error("RESEND_API_KEY saknas. Se .env.example.");
  }

  resend = new Resend(nyckel);
  return resend;
}

function avsandare(): string {
  const from = process.env.MAIL_FROM;
  if (!from) {
    throw new Error("MAIL_FROM saknas. Se .env.example.");
  }
  return from;
}

/** Skyddar mot att inmatad text bryter ut ur HTML:en. */
function skyddaHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Gemensam ram runt mejlen, med sajtens färger. */
function ram(innehall: string): string {
  return `<!doctype html>
<html lang="sv">
<body style="margin:0;padding:24px;background:#f8f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#3a3330;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    ${innehall}
    <hr style="border:none;border-top:1px solid rgba(58,51,48,0.12);margin:28px 0 18px;">
    <p style="margin:0;font-size:13px;color:#9c8e82;">
      Khyte Automations · <a href="${SAJT.bas}" style="color:#c05e20;">khyte.se</a>
    </p>
  </div>
</body>
</html>`;
}

/** Skriver ett timintervall kort på svenska: "3–6 h/vecka". */
function timmar(min: number | null, max: number | null): string {
  if (min === null || max === null) return "—";
  const a = formateraTal(Number(min));
  const b = formateraTal(Number(max));
  return `${a === b ? a : `${a}–${b}`} h/vecka`;
}

function kronor(rad: SvarsRad): string | null {
  if (rad.kronor_min === null || rad.kronor_max === null) return null;
  return `${formateraKronor({ min: rad.kronor_min, max: rad.kronor_max })}/mån`;
}

const ETIKETT = "margin:0;font-size:13px;color:#9c8e82;";

/** "linkedin / höstkampanj · via google.com · mobil" */
function kallText(rad: SvarsRad): string {
  const utm = [rad.utm_source, rad.utm_campaign].filter(Boolean).join(" / ");
  const delar = [
    utm || null,
    rad.referrer ? `via ${rad.referrer}` : null,
    rad.enhet,
  ].filter(Boolean);
  return delar.length > 0 ? delar.join(" · ") : "Direkt";
}

/** Ett svar ur raden som text, eller "—". Listor blir kommaseparerade. */
function svarText(rad: SvarsRad, id: string): string {
  const v = rad.svar?.[id];
  if (Array.isArray(v)) return v.join(", ") || "—";
  return typeof v === "string" && v.trim() ? v : "—";
}

/** Notis till säljaren: allt som behövs för att förbereda samtalet. */
export async function skickaSaljnotis(rad: SvarsRad): Promise<void> {
  const till = process.env.SALES_EMAIL;
  if (!till) throw new Error("SALES_EMAIL saknas. Se .env.example.");

  const foretag = rad.foretag?.trim() || rad.kontakt_namn?.trim() || "Okänt";

  const rader: [string, string][] = [
    ["Företag", rad.foretag || "—"],
    ["Namn", rad.kontakt_namn || "—"],
    ["Telefon", rad.telefon || "—"],
    ["Mejl", rad.mejl || "—"],
    ["Ort", rad.ort || "—"],
    ["Bransch", rad.bransch ?? "—"],
    ["Antal", rad.antal_anstallda ?? "—"],
    ["Roll", rad.roll ?? "—"],
    ["Mål", rad.mal ?? "—"],
    // Bara specialfrågor som ställts — en tillverkare har inga samtalssvar.
    ...Object.values(SPECIAL)
      .filter((f) => svarText(rad, f.id) !== "—")
      .map((f): [string, string] => [f.etikett, svarText(rad, f.id)]),
    [
      "Stämmer bedömningen?",
      rad.bekraftelse
        ? `${rad.bekraftelse}${rad.bekraftelse_text ? ` — ”${rad.bekraftelse_text}”` : ""}`
        : "—",
    ],
    ["Vill komma igång", rad.tidshorisont ?? "—"],
    ["System", (rad.verktyg ?? []).join(", ") || "—"],
    ["Samma info i flera system", svarText(rad, FRAGA.dubbelinmatning)],
    ...(rad.missade_samtal
      ? [["Missade samtal", `${rad.missade_samtal}/vecka`] as [string, string]]
      : []),
    ...(rad.svarstid ? [["Svarstid", rad.svarstid] as [string, string]] : []),
    ...(rad.kundvarde ? [["Kundvärde", rad.kundvarde] as [string, string]] : []),
    ["Lägger i dag", timmar(rad.timmar_min, rad.timmar_max)],
    ["Möjlig besparing", timmar(rad.besparing_min, rad.besparing_max)],
      ["Uteblivna affärer (internt)", kronor(rad) ?? "—"],
    ["Referent", rad.ref ?? "—"],
    ["Källa", kallText(rad)],
  ];

  const tabell = rader
    .map(
      ([etikett, varde]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#9c8e82;font-size:14px;white-space:nowrap;vertical-align:top;">${skyddaHtml(etikett)}</td>
          <td style="padding:6px 0;font-size:15px;font-weight:600;">${skyddaHtml(varde)}</td>
        </tr>`,
    )
    .join("");

  const omraden = (rad.omraden ?? [])
    .map(
      (o) =>
        `<li style="margin:0 0 6px;font-size:15px;">
          <strong>${skyddaHtml(o.namn)}</strong>${o.foreslaget ? " (föreslaget)" : ""}:
          ${o.lagt_min !== null ? `${timmar(o.lagt_min, o.lagt_max)}, ${skyddaHtml((o.idag ?? "").toLowerCase())}` : skyddaHtml(o.skal ?? "")}
          — spara ${timmar(o.besparing_min, o.besparing_max)}
          ${svarText(rad, OMRADESNYCKEL.konsekvens(o.id)) !== "—" ? `<br><span style="color:#5a4f48;">När det inte fungerar: ${skyddaHtml(svarText(rad, OMRADESNYCKEL.konsekvens(o.id)).toLowerCase())}</span>` : ""}
        </li>`,
    )
    .join("");

  const extra: string[] = [];

  if (omraden) {
    extra.push(
      `<p style="${ETIKETT}margin-top:20px;">Görs för hand</p>
       <ul style="margin:6px 0 0;padding-left:20px;">${omraden}</ul>`,
    );
  }

  const visade = (rad.forslag ?? [])
    .map(
      (f, i) =>
        `<li style="margin:0 0 4px;font-size:15px;">${skyddaHtml(f.rubrik)}${i === 0 ? " <em>(synligt före mejl)</em>" : ""}</li>`,
    )
    .join("");
  if (visade) {
    extra.push(
      `<p style="${ETIKETT}margin-top:20px;">Förslagen besökaren fick</p>
       <ol style="margin:6px 0 0;padding-left:20px;">${visade}</ol>`,
    );
  }

  if (rad.fritext?.trim()) {
    extra.push(
      `<p style="${ETIKETT}margin-top:20px;">Arbetsflöde de vill ska sköta sig självt</p>
       <p style="margin:4px 0 0;font-size:15px;">${skyddaHtml(rad.fritext)}</p>`,
    );
  }

  if (rad.ai_forslag) {
    extra.push(
      `<p style="${ETIKETT}margin-top:14px;">Förslaget besökaren fick (AI)</p>
       <p style="margin:4px 0 0;font-size:15px;">${skyddaHtml(rad.ai_forslag)}</p>`,
    );
  }

  if (rad.tips_namn?.trim() || rad.tips_kontakt?.trim()) {
    extra.push(
      `<p style="${ETIKETT}margin-top:20px;">Tipsade om någon annan</p>
       <p style="margin:4px 0 0;font-size:15px;">${skyddaHtml(rad.tips_namn ?? "")} ${skyddaHtml(rad.tips_kontakt ?? "")}</p>`,
    );
  }

  await klient().emails.send({
    from: avsandare(),
    to: till,
    subject: `Nytt lead från Kompassen: ${foretag}`,
    html: ram(
      `<h1 style="margin:0 0 6px;font-size:22px;">Nytt lead från Kompassen</h1>
       <p style="margin:0 0 20px;font-size:15px;color:#5a4f48;">Någon har precis gått igenom flödet och lämnat sin mejl. Fyller de i namn eller telefon på tacksidan kommer det i ett eget mejl.</p>
       <table style="border-collapse:collapse;width:100%;">${tabell}</table>
       ${extra.join("")}`,
    ),
  });
}

/** Ett förslag som HTML — samma innehåll och ordning som kortet på sidan. */
function forslagHtml(f: SparatForslag, nummer: number, rad: SvarsRad): string {
  const omrade = OMRADEN.find((o) => o.id === f.id);

  // Önskemålets flöde kommer från Claude och tolkas till samma form.
  const claude =
    f.kalla === "onskemal" && rad.ai_forslag ? tolkaForslag(rad.ai_forslag) : null;
  const steg = claude ? claude.steg : f.steg;

  const kallaText =
    f.kalla === "signal"
      ? "Syns i dina svar"
      : f.kalla === "bransch"
        ? "Vanligt i er bransch"
        : f.kalla === "ide"
          ? "Ett steg längre"
          : null;

  // Kedjor och AI-förslag bygger ofta på flera områden — visa vilka.
  const flera = (f.omraden ?? [])
    .map((id) => OMRADEN.find((o) => o.id === id)?.namn)
    .filter(Boolean);
  const byggerIhop =
    flera.length > 1
      ? `<p style="margin:0 0 12px;font-size:13px;color:#5a4f48;">Binder ihop: ${flera.map((n) => skyddaHtml(n ?? "")).join(" · ")}</p>`
      : "";

  const stegHtml = steg
    .map(
      (s, i) => `
        <tr>
          <td style="vertical-align:top;padding:0 10px 10px 0;">
            <span style="display:inline-block;width:24px;height:24px;line-height:24px;border-radius:12px;background:#c05e20;color:#fff;text-align:center;font-size:13px;font-weight:700;">${i + 1}</span>
          </td>
          <td style="vertical-align:top;padding:2px 0 10px;font-size:14px;color:#3a3330;">${skyddaHtml(s)}</td>
        </tr>`,
    )
    .join("");

  const fall = (omrade?.caseIds ?? [])
    .map((id) => CASE[id])
    .filter(Boolean)
    .map(
      (c) => `
      <p style="margin:12px 0 0;padding-left:12px;border-left:2px solid #c05e20;font-size:14px;color:#3a3330;">
        ${c.citat ? `<em>”${skyddaHtml(c.citat)}”</em><br><span style="color:#9c8e82;">${skyddaHtml(c.namn ?? "")}, ${skyddaHtml(c.foretag)}</span>` : `${skyddaHtml(c.resultat ?? "")}<br><span style="color:#9c8e82;">${skyddaHtml(c.foretag)}</span>`}
      </p>`,
    )
    .join("");

  const besparing =
    f.besparing_min !== null && f.besparing_max !== null
      ? `Sparar troligen <strong>${timmar(f.besparing_min, f.besparing_max)}</strong>${f.tjanster ? ` — ${skyddaHtml(f.tjanster)}` : ""}${f.lagt_min !== null ? `, av de ${timmar(f.lagt_min, f.lagt_max)} som går åt i dag` : ""}.`
      : null;

  return `
    <div style="background:#f0ede9;border-radius:12px;padding:20px;margin:0 0 14px;${f.kalla === "onskemal" ? "border:2px solid #c05e20;" : ""}">
      <p style="margin:0 0 4px;font-size:13px;color:#c05e20;font-weight:700;">${String(nummer).padStart(2, "0")}.${kallaText ? ` · ${kallaText}` : ""}${omrade ? ` · ${omrade.fardig ? "Färdig lösning" : "Byggs skräddarsytt"}` : ""}</p>
      <p style="margin:0 0 10px;font-size:18px;font-weight:700;">${skyddaHtml(f.rubrik)}</p>
      ${byggerIhop}
      ${f.affarsnytta ? `<p style="margin:0 0 14px;padding-left:12px;border-left:3px solid #c05e20;font-size:15px;font-weight:600;">${skyddaHtml(f.affarsnytta)}</p>` : ""}
      ${f.varfor ? `<p style="${ETIKETT}">${f.kalla === "onskemal" ? "Du skrev" : "Därför föreslår vi det här"}</p><p style="margin:4px 0 14px;font-size:15px;">${f.kalla === "onskemal" ? `<strong>”${skyddaHtml(f.varfor)}”</strong>` : skyddaHtml(f.varfor)}</p>` : ""}
      <p style="${ETIKETT}">Så skulle det kunna se ut</p>
      ${claude?.sammanfattning ? `<p style="margin:4px 0 10px;font-size:15px;">${skyddaHtml(claude.sammanfattning)}</p>` : ""}
      ${f.kalla === "onskemal" && !claude && !stegHtml ? `<p style="margin:4px 0 10px;font-size:14px;color:#5a4f48;">Vi tar med det här i genomgången och visar hur det skulle kunna se ut.</p>` : ""}
      ${stegHtml ? `<table style="border-collapse:collapse;margin-top:8px;">${stegHtml}</table>` : ""}
      ${f.slipper ? `<p style="margin:6px 0 0;font-size:14px;color:#5a4f48;"><strong style="color:#3a3330;">Det här försvinner:</strong> ${skyddaHtml(f.slipper)}</p>` : ""}
      ${besparing || f.pengar ? `<div style="margin:14px 0 0;padding:12px 14px;background:#c05e20;border-radius:8px;color:#fff;font-size:14px;">${besparing ?? ""}${besparing && f.pengar ? "<br>" : ""}${f.pengar ? skyddaHtml(f.pengar) : ""}</div>` : ""}
      ${fall}
      ${f.forsta_steget ? `<p style="margin:14px 0 0;padding:10px 12px;background:#f8f6f3;border-radius:8px;font-size:14px;"><strong>Första steget:</strong> ${skyddaHtml(f.forsta_steget)}</p>` : ""}
    </div>`;
}

/** Resultatmejl till användaren — hela resultatet, alla tre förslagen. */
export async function skickaResultatmejl(rad: SvarsRad): Promise<void> {
  const mejl = rad.mejl?.trim();
  if (!mejl) throw new Error("Ingen mejladress att skicka till.");

  const forslag = (rad.forslag ?? []).map((f, i) => forslagHtml(f, i + 1, rad)).join("");

  const plan = (rad.plan ?? []).length
    ? `<p style="${ETIKETT}margin-top:6px;">Så skulle vi lägga upp det</p>
       <table style="border-collapse:collapse;width:100%;margin:8px 0 18px;">${(rad.plan ?? [])
         .map(
           (p, i) => `<tr>
             <td style="vertical-align:top;padding:0 10px 10px 0;font-size:13px;font-weight:700;color:#c05e20;white-space:nowrap;">Fas ${i + 1}</td>
             <td style="vertical-align:top;padding:0 0 10px;font-size:14px;"><strong>${skyddaHtml(p.rubrik)}.</strong> ${skyddaHtml(p.text)}${p.klartNar ? `<br><span style="color:#5a4f48;">✓ ${skyddaHtml(p.klartNar)}</span>` : ""}</td>
           </tr>`,
         )
         .join("")}</table>`
    : "";

  const harTid =
    rad.timmar_max !== null && Number(rad.timmar_max) > 0;
  // Målet först — förslagen börjar där, precis som på sidan. "Jag vet inte"
  // har inget mål att upprepa.
  const mal = malFranText(rad.mal);
  const malet =
    mal && mal !== "vetinte"
      ? `<p style="margin:0 0 14px;font-size:16px;">Du sa att det som skulle göra störst skillnad är att <strong>${skyddaHtml(MAL_FRAS[mal](false))}</strong> — därför börjar förslagen där.</p>`
      : "";
  const summor = harTid
    ? `<p style="margin:0 0 6px;font-size:16px;">Ni lägger i dag <strong>${timmar(rad.timmar_min, rad.timmar_max)}</strong> på det du valde.</p>
       ${rad.besparing_max !== null && Number(rad.besparing_max) > 0 ? `<p style="margin:0 0 18px;font-size:16px;">Troligen går <strong>${timmar(rad.besparing_min, rad.besparing_max)}</strong> att spara.</p>` : ""}`
    : "";

  const halsning = rad.kontakt_namn?.trim()
    ? `Hej ${skyddaHtml(rad.kontakt_namn.trim().split(" ")[0])}!`
    : "Hej!";

  await klient().emails.send({
    from: avsandare(),
    to: mejl,
    subject: "Ditt resultat från Automationskompassen",
    html: ram(
      `<h1 style="margin:0 0 6px;font-size:22px;">Här är ditt resultat</h1>
       <p style="margin:0 0 20px;font-size:15px;color:#5a4f48;">${halsning} Det här såg vi utifrån dina svar — och tre saker vi skulle börja med.</p>
       ${malet}
       ${summor}
       ${plan}
       ${forslag}
       <p style="margin:20px 0 0;font-size:15px;color:#5a4f48;">
         Det här är en första uppskattning byggd på dina svar — inte ett löfte.
         Varje område räknas bara en gång. Vi validerar siffrorna i ett kort
         förprojekt, mot hur det faktiskt ser ut hos er.
       </p>
       <p style="margin:20px 0 0;font-size:15px;">
         Vi hör av oss inom ett dygn. Vill du höra av dig först går det bra på
         <a href="mailto:${SAJT.mejl}" style="color:#c05e20;">${SAJT.mejl}</a>
         eller ${SAJT.telefon}.
       </p>`,
    ),
  });
}

/**
 * Kort notis till säljaren när ett lead fyllt i det frivilliga på tacksidan.
 * Kommer efter säljnotisen, så att säljaren får leadet direkt och detaljerna
 * när de finns.
 */
export async function skickaKompletteringsnotis(rad: {
  mejl: string | null;
  kontakt_namn: string | null;
  foretag: string | null;
  telefon: string | null;
  ort: string | null;
  tips_namn: string | null;
  tips_kontakt: string | null;
  roll: string | null;
  tidshorisont: string | null;
}): Promise<void> {
  const till = process.env.SALES_EMAIL;
  if (!till) throw new Error("SALES_EMAIL saknas. Se .env.example.");

  const rader: [string, string | null][] = [
    ["Namn", rad.kontakt_namn],
    ["Företag", rad.foretag],
    ["Telefon", rad.telefon],
    ["Ort", rad.ort],
    ["Roll", rad.roll],
    ["Vill komma igång", rad.tidshorisont],
    ["Tipsade om", [rad.tips_namn, rad.tips_kontakt].filter(Boolean).join(" ") || null],
  ];

  const tabell = rader
    .filter(([, v]) => v)
    .map(
      ([etikett, varde]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#9c8e82;font-size:14px;white-space:nowrap;">${skyddaHtml(etikett)}</td>
          <td style="padding:6px 0;font-size:15px;font-weight:600;">${skyddaHtml(varde ?? "")}</td>
        </tr>`,
    )
    .join("");

  const vem = rad.foretag?.trim() || rad.kontakt_namn?.trim() || rad.mejl || "leadet";

  await klient().emails.send({
    from: avsandare(),
    to: till,
    subject: `Kompassen: ${vem} lade till kontaktuppgifter`,
    html: ram(
      `<h1 style="margin:0 0 6px;font-size:20px;">Fler uppgifter om ${skyddaHtml(rad.mejl ?? "leadet")}</h1>
       <p style="margin:0 0 16px;font-size:15px;color:#5a4f48;">Leadet du fick nyss har fyllt i det frivilliga på tacksidan.</p>
       <table style="border-collapse:collapse;width:100%;">${tabell}</table>`,
    ),
  });
}

/** Larm till admin när ett eftersteg misslyckats tre gånger. */
export async function skickaAdminlarm(
  sessionId: string,
  steg: string,
  fel: string,
): Promise<void> {
  const till = process.env.ADMIN_EMAIL;
  if (!till) throw new Error("ADMIN_EMAIL saknas. Se .env.example.");

  await klient().emails.send({
    from: avsandare(),
    to: till,
    subject: `Kompassen: ${steg} misslyckades tre gånger`,
    html: ram(
      `<h1 style="margin:0 0 6px;font-size:20px;">Ett steg gav upp</h1>
       <p style="margin:0 0 16px;font-size:15px;color:#5a4f48;">
         Steget <strong>${skyddaHtml(steg)}</strong> har misslyckats tre gånger
         och försöks inte igen automatiskt.
       </p>
       <p style="margin:0;font-size:14px;color:#9c8e82;">Session</p>
       <p style="margin:2px 0 14px;font-size:15px;">${skyddaHtml(sessionId)}</p>
       <p style="margin:0;font-size:14px;color:#9c8e82;">Felet</p>
       <p style="margin:2px 0 0;font-size:15px;">${skyddaHtml(fel)}</p>`,
    ),
  });
}
