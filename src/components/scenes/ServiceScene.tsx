import { Fragment, type CSSProperties, type ComponentType, type ReactNode } from "react";
import type { SceneId } from "@/data/services";
import SceneStage from "./SceneStage";

/**
 * The animated scene beside each example on an example-led service page.
 *
 * Each scene is a small story of the real work, in recognisable objects: a
 * spreadsheet, a document, a list, a booking. Everything is decorative
 * (aria-hidden in <SceneStage />); the example's text says it all on its own.
 * The data is made up and only shaped like the client's.
 *
 * Steps: an element with class `s` appears at step `at` and, with `until`,
 * leaves at that step. `i` staggers siblings. See `.scene` in globals.css.
 */

const ACCENT = "#D4622B";

const at = (step: number, { until, i }: { until?: number; i?: number } = {}) =>
  ({
    "--at": step,
    ...(until !== undefined && { "--until": until }),
    ...(i !== undefined && { "--i": i }),
  }) as CSSProperties;

/** A light card: a sheet, a document, a system. */
function Paper({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`rounded-[0.7em] bg-[#FBF7F2] text-[#3A3330] shadow-[0_0.9em_2.2em_rgba(0,0,0,0.38)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function PaperHead({ title, kind, right }: { title: string; kind: "xlsx" | "doc" | "app"; right?: ReactNode }) {
  const colour = kind === "xlsx" ? "#2F7D4F" : kind === "doc" ? ACCENT : "#9C8E82";
  return (
    <div className="flex items-center gap-[0.5em] border-b border-black/10 px-[0.85em] py-[0.55em]">
      <span className="h-[0.75em] w-[0.75em] shrink-0 rounded-[0.18em]" style={{ background: colour }} />
      <span className="truncate text-[0.9em] font-semibold">{title}</span>
      {right && <span className="ml-auto shrink-0">{right}</span>}
    </div>
  );
}

const CHIP_TONES = {
  accent: "bg-[#D4622B] text-white",
  light: "bg-white/10 text-white/85",
};

function Chip({ children, tone = "accent", className = "", style }: { children: ReactNode; tone?: keyof typeof CHIP_TONES; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.35em] whitespace-nowrap rounded-full px-[0.75em] py-[0.3em] text-[0.85em] font-semibold ${CHIP_TONES[tone]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-[0.9em] w-[0.9em] shrink-0" fill="none" aria-hidden="true">
    <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Label = ({ children }: { children: ReactNode }) => (
  <span className="text-[0.72em] font-bold uppercase tracking-[0.08em] text-[#9C8E82]">{children}</span>
);

/* ── 1. Kundfiler som ska bli färdiga dokument (Etcetera) ─────────────────
   A customer's spreadsheet goes in; a plocksedel fills in line by line. */
function Dokument() {
  const rows = [
    ["TS-1042", "S", "24"],
    ["TS-1042", "M", "36"],
    ["TS-1042", "L", "18"],
    ["HD-2210", "M", "12"],
    ["HD-2210", "XL", "6"],
  ];
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-[0.9em]">
      <Paper className="s" style={at(1)}>
        <PaperHead title="kundorder.xlsx" kind="xlsx" />
        <div className="px-[0.85em] py-[0.5em] tabular-nums">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-[0.9em] pb-[0.3em]">
            <Label>Art.nr</Label>
            <Label>Strl</Label>
            <Label>Antal</Label>
          </div>
          {rows.map(([art, size, qty], i) => (
            <div
              key={i}
              className="s grid grid-cols-[1fr_auto_auto] gap-x-[0.9em] border-t border-black/[0.06] py-[0.32em] text-[0.88em]"
              style={at(1, { i })}
            >
              <span>{art}</span>
              <span className="w-[1.4em] text-right">{size}</span>
              <span className="w-[1.6em] text-right">{qty}</span>
            </div>
          ))}
        </div>
      </Paper>

      <div className="flex flex-col items-center gap-[0.5em]">
        <Chip className="s" style={at(2, { until: 5 })}>Läser</Chip>
        <span className="s s-grow-x block h-[2px] w-[2.6em] rounded-full" style={{ ...at(2), background: ACCENT }} />
      </div>

      <Paper className="s overflow-hidden" style={at(3)}>
        <div className="h-[0.4em]" style={{ background: ACCENT }} />
        <div className="px-[0.85em] pt-[0.6em] pb-[0.4em]">
          <Label>Plocksedel</Label>
          <p className="text-[0.95em] font-semibold">Order 2041</p>
        </div>
        <ul className="px-[0.85em] pb-[0.5em] tabular-nums">
          {rows.slice(0, 4).map(([art, size, qty], i) => (
            <li
              key={i}
              className="s flex justify-between gap-[0.6em] border-t border-black/[0.06] py-[0.32em] text-[0.88em]"
              style={at(4, { i })}
            >
              <span>
                {art} · {size}
              </span>
              <span>{qty} st</span>
            </li>
          ))}
        </ul>
        <div className="s flex items-center gap-[0.35em] px-[0.85em] pb-[0.7em] text-[0.85em] font-semibold" style={{ ...at(5), color: ACCENT }}>
          <Check /> Klar för plock
        </div>
      </Paper>
    </div>
  );
}

/* ── 2. Prospektlistor som byggs för hand (JaTack) ────────────────────────
   A search link is pasted, one click, and a call list fills itself. */
function Ringlista() {
  const rows = [
    ["Lindqvist Bygg AB", "Borås"],
    ["Viskadalens Måleri", "Kinna"],
    ["Ekens Plåt AB", "Ulricehamn"],
    ["Norrby El & Larm", "Borås"],
    ["Sjöbo Snickeri", "Alingsås"],
    ["Holma Mark AB", "Mark"],
  ];
  return (
    <div className="flex w-full flex-col gap-[0.8em]">
      <div className="flex items-stretch gap-[0.5em]">
        <Paper className="s flex min-w-0 flex-1 items-center gap-[0.5em] px-[0.85em] py-[0.6em]" style={at(1)}>
          <svg viewBox="0 0 16 16" className="h-[1em] w-[1em] shrink-0 text-[#9C8E82]" fill="none" aria-hidden="true">
            <path d="M6.5 9.5l3-3M7 4.5l1-1a2.8 2.8 0 014 4l-1 1M9 11.5l-1 1a2.8 2.8 0 01-4-4l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="grid min-w-0 text-[0.88em]">
            <span className="s col-start-1 row-start-1 truncate text-[#9C8E82]" style={at(1, { until: 2 })}>
              Klistra in sökningen …
            </span>
            <span className="s col-start-1 row-start-1 truncate" style={at(2)}>
              allabolag.se/lista?bransch=bygg&amp;lan=vg
            </span>
          </span>
        </Paper>
        <span className="s relative grid shrink-0 place-items-center overflow-hidden rounded-[0.7em] bg-white/10 px-[0.9em] text-[0.88em] font-semibold text-white" style={at(1)}>
          <span className="s absolute inset-0" style={{ ...at(3), background: ACCENT }} />
          <span className="relative">Hämta lista</span>
        </span>
      </div>

      <Paper className="s" style={at(4)}>
        <PaperHead title="Ringlista.xlsx" kind="xlsx" right={<Label>{rows.length} leads</Label>} />
        <div className="px-[0.85em] py-[0.5em]">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-x-[0.9em] pb-[0.3em]">
            <Label>Företag</Label>
            <Label>Ort</Label>
            <Label>Telefon</Label>
          </div>
          {rows.map(([name, city], i) => (
            <div
              key={name}
              className="s grid grid-cols-[1.6fr_1fr_1fr] items-center gap-x-[0.9em] border-t border-black/[0.06] py-[0.32em] text-[0.88em]"
              style={at(4, { i })}
            >
              <span className="truncate font-medium">{name}</span>
              <span className="truncate">{city}</span>
              <span className="h-[0.55em] w-[80%] rounded-full bg-black/10" />
            </div>
          ))}
        </div>
      </Paper>

      <Chip className="s self-end" style={at(5)}>
        <span className="line-through decoration-white/70 opacity-75">2 min</span> → 5 sek per lead
      </Chip>
    </div>
  );
}

/* ── 3. AI-research från en lista med företagsnamn (Observa) ──────────────
   Three AI steps fill in what the list was missing. One field stays empty:
   research finds most things, not everything. */
function Research() {
  const steps = ["Bolag", "Analys", "Kontakt"];
  const rows: { name: string; site: string; city: string; type: string; contact: string | null }[] = [
    { name: "Lindqvist Bygg AB", site: "lindqvistbygg.se", city: "Borås", type: "B2B", contact: "K. Lindqvist" },
    { name: "Café Solsidan", site: "cafesolsidan.se", city: "Ulricehamn", type: "B2C", contact: null },
    { name: "Nordplåt i Väst AB", site: "nordplat.se", city: "Alingsås", type: "B2B", contact: "S. Ahmadi" },
  ];
  const field = "s rounded-[0.4em] bg-black/[0.05] px-[0.5em] py-[0.15em]";
  return (
    <div className="flex w-full flex-col gap-[0.7em]">
      <div className="s flex items-center gap-[0.4em]" style={at(1)}>
        {steps.map((label, k) => (
          <span key={label} className="flex items-center gap-[0.4em]">
            {k > 0 && <span className="s s-grow-x block h-[2px] w-[1.4em] rounded-full bg-white/30" style={at(k + 2)} />}
            <Chip tone="light" className="relative overflow-hidden">
              <span className="s absolute inset-0" style={{ ...at(k + 2), background: ACCENT }} />
              <span className="relative">
                {k + 1} · {label}
              </span>
            </Chip>
          </span>
        ))}
        <span className="ml-auto hidden text-[0.8em] font-semibold uppercase tracking-[0.08em] text-white/50 sm:inline">AI-steg</span>
      </div>

      {rows.map((r, i) => (
        <Paper key={r.name} className="s px-[0.85em] py-[0.6em]" style={at(1, { i })}>
          <p className="text-[0.95em] font-semibold">{r.name}</p>
          <div className="mt-[0.4em] flex flex-wrap gap-[0.35em] text-[0.84em]">
            <span className={field} style={at(2, { i })}>{r.site}</span>
            <span className={field} style={at(3, { i })}>{r.city}</span>
            <span className={field} style={at(3, { i: i + 1 })}>{r.type}</span>
            {r.contact ? (
              <span className={field} style={at(4, { i })}>
                Ekonomiansvarig · {r.contact}
              </span>
            ) : (
              <span className={`${field} text-[#9C8E82]`} style={at(4, { i })}>
                Ekonomiansvarig · –
              </span>
            )}
          </div>
        </Paper>
      ))}

      <Chip className="s self-end" style={at(5)}>
        <Check /> Tillbaka i listan
      </Chip>
    </div>
  );
}

/* ── 4. Samma uppgifter i flera system (possible flow) ────────────────────
   One booking comes in and reaches three systems, typed once. */
function FleraSystem() {
  const systems = ["Bokningssystem", "CRM", "Bokföring"];
  // Row centres of a three-row grid with a 0.6em gap, so the spine meets the ticks.
  const spineInset = "calc((100% - 1.2em) / 6)";
  return (
    <div className="flex w-full flex-col gap-[0.8em]">
      <div className="grid grid-cols-[1fr_2.4em_1fr]">
        <div className="flex items-center">
          <Paper className="s w-full" style={at(1)}>
            <PaperHead title="Ny bokning" kind="doc" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-[0.8em] gap-y-[0.3em] px-[0.85em] py-[0.6em] text-[0.88em]">
              <dt className="text-[#9C8E82]">Kund</dt>
              <dd className="font-semibold">Anna Berg</dd>
              <dt className="text-[#9C8E82]">Tjänst</dt>
              <dd>Rekond</dd>
              <dt className="text-[#9C8E82]">Tid</dt>
              <dd>tis 10:00</dd>
            </dl>
          </Paper>
        </div>

        <div className="relative">
          <span className="s s-grow-x absolute left-0 top-1/2 block h-[2px] w-1/2" style={{ ...at(2), background: ACCENT }} />
          <span
            className="s s-grow-y absolute left-1/2 block w-[2px]"
            style={{ ...at(2, { i: 1 }), top: spineInset, bottom: spineInset, background: ACCENT }}
          />
        </div>

        <div className="grid grid-rows-3 gap-[0.6em]">
          {systems.map((name, k) => (
            <div key={name} className="relative">
              <span
                className="s s-grow-x absolute right-full top-1/2 block h-[2px] w-[1.2em]"
                style={{ ...at(2, { i: k + 2 }), background: ACCENT }}
              />
              <Paper className="s h-full px-[0.85em] py-[0.55em]" style={at(1, { i: k })}>
                <Label>{name}</Label>
                <div className="mt-[0.25em] grid text-[0.88em]">
                  <span className="s col-start-1 row-start-1 h-[0.6em] w-3/4 self-center rounded-full bg-black/10" style={at(1, { until: 3 })} />
                  <span className="s col-start-1 row-start-1 flex items-center gap-[0.3em] font-semibold" style={{ ...at(3, { i: k }), color: ACCENT }}>
                    <Check /> <span className="text-[#3A3330]">Anna Berg</span>
                  </span>
                </div>
              </Paper>
            </div>
          ))}
        </div>
      </div>

      <Chip className="s self-end" style={at(4)}>
        Skrivs in en gång
      </Chip>
    </div>
  );
}

/* ── Egna system: complete tools people work in ───────────────────────────
   Each of these is a small app window (sidebar + workspace), so the scene
   reads as "a system you log in to", not as a file being processed. */

/** A small app window: the tool's sections on the left, the active one marked. */
function AppShell({
  nav,
  children,
  className = "",
  style,
}: {
  nav: string[];
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Paper className={`grid w-full grid-cols-[6.2em_1fr] overflow-hidden ${className}`} style={style}>
      <div className="flex flex-col gap-[0.25em] border-r border-black/[0.07] bg-black/[0.025] px-[0.55em] py-[0.8em]">
        <span className="mb-[0.5em] h-[0.9em] w-[0.9em] rounded-[0.25em]" style={{ background: ACCENT }} />
        {nav.map((item, k) => (
          <span
            key={item}
            className={`truncate rounded-[0.35em] px-[0.45em] py-[0.3em] text-[0.78em] font-semibold ${
              k === 0 ? "bg-white text-[#3A3330] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#9C8E82]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="min-w-0 p-[0.85em]">{children}</div>
    </Paper>
  );
}

/* ── 5. Bokningar och personal på ett ställe (Kom-Fort) ───────────────────
   A week calendar: a new job lands, a staff member takes it, and the
   customer's confirmation goes out. */
function Bokning() {
  const days = ["Tis", "Ons", "Tor"];
  const hours = ["08", "10", "13"];
  const existing: Record<string, [string, string]> = {
    "0-0": ["Polering", "Tesla Y"],
    "2-1": ["Rekond", "BMW i4"],
    "0-2": ["Tvätt", "Audi A6"],
  };
  return (
    <div className="flex w-full flex-col gap-[0.7em]">
      <AppShell nav={["Kalender", "Kunder", "Personal"]} className="s" style={at(1)}>
        <div className="flex items-baseline justify-between gap-[0.5em]">
          <p className="text-[0.95em] font-semibold">Vecka 42</p>
          <Label>3 medarbetare</Label>
        </div>
        <div className="mt-[0.6em] grid grid-cols-[1.8em_repeat(3,1fr)] gap-[0.3em] text-[0.8em]">
          <span />
          {days.map((d) => (
            <span key={d} className="pb-[0.2em] text-center font-semibold text-[#9C8E82]">
              {d}
            </span>
          ))}
          {hours.map((h, hi) => (
            <Fragment key={h}>
              <span className="pt-[0.35em] tabular-nums text-[#9C8E82]">{h}</span>
              {days.map((d, di) => {
                const booking = existing[`${di}-${hi}`];
                return (
                  <div key={d} className="relative h-[3.4em] rounded-[0.4em] bg-black/[0.035]">
                    {booking && (
                      <div
                        className="s absolute inset-[0.2em] rounded-[0.35em] bg-white px-[0.45em] py-[0.3em] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                        style={at(2, { i: di + hi })}
                      >
                        <p className="truncate font-semibold">{booking[0]}</p>
                        <p className="truncate text-[#9C8E82]">{booking[1]}</p>
                      </div>
                    )}
                    {di === 1 && hi === 1 && (
                      <div
                        className="s absolute inset-[0.2em] rounded-[0.35em] border px-[0.45em] py-[0.3em]"
                        style={{ ...at(3), borderColor: ACCENT, background: "rgba(212,98,43,0.08)" }}
                      >
                        <p className="truncate font-semibold">Rekond</p>
                        <p className="truncate text-[#9C8E82]">Volvo XC60</p>
                        <span
                          className="s absolute -right-[0.45em] -top-[0.45em] grid h-[1.6em] w-[1.6em] place-items-center rounded-full text-[0.8em] font-bold text-white ring-2 ring-[#FBF7F2]"
                          style={{ ...at(4), background: ACCENT }}
                        >
                          AL
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </AppShell>

      <Chip className="s self-end" style={at(5)}>
        <Check /> Bekräftelse skickad till kunden
      </Chip>
    </div>
  );
}

/* ── 6. Kunder som bokar igen (Osteopaticentrum) ──────────────────────────
   An imported customer list, a selection, one SMS, and a booking that
   comes back from it. */
function Sms() {
  const customers = [
    { name: "Sara Lind", last: "8 mån sedan", pick: true },
    { name: "Johan Berg", last: "11 mån sedan", pick: true },
    { name: "Maria Kahn", last: "2 mån sedan", pick: false },
    { name: "Erik Nyström", last: "14 mån sedan", pick: true, booked: true },
  ];
  return (
    <div className="flex w-full flex-col gap-[0.7em]">
      <AppShell nav={["Utskick", "Kunder", "Resultat"]} className="s" style={at(1)}>
        <div className="flex items-baseline justify-between gap-[0.5em]">
          <p className="text-[0.95em] font-semibold">Nytt utskick</p>
          <Label>kunder.csv · 4 kunder</Label>
        </div>
        <div className="mt-[0.5em] grid grid-cols-[1.15fr_1fr] gap-[0.8em]">
          <ul>
            {customers.map((c, i) => (
              <li
                key={c.name}
                className="s flex items-center gap-[0.45em] border-t border-black/[0.06] py-[0.35em] text-[0.82em]"
                style={at(1, { i })}
              >
                <span className="relative grid h-[1.05em] w-[1.05em] shrink-0 place-items-center rounded-[0.25em] border border-black/20">
                  {c.pick && (
                    <span
                      className="s absolute -inset-px grid place-items-center rounded-[0.25em] text-white"
                      style={{ ...at(2, { i }), background: ACCENT }}
                    >
                      <Check />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{c.name}</span>
                  <span className="block truncate text-[0.9em] text-[#9C8E82]">Senast {c.last}</span>
                </span>
                {c.booked && (
                  <span
                    className="s shrink-0 rounded-full px-[0.5em] py-[0.1em] text-[0.8em] font-bold text-white"
                    style={{ ...at(5), background: ACCENT }}
                  >
                    Bokade
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-[0.5em]">
            <div
              className="s rounded-[0.8em] rounded-bl-[0.2em] bg-black/[0.05] px-[0.7em] py-[0.55em] text-[0.82em] leading-[1.35]"
              style={at(3)}
            >
              Hej! Det var ett tag sedan sist. Boka din nästa tid här →
            </div>
            <span
              className="s self-start rounded-[0.5em] px-[0.8em] py-[0.35em] text-[0.82em] font-semibold text-white"
              style={{ ...at(3, { i: 1 }), background: ACCENT }}
            >
              Skicka till 3
            </span>
            <span className="s flex items-center gap-[0.3em] text-[0.78em] text-[#9C8E82]" style={at(4)}>
              <Check /> Skickat
            </span>
          </div>
        </div>
      </AppShell>

      <Chip className="s self-end" style={at(5)}>
        Ny bokning från utskicket
      </Chip>
    </div>
  );
}

/* ── 7. Status på varje uppdrag (illustration, not a delivered case) ──────
   One board everyone shares: a job is finished, another one starts, and
   nobody has to ask where things are. Moving cards are two copies in the
   same grid cell: one leaves, the other arrives. */
function StatusCard({
  title,
  client,
  style,
  done = false,
  who,
}: {
  title: string;
  client: string;
  style: CSSProperties;
  done?: boolean;
  who?: string;
}) {
  return (
    <div
      className="s col-start-1 row-start-1 rounded-[0.4em] bg-white px-[0.45em] py-[0.35em] text-[0.78em] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
      style={style}
    >
      <p className="truncate font-semibold leading-tight">{title}</p>
      <p className="truncate text-[#9C8E82]">{client}</p>
      {(done || who) && (
        <div className="mt-[0.3em] flex items-center gap-[0.3em]">
          {done && (
            <span className="flex items-center gap-[0.2em] font-semibold" style={{ color: ACCENT }}>
              <Check /> Klart
            </span>
          )}
          {who && (
            <span
              className="grid h-[1.6em] w-[1.6em] place-items-center rounded-full text-[0.85em] font-bold text-white"
              style={{ background: ACCENT }}
            >
              {who}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Status() {
  return (
    <div className="flex w-full flex-col gap-[0.7em]">
      <AppShell nav={["Uppdrag", "Kunder", "Team"]} className="s" style={at(1)}>
        <div className="flex items-baseline justify-between gap-[0.5em]">
          <p className="text-[0.95em] font-semibold">Alla uppdrag</p>
          <Label>Uppdaterat nu</Label>
        </div>
        <div className="mt-[0.6em] grid grid-cols-3 gap-[0.45em]">
          <div className="flex min-h-[11em] flex-col gap-[0.4em] rounded-[0.5em] bg-black/[0.035] p-[0.4em]">
            <Label>Förfrågan</Label>
            <div className="grid">
              <StatusCard title="Offert" client="Lindqvist Bygg" style={at(1)} />
            </div>
            <div className="grid">
              <StatusCard title="Service" client="Café Solsidan" style={at(1, { i: 1, until: 3 })} />
            </div>
          </div>
          <div className="flex min-h-[11em] flex-col gap-[0.4em] rounded-[0.5em] bg-black/[0.035] p-[0.4em]">
            <Label>Pågår</Label>
            <div className="grid">
              <StatusCard title="Installation" client="Nordplåt" style={at(1, { i: 2, until: 2 })} />
              <StatusCard title="Service" client="Café Solsidan" who="AL" style={at(3)} />
            </div>
          </div>
          <div className="flex min-h-[11em] flex-col gap-[0.4em] rounded-[0.5em] bg-black/[0.035] p-[0.4em]">
            <Label>Klart</Label>
            <div className="grid">
              <StatusCard title="Installation" client="Nordplåt" done style={at(2)} />
            </div>
          </div>
        </div>
      </AppShell>

      <Chip className="s self-end" style={at(4)}>
        Alla ser samma läge
      </Chip>
    </div>
  );
}

/** Each scene and how long each of its steps is held (ms); the last step is the finished state. */
const SCENES: Record<SceneId, { Scene: ComponentType; durations: number[] }> = {
  dokument: { Scene: Dokument, durations: [500, 1300, 1000, 800, 1600, 3400] },
  ringlista: { Scene: Ringlista, durations: [500, 900, 900, 700, 1700, 3400] },
  research: { Scene: Research, durations: [500, 1100, 1200, 1200, 1200, 3400] },
  "flera-system": { Scene: FleraSystem, durations: [500, 1200, 1100, 1500, 3400] },
  bokning: { Scene: Bokning, durations: [500, 1100, 1200, 1000, 900, 3400] },
  sms: { Scene: Sms, durations: [500, 1200, 1000, 1200, 900, 3400] },
  status: { Scene: Status, durations: [500, 1200, 1300, 1300, 3400] },
};

export default function ServiceScene({
  id,
  fill = false,
}: {
  id: SceneId;
  /** Fill the parent (the sticky stage) instead of being a rounded card of its own. */
  fill?: boolean;
}) {
  const { Scene, durations } = SCENES[id];
  return (
    <SceneStage
      durations={durations}
      className={`relative overflow-hidden bg-[#1B1613] ${fill ? "h-full" : "rounded-2xl"}`}
      sceneClassName={`relative flex items-center ${fill ? "scene-fill h-full p-[5%]" : "p-[6%]"}`}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 100% 100%, rgba(212,98,43,0.30) 0%, rgba(212,98,43,0) 62%), radial-gradient(60% 50% at 0% 0%, rgba(232,131,58,0.10) 0%, rgba(232,131,58,0) 70%)",
        }}
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "url('/noise.webp')", backgroundSize: "128px 128px", opacity: 0.055, mixBlendMode: "screen" }}
      />
      <div className="relative flex w-full">
        <Scene />
      </div>
    </SceneStage>
  );
}
