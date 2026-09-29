import "server-only";

import { loggaFel } from "@/kompass/server/logg";
import { createHash } from "node:crypto";
import { supabase } from "@/kompass/server/supabase";

/**
 * Enkel begränsning: max antal inskick per IP och timme.
 *
 * IP-adressen lagras som hash, aldrig i klartext — vi behöver bara kunna
 * räkna, inte veta vem det är.
 */

export const MAX_INSKICK_PER_TIMME = 5;

/**
 * Gränser per typ. Kontaktformuläret är strängt; AI-anropen är fler per besök
 * (en analys per skärm) men kostar pengar, så de har en egen, högre gräns.
 */
export const GRANSER = {
  inskick: MAX_INSKICK_PER_TIMME,
  // KALIBRERA: nya besök per IP och timme. Ett kontor bakom samma IP gör
  // sällan fler än ett par; 30 stoppar någon som fyller databasen med skräp.
  session: 30,
  // KALIBRERA: mätningshändelser per IP och timme — ett besök gör runt 12.
  event: 300,
  // KALIBRERA: ett besök gör upp till ~8 AI-anrop. 60 räcker för ett kontor
  // bakom samma IP, men stoppar någon som kör flödet i en loop.
  ai: 60,
} as const;

export type Gransttyp = keyof typeof GRANSER;

/** Hashar IP med en salt så att värdena inte går att slå upp bakvägen. */
function hasha(ip: string): string {
  const salt = process.env.CRON_SECRET ?? "kompass";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Plockar ut klientens IP ur proxyheaders. */
export function lasIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Första adressen är klienten, resten är proxykedjan.
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "okand";
}

/**
 * Kontrollerar och registrerar ett inskick.
 * Returnerar false när gränsen är nådd.
 *
 * Går databasen inte att nå släpper vi igenom — hellre ett extra lead än att
 * en riktig kund blir avvisad av ett trasigt spamskydd.
 */
export async function slappIgenom(
  ip: string,
  typ: Gransttyp = "inskick",
): Promise<boolean> {
  const hash = hasha(ip);
  const enTimmeSedan = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  try {
    const { count, error } = await supabase()
      .from("kompass_inskick")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", hash)
      .eq("typ", typ)
      .gte("created_at", enTimmeSedan);

    if (error) {
      loggaFel("Kunde inte kontrollera inskick", error.message);
      return true;
    }

    if ((count ?? 0) >= GRANSER[typ]) return false;

    await supabase().from("kompass_inskick").insert({ ip_hash: hash, typ });
    return true;
  } catch (fel) {
    loggaFel("Oväntat fel i spamskyddet", fel);
    return true;
  }
}
