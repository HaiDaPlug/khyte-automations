import "server-only";

import { z } from "zod";
import { facts } from "@/data/facts";
import { AI_VANA, FOKUS, FORMAT, POLICY, TIDER, VERKTYG, etikett, type Bokning } from "@/data/konsultation";
import { avsandare, ram, saljare, skicka, skyddaHtml } from "@/server/mail";

/**
 * Booking requests for the AI-konsultation: validation and the two mails,
 * sent through src/server/mail.ts.
 *
 * Nothing the browser sends is trusted. The limits are set so an honest person
 * never hits them, but a bot can't send a novel.
 */

const ids = <T extends readonly { id: string }[]>(lista: T) =>
  lista.map((x) => x.id) as [T[number]["id"], ...T[number]["id"][]];

const text = (max: number) => z.string().trim().max(max);
const kravs = (max: number) => text(max).min(1);

export const bokningSchema = z.object({
  namn: kravs(120),
  mejl: z.email().max(200),
  telefon: text(40),
  foretag: kravs(160),
  roll: text(120),
  arbete: kravs(1500),
  aiVana: z.enum(ids(AI_VANA)),
  verktyg: z.array(z.enum(ids(VERKTYG))).max(VERKTYG.length),
  policy: z.enum(ids(POLICY)),
  fokus: z.array(z.enum(ids(FOKUS))).min(1).max(FOKUS.length),
  fragor: kravs(3000),
  mal: text(1500),
  format: z.enum(ids(FORMAT)),
  plats: text(160),
  tider: z.array(z.enum(ids(TIDER))).max(TIDER.length),
  tidNotis: text(300),
  /** Honeypot: hidden from people, so anything in it came from a bot. */
  webbplats: z.string().max(200),
  /** When the form was opened (ms). A human doesn't finish four steps in seconds. */
  startad: z.number().int().nonnegative(),
  /** Per submission, so a double click can't send the mails twice. */
  nyckel: z.string().min(8).max(100),
});

export type Bokningsforfragan = z.infer<typeof bokningSchema>;

/** Less than this from opening the form to sending it: treat it as a bot. */
export const MINSTA_TID_MS = 4000;

const RAD = "margin:0 0 14px;";
const ETIKETT = "margin:0;font-size:13px;color:#9c8e82;";
const VARDE = "margin:2px 0 0;font-size:15px;line-height:1.5;color:#3a3330;white-space:pre-wrap;";

function rad(etikettText: string, varde: string): string {
  return `<div style="${RAD}"><p style="${ETIKETT}">${etikettText}</p><p style="${VARDE}">${skyddaHtml(varde || "—")}</p></div>`;
}

function rubrik(text: string): string {
  return `<h2 style="margin:26px 0 12px;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#d4622b;">${text}</h2>`;
}

function lista(alla: readonly { id: string; label: string }[], valda: string[]): string {
  return valda.map((id) => etikett(alla, id)).join(", ");
}

/** The notification to Hai: everything needed to prepare, reply goes to the customer. */
export function notismejl(b: Bokning): { amne: string; html: string } {
  const amne = `AI-konsultation: ${b.namn}, ${b.foretag}`;
  const html = ram(`
    <p style="margin:0 0 4px;font-size:13px;color:#9c8e82;">Ny bokningsförfrågan</p>
    <h1 style="margin:0;font-size:22px;color:#3a3330;">AI-konsultation, ${skyddaHtml(b.foretag)}</h1>
    ${rubrik("Kontakt")}
    ${rad("Namn", b.namn)}
    ${rad("Roll", b.roll)}
    ${rad("Mejl", b.mejl)}
    ${rad("Telefon", b.telefon)}
    ${rubrik("Arbete och AI")}
    ${rad("Vad hen jobbar med", b.arbete)}
    ${rad("Använder AI", etikett(AI_VANA, b.aiVana))}
    ${rad("Har tillgång till", lista(VERKTYG, b.verktyg))}
    ${rad("Riktlinjer för AI på företaget", etikett(POLICY, b.policy))}
    ${rubrik("Fokus")}
    ${rad("Områden", lista(FOKUS, b.fokus))}
    ${rad("Frågor och uppgifter", b.fragor)}
    ${rad("Vill kunna efteråt", b.mal)}
    ${rubrik("Upplägg")}
    ${rad("Format", etikett(FORMAT, b.format) + (b.format === "plats" && b.plats ? `, ${b.plats}` : ""))}
    ${rad("Tider", lista(TIDER, b.tider))}
    ${rad("Om tider", b.tidNotis)}
    <p style="margin:24px 0 0;font-size:14px;color:#5a4f48;">Svara på det här mejlet för att svara ${skyddaHtml(b.namn.split(" ")[0])} direkt.</p>
  `);
  return { amne, html };
}

/** The confirmation to the customer: what happens next, and what they sent. */
export function kvittomejl(b: Bokning): { amne: string; html: string } {
  const c = facts.consultation;
  const fornamn = b.namn.trim().split(/\s+/)[0];
  const html = ram(`
    <h1 style="margin:0 0 14px;font-size:22px;color:#3a3330;">Tack, ${skyddaHtml(fornamn)}!</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3a3330;">Vi har fått din förfrågan om en AI-konsultation. Vi går igenom dina svar och hör av oss för att bekräfta en tid.</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3a3330;">Konsultationen är ${c.minutes} minuter${b.format === "distans" ? " på distans" : b.format === "plats" ? " på plats" : ""}, och inom ${c.deliveryDays} efteråt får du ett skriftligt underlag med förklaringar, verktygsråd och nästa steg. Priset är ${c.price} ${c.vat}, och fakturan kommer efter konsultationen.</p>
    ${rubrik("Det här skickade du")}
    ${rad("Områden", lista(FOKUS, b.fokus))}
    ${rad("Frågor och uppgifter", b.fragor)}
    ${rad("Vill kunna efteråt", b.mal)}
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#5a4f48;">Vill du lägga till något? Svara på det här mejlet.</p>
  `);
  return { amne: "Vi har fått din förfrågan om AI-konsultation", html };
}

/**
 * Sends both mails. The notification must go out; if it fails the request
 * fails and the visitor is told to try again. The confirmation is a courtesy:
 * if only that fails, the request has still reached Hai.
 */
export async function skickaBokning(b: Bokningsforfragan): Promise<{ kvittoSkickat: boolean }> {
  const notis = notismejl(b);
  await skicka({
    from: avsandare(),
    to: saljare(),
    replyTo: b.mejl,
    subject: notis.amne,
    html: notis.html,
    nyckel: `${b.nyckel}-notis`,
  });

  try {
    const kvitto = kvittomejl(b);
    await skicka({
      from: avsandare(),
      to: [b.mejl],
      replyTo: facts.email,
      subject: kvitto.amne,
      html: kvitto.html,
      nyckel: `${b.nyckel}-kvitto`,
    });
    return { kvittoSkickat: true };
  } catch {
    return { kvittoSkickat: false };
  }
}
