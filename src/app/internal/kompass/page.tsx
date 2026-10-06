import type { Metadata } from "next";
import Link from "next/link";
import { hamtaOversikt, PERIODER, type Period } from "@/kompass/server";

// Intern översikt över Automationskompassen. Ligger under /internal, så
// proxy.ts kräver inloggning och robots.txt håller den utanför sökmotorer.
// Innehåller personuppgifter (mejl, telefon) — flytta den aldrig härifrån.

export const metadata: Metadata = {
  title: "Kompassen – översikt",
  robots: { index: false, follow: false },
};

// Alltid färska siffror, aldrig cachade.
export const dynamic = "force-dynamic";

const KORT = "rounded-2xl border border-black/10 bg-white p-5";
const ETIKETT = "text-xs font-semibold tracking-wide text-black/50 uppercase";

export default async function KompassOversikt({
  searchParams,
}: {
  searchParams: Promise<{ dagar?: string; sida?: string }>;
}) {
  const { dagar: valda, sida: valdSida } = await searchParams;
  const dagar = (PERIODER.find((p) => String(p) === valda) ?? 30) as Period;
  const sida = Math.max(1, Math.floor(Number(valdSida)) || 1);
  const o = await hamtaOversikt(dagar, sida);

  return (
    <main className="min-h-dvh bg-[#f8f6f3] px-4 py-10 text-[#3a3330] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={ETIKETT}>Internt</p>
            <h1 className="mt-1 text-2xl font-semibold">Automationskompassen</h1>
          </div>
          <nav className="flex gap-2" aria-label="Period">
            {PERIODER.map((p) => (
              <Link
                key={p}
                href={`?dagar=${p}`}
                // Byter man period börjar leadslistan om på första sidan.
                className={
                  "rounded-full px-4 py-2 text-sm font-semibold " +
                  (p === dagar ? "bg-[#c05e20] text-white" : "border border-black/10 bg-white")
                }
              >
                {p} dagar
              </Link>
            ))}
          </nav>
        </header>

        {!o.kopplad ? (
          <EjKopplad skal={o.skal} />
        ) : (
          <>
            {o.avkortad ? (
              <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm">
                Mycket data i perioden — siffrorna bygger på de första 50 000 händelserna och är i
                underkant. Välj en kortare period.
              </p>
            ) : null}

            {/* Nyckeltal — samma besök genom hela tratten, så att andelarna går ihop. */}
            <p className="mt-8 text-sm text-black/60">
              Besök som startade de senaste {o.dagar} dagarna, och hur långt just de kom.
            </p>
            <section className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Tal etikett="Startade" varde={o.tratt.startade} />
              <Tal etikett="Såg resultatet" varde={o.tratt.resultat} fot={`${o.tratt.andelResultat} av startade`} />
              <Tal etikett="Lämnade mejl" varde={o.tratt.leads} fot={`${o.tratt.andelLeads} av dem som såg resultatet`} />
              <Tal etikett="Klickade Boka möte" varde={o.tratt.mote} fot={`${o.tratt.andelMote} av dem som såg resultatet`} />
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Tratten per skärm */}
              <section className={KORT}>
                <h2 className="font-semibold">Besvarade per skärm</h2>
                <p className="mt-1 text-sm text-black/60">Olika besök som svarat på skärmen.</p>
                <Staplar rader={o.tratt.steg} max={o.tratt.startade} />
              </section>

              {/* Avhopp */}
              <section className={KORT}>
                <h2 className="font-semibold">Var de slutade</h2>
                <p className="mt-1 text-sm text-black/60">
                  Besök som inte nådde resultatet, efter sista besvarade skärm. De som tryckte på
                  Kör igång men aldrig svarade syns bara i Startade.
                </p>
                <Staplar rader={o.avhopp} max={Math.max(0, ...o.avhopp.map((a) => a.antal))} />
              </section>
            </div>

            {/* Leads */}
            <section className={`${KORT} mt-6`}>
              <h2 className="font-semibold">Leads ({o.leadsTotalt})</h2>
              <p className="mt-1 text-sm text-black/60">
                Alla som lämnat mejl de senaste {o.dagar} dagarna, nyast först. Sälj/Resultat visar om
                mejlen gick iväg: ✓ skickad, ✗ misslyckad, … väntar.
              </p>
              <Tabell
                kolumner={["Datum", "Mejl", "Namn, företag", "Telefon", "Bransch", "Storlek", "Mål", "Följdfråga", "Frigörs", "Mejlen", "Möte", "Arbetsflöde"]}
                rader={o.leads.map((l) => [
                  l.datum, l.mejl, l.namn, l.telefon, l.bransch, l.storlek, l.mal, l.diagnos,
                  l.frigors, l.leverans, l.mote ? "Klickade" : "–", l.arbetsflode,
                ])}
                tom="Inga leads i perioden."
              />
              {o.sidor > 1 ? (
                <nav className="mt-4 flex items-center gap-3 text-sm" aria-label="Bläddra bland leads">
                  {o.sida > 1 ? (
                    <Link href={`?dagar=${o.dagar}&sida=${o.sida - 1}`} className="font-semibold text-[#c05e20] underline">
                      ← Nyare
                    </Link>
                  ) : null}
                  <span className="text-black/60">
                    Sida {o.sida} av {o.sidor}
                  </span>
                  {o.sida < o.sidor ? (
                    <Link href={`?dagar=${o.dagar}&sida=${o.sida + 1}`} className="font-semibold text-[#c05e20] underline">
                      Äldre →
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </section>

            {/* Alla besök */}
            <section className={`${KORT} mt-6`}>
              <h2 className="font-semibold">Alla besök ({o.besokTotalt})</h2>
              <p className="mt-1 text-sm text-black/60">
                {o.besokTotalt > o.besok.length ? `De senaste ${o.besok.length} av ${o.besokTotalt}` : "Alla"}{" "}
                med minst ett svar — även de som aldrig lämnade mejl. Utan namn och kontaktuppgifter.
              </p>
              <Tabell
                kolumner={["Senast", "Bransch", "Storlek", "Mål", "Görs för hand", "Slutade vid", "Lead", "Arbetsflöde", "Källa"]}
                rader={o.besok.map((b) => [
                  b.datum, b.bransch, b.storlek, b.mal, b.forHand, b.slutade,
                  b.lead ? "Ja" : "–", b.arbetsflode, b.kalla,
                ])}
                tom="Inga besök i perioden."
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Tal({ etikett, varde, fot }: { etikett: string; varde: number; fot?: string }) {
  return (
    <div className={KORT}>
      <p className={ETIKETT}>{etikett}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{varde}</p>
      {fot ? <p className="mt-1 text-sm text-black/60">{fot}</p> : null}
    </div>
  );
}

function Staplar({ rader, max }: { rader: { namn: string; antal: number }[]; max: number }) {
  if (rader.length === 0) return <p className="mt-4 text-sm text-black/60">Inget att visa ännu.</p>;
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {rader.map((r) => (
        <li key={r.namn} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 text-sm">
          <span className="truncate">{r.namn}</span>
          <span className="h-2.5 rounded-full bg-black/5">
            <span
              className="block h-full rounded-full bg-[#c05e20]"
              style={{ width: `${max ? Math.max(2, (r.antal / max) * 100) : 0}%` }}
            />
          </span>
          <span className="text-right tabular-nums">{r.antal}</span>
        </li>
      ))}
    </ul>
  );
}

function Tabell({ kolumner, rader, tom }: { kolumner: string[]; rader: string[][]; tom: string }) {
  if (rader.length === 0) return <p className="mt-4 text-sm text-black/60">{tom}</p>;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <thead>
          <tr className="border-b border-black/10">
            {kolumner.map((k) => (
              <th key={k} className="py-2 pr-4 font-semibold whitespace-nowrap">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rader.map((rad, i) => (
            <tr key={i} className="border-b border-black/5 align-top">
              {rad.map((cell, j) => (
                // Korta värden (datum, telefon, mejlstatus) bryts inte; långa
                // texter (arbetsflödet) får bredd i stället för att bli höga.
                <td
                  key={j}
                  className={
                    "py-2 pr-4" +
                    (cell.length <= 20 ? " whitespace-nowrap" : cell.length > 60 ? " min-w-[18rem]" : "")
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EjKopplad({ skal }: { skal: string }) {
  return (
    <section className={`${KORT} mt-8`}>
      <h2 className="font-semibold">Ingen data att visa</h2>
      <p className="mt-2 text-sm">{skal}</p>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-black/70">
        <li>Kör <code>db/schema.sql</code> mot Neon-databasen (Neons SQL Editor).</li>
        <li>
          Lägg in <code>DATABASE_URL</code> i Vercel (Settings → Environment Variables), plus{" "}
          <code>CRON_SECRET</code> och mejlnycklarna.
        </li>
        <li>Driftsätt om, gör en genomkörning av kompassen och ladda om den här sidan.</li>
      </ol>
      <p className="mt-4 text-sm text-black/60">Hela checklistan finns i docs/current_state.md.</p>
    </section>
  );
}
