import "server-only";

import { Resend } from "resend";
import {
  FRAGA,
  MAL_FRAS,
  SAJT,
  SPECIAL,
  TEXT,
  VISA_PER_MANAD_UNDER,
} from "@/kompass/data/kompass";
import { malFranText } from "@/kompass/lib/flode";
import { tolkaForslag } from "@/kompass/lib/forslagstext";
import type { SvarsRad } from "@/kompass/server/rad";
import type { SparatForslag } from "@/kompass/lib/sammanstallning";
import { formateraKronor, formateraTal, formateraTimmarKort, perManad } from "@/kompass/lib/tid";

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

/**
 * Mottagarna i en miljövariabel. Flera adresser skrivs med kommatecken
 * emellan ("hai@khyte.se,erik@khyte.se") — alla får samma mejl.
 */
function mottagare(namn: "SALES_EMAIL" | "ADMIN_EMAIL"): string[] {
  const adresser = (process.env[namn] ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  if (adresser.length === 0) throw new Error(`${namn} saknas. Se .env.example.`);
  return adresser;
}

function avsandare(): string {
  const from = process.env.MAIL_FROM;
  if (!from) {
    throw new Error("MAIL_FROM saknas. Se .env.example.");
  }
  return from;
}

type Utskick = Parameters<Resend["emails"]["send"]>[0] & {
  /**
   * Idempotensnyckel: samma nyckel inom ett dygn skickas bara en gång hos
   * Resend — skydd mot dubbletter om två körningar tar samma lead.
   */
  nyckel?: string;
};

/**
 * Skickar ett mejl och kastar om Resend nekar det. Resend kastar inte själv:
 * ett nekat utskick kommer tillbaka som { error }. Utan den här kontrollen
 * markerades nekade mejl som skickade och försöktes aldrig igen.
 */
async function skicka({ nyckel, ...utskick }: Utskick): Promise<void> {
  const { error } = await klient().emails.send(
    utskick as Parameters<Resend["emails"]["send"]>[0],
    nyckel ? { idempotencyKey: nyckel } : undefined,
  );
  if (error) {
    throw new Error(`Resend nekade utskicket (${error.name}): ${error.message}`);
  }
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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f8f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#3a3330;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    ${innehall}
    <hr style="border:none;border-top:1px solid rgba(58,51,48,0.12);margin:28px 0 18px;">
    <table role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;padding:0 8px 0 0;"><img src="${SAJT.bas}/signature-assets/khyte-logo.png" width="20" height="20" alt="" style="display:block;border:0;"></td>
        <td style="vertical-align:middle;font-size:13px;color:#9c8e82;"><strong style="font-weight:600;color:#3a3330;">Khyte Automations</strong> · <a href="${SAJT.bas}" style="color:#9c8e82;">khyte.se</a></td>
      </tr>
    </table>
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
export async function skickaSaljnotis(rad: SvarsRad, nyckel?: string): Promise<void> {
  const till = mottagare("SALES_EMAIL");

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
    ["När det inte fungerar", svarText(rad, FRAGA.konsekvens)],
    // Bara specialfrågor som ställts — en tillverkare har inga samtalssvar.
    ...Object.values(SPECIAL)
      .filter((f) => svarText(rad, f.id) !== "—")
      .map((f): [string, string] => [f.etikett, svarText(rad, f.id)]),
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
          ${o.lagt_min !== null ? timmar(o.lagt_min, o.lagt_max) : skyddaHtml(o.skal ?? "")}
          — spara ${timmar(o.besparing_min, o.besparing_max)}
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

  await skicka({
    nyckel,
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

/** Kortar en text till högst max tecken, vid ett ord. */
function kortad(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, t.lastIndexOf(" ", max - 1) > 0 ? t.lastIndexOf(" ", max - 1) : max - 1)}…`;
}

/**
 * Ett förslag i resultatmejlet: rubrik och en mening. Hur det skulle se ut
 * steg för steg tar vi på mötet — mejlet ska gå att läsa på en halv minut.
 *
 * Arbetsflödet besökaren beskrev får deras egna ord och, om AI:n hunnit ta
 * fram ett förslag, dess första mening — det mest personliga i resultatet.
 * Stegen står bara i säljnotisen.
 */
function forslagRad(f: SparatForslag, nummer: number, aiForslag: string | null): string {
  const rad =
    f.kalla === "onskemal"
      ? `${TEXT.resultat.duSkrev} ”${skyddaHtml(kortad(f.varfor, 160))}”`
      : skyddaHtml(f.affarsnytta ?? f.varfor);
  const losning =
    f.kalla === "onskemal" && aiForslag ? kortad(tolkaForslag(aiForslag).sammanfattning, 220) : "";

  return `
    <tr>
      <td style="vertical-align:top;width:34px;padding:16px 0;border-top:1px solid #ece7e2;font-size:14px;font-weight:700;color:#c05e20;">${String(nummer).padStart(2, "0")}</td>
      <td style="vertical-align:top;padding:16px 0;border-top:1px solid #ece7e2;">
        <p style="margin:0;font-size:16px;line-height:1.35;font-weight:700;color:#3a3330;">${skyddaHtml(f.rubrik)}</p>
        ${rad ? `<p style="margin:6px 0 0;font-size:14px;line-height:1.5;color:#5a4f48;">${rad}</p>` : ""}
        ${losning ? `<p style="margin:6px 0 0;font-size:14px;line-height:1.5;color:#3a3330;">${skyddaHtml(losning)}</p>` : ""}
      </td>
    </tr>`;
}

/** Resultatmejl till användaren: en siffra, tre förslag, ett möte. */
export async function skickaResultatmejl(rad: SvarsRad, nyckel?: string): Promise<void> {
  const mejl = rad.mejl?.trim();
  if (!mejl) throw new Error("Ingen mejladress att skicka till.");

  const { amne, html } = resultatmejl(rad);
  await skicka({
    nyckel,
    from: avsandare(),
    // Mejlet ber besökaren svara — svaret ska alltid landa hos oss.
    replyTo: SAJT.mejl,
    to: mejl,
    subject: amne,
    html,
  });
}

/**
 * Resultatmejlets ämne och innehåll. Skickar inget — går att förhandsvisa.
 * Samma upplägg som resultatsidan: siffran, tre förslag och ett möte.
 */
export function resultatmejl(rad: SvarsRad): { amne: string; html: string } {
  const halsning = rad.kontakt_namn?.trim()
    ? `Hej ${skyddaHtml(rad.kontakt_namn.trim().split(" ")[0])}!`
    : "Hej!";
  const mal = malFranText(rad.mal);
  const intro = `${halsning} Utifrån dina svar har vi tagit fram tre saker vi skulle börja med.${
    mal ? ` Du ville ${skyddaHtml(MAL_FRAS[mal](false))}, så vi börjar där.` : ""
  }`;

  // Samma siffra som på sidan: per månad när veckotiden är liten.
  const besparing = { min: Number(rad.besparing_min ?? 0), max: Number(rad.besparing_max ?? 0) };
  const perManadVisas = besparing.max > 0 && besparing.max < VISA_PER_MANAD_UNDER;
  // Draken från kompassens startsida flyger i rutans högra kant. Den har
  // mindre luft runt sig än texten, så rutan blir inte högre och texten
  // står där den alltid stått.
  const siffra =
    besparing.max > 0
      ? `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;margin:0 0 28px;border-collapse:separate;border-spacing:0;background:#f8f6f3;border-radius:12px;">
           <tr>
             <td style="vertical-align:middle;padding:20px 22px;">
               <p style="${ETIKETT}">${TEXT.resultat.frigor}</p>
               <p style="margin:6px 0 0;font-size:30px;line-height:1.1;font-weight:700;color:#c05e20;">
                 ${formateraTimmarKort(perManadVisas ? perManad(besparing) : besparing)}
                 <span style="font-size:15px;font-weight:400;color:#5a4f48;">${perManadVisas ? TEXT.resultat.frigorFotManad : TEXT.resultat.frigorFot}</span>
               </p>
             </td>
             <td style="vertical-align:middle;width:37px;padding:8px 22px 8px 0;"><img src="${SAJT.bas}/kompass/drake-mejl.png" width="37" height="76" alt="" style="display:block;border:0;"></td>
           </tr>
         </table>`
      : "";

  const forslag = (rad.forslag ?? []).map((f, i) => forslagRad(f, i + 1, rad.ai_forslag)).join("");

  return {
    amne: "Ditt resultat från Automationskompassen",
    html: ram(
      `<h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;">Här är ditt resultat</h1>
       <p style="margin:0 0 28px;font-size:15px;line-height:1.55;color:#5a4f48;">${intro}</p>
       ${siffra}
       ${
         forslag
           ? `<p style="${ETIKETT}">${TEXT.resultat.forslagRubrik}</p>
              <table role="presentation" style="border-collapse:collapse;width:100%;margin:8px 0 0;border-bottom:1px solid #ece7e2;">${forslag}</table>`
           : ""
       }
       <div style="margin:32px 0 0;padding:24px 22px;background:#f8f6f3;border-radius:12px;">
         <p style="margin:0;font-size:18px;line-height:1.3;font-weight:700;">${TEXT.resultat.mote.rubrik}</p>
         <p style="margin:6px 0 18px;font-size:15px;line-height:1.5;color:#5a4f48;">${TEXT.resultat.mote.brodtext}</p>
         <a href="${SAJT.bokaMote}" style="display:inline-block;padding:14px 28px;background:#c05e20;border-radius:999px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">${TEXT.resultat.mote.knapp}</a>
       </div>
       <p style="margin:24px 0 0;font-size:13px;line-height:1.55;color:#9c8e82;">
         Siffran är en första uppskattning utifrån dina svar, inte ett löfte.
         Vi hör av oss inom ett dygn. Vill du höra av dig innan, svara på det här
         mejlet eller ring <span style="white-space:nowrap;">${SAJT.telefon}</span>.
       </p>`,
    ),
  };
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
  const till = mottagare("SALES_EMAIL");

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

  await skicka({
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
  const till = mottagare("ADMIN_EMAIL");

  await skicka({
    // Ett larm per besök och steg, även om två körningar skulle larma samtidigt.
    nyckel: `kompass-larm-${sessionId}-${steg}`,
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
