import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Databasen: Postgres hos Neon, via deras drivrutin för serverlösa miljöer
 * (en HTTP-förfrågan per fråga — inga anslutningar att hålla vid liv på
 * Vercel).
 *
 * "server-only" högst upp gör att bygget havererar om filen någonsin
 * importeras från klientkod. DATABASE_URL innehåller lösenordet och får
 * aldrig lämna servern.
 *
 * Allt går via parametrar ($1, $2 …) — aldrig ihopklistrad text — så att
 * besökarens svar aldrig kan bli en del av själva SQL-frågan.
 *
 * Drivrutinen ger datum som Date, numeric och count som text och jsonb som
 * färdiga objekt. Antal räknas därför med ::int i SQL.
 */

let klient: ReturnType<typeof neon> | null = null;

function db() {
  if (klient) return klient;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL måste vara satt. Se .env.example.");
  }

  klient = neon(url);
  return klient;
}

/** Är databasen konfigurerad? Översikten frågar innan den försöker läsa. */
export function harDatabas(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Kör en fråga med parametrar och returnerar raderna. */
export async function fraga<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  return (await db().query(text, params)) as T[];
}

/** Kolumnerna i kompass_svar som är jsonb — skickas som JSON-text. */
const JSONB = new Set([
  "svar",
  "verktyg",
  "omraden",
  "forslag",
  "plan",
  "ai_analys",
  "leverans_status",
]);

/** Kolumnnamn kommer från koden, aldrig från besökaren — men kontrolleras ändå. */
function kolumn(namn: string): string {
  if (!/^[a-z_]+$/.test(namn)) throw new Error(`Ogiltigt kolumnnamn: ${namn}`);
  return namn;
}

/** Värdet som parameter: jsonb som JSON-text, resten som det är. */
function varde(namn: string, v: unknown): unknown {
  return JSONB.has(namn) && v !== null && v !== undefined ? JSON.stringify(v) : v;
}

/** "$3" eller "$3::jsonb" för en kolumn. */
function platshallare(namn: string, n: number): string {
  return JSONB.has(namn) ? `$${n}::jsonb` : `$${n}`;
}

/**
 * Sparar svarsraden för ett besök: skapar den om den saknas, annars
 * uppdateras bara fälten som skickas med. Fält som utelämnas rörs inte —
 * samma beteende som tidigare (en klar rad blir aldrig oklar igen).
 */
export async function sparaSvarsrad(
  falt: Record<string, unknown> & { session_id: string },
): Promise<void> {
  const namn = Object.keys(falt).filter((k) => falt[k] !== undefined).map(kolumn);
  const params = namn.map((k) => varde(k, falt[k]));
  const uppdatera = namn
    .filter((k) => k !== "session_id")
    .map((k) => `${k} = excluded.${k}`)
    .join(", ");

  await fraga(
    `insert into kompass_svar (${namn.join(", ")})
     values (${namn.map((k, i) => platshallare(k, i + 1)).join(", ")})
     on conflict (session_id) do update set ${uppdatera}`,
    params,
  );
}

/**
 * Uppdaterar kompass_svar. Villkoret skrivs med $1, $2 … för sina egna
 * parametrar; fälten numreras efter dem. Returnerar raderna som ändrades,
 * med kolumnerna i `returnera` (tom lista om inget ska returneras).
 */
export async function uppdateraSvarsrad<T = Record<string, unknown>>(
  falt: Record<string, unknown>,
  villkor: string,
  villkorParams: unknown[] = [],
  returnera?: string,
): Promise<T[]> {
  const namn = Object.keys(falt).filter((k) => falt[k] !== undefined).map(kolumn);
  const forsta = villkorParams.length + 1;
  const satt = namn.map((k, i) => `${k} = ${platshallare(k, forsta + i)}`).join(", ");

  return fraga<T>(
    `update kompass_svar set ${satt} where ${villkor}${returnera ? ` returning ${returnera}` : ""}`,
    [...villkorParams, ...namn.map((k) => varde(k, falt[k]))],
  );
}
