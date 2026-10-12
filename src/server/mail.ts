import "server-only";

import { Resend } from "resend";
import { facts } from "@/data/facts";

/**
 * Mail for the site's own forms (the AI-konsultation booking). Same Resend
 * account and settings as the compass (RESEND_API_KEY, MAIL_FROM,
 * SALES_EMAIL; see .env.example), but separate code: src/kompass/ is a
 * self-contained module the app may only use through its entry points.
 */

let resend: Resend | null = null;

function klient(): Resend {
  if (resend) return resend;
  const nyckel = process.env.RESEND_API_KEY;
  if (!nyckel) throw new Error("RESEND_API_KEY saknas. Se .env.example.");
  resend = new Resend(nyckel);
  return resend;
}

/** SALES_EMAIL, comma-separated for several people. */
export function saljare(): string[] {
  const adresser = (process.env.SALES_EMAIL ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  if (adresser.length === 0) throw new Error("SALES_EMAIL saknas. Se .env.example.");
  return adresser;
}

export function avsandare(): string {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM saknas. Se .env.example.");
  return from;
}

type Utskick = Parameters<Resend["emails"]["send"]>[0] & {
  /** Idempotency key: the same key within a day is sent only once by Resend. */
  nyckel?: string;
};

/** Sends a mail and throws if Resend refuses it (Resend returns { error } rather than throwing). */
export async function skicka({ nyckel, ...utskick }: Utskick): Promise<void> {
  const { error } = await klient().emails.send(
    utskick as Parameters<Resend["emails"]["send"]>[0],
    nyckel ? { idempotencyKey: nyckel } : undefined,
  );
  if (error) throw new Error(`Resend nekade utskicket (${error.name}): ${error.message}`);
}

/** Keeps typed text from breaking out of the HTML. */
export function skyddaHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** The frame around every mail, in the site's colours. */
export function ram(innehall: string): string {
  return `<!doctype html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f8f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#3a3330;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    ${innehall}
    <hr style="border:none;border-top:1px solid rgba(58,51,48,0.12);margin:28px 0 18px;">
    <table role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;padding:0 8px 0 0;"><img src="${facts.url}/signature-assets/khyte-logo.png" width="20" height="20" alt="" style="display:block;border:0;"></td>
        <td style="vertical-align:middle;font-size:13px;color:#9c8e82;"><strong style="font-weight:600;color:#3a3330;">Khyte Automations</strong> · <a href="${facts.url}" style="color:#9c8e82;">khyte.se</a></td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}
