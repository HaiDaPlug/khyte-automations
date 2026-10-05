-- Automationskompassen — databasschema
-- Databasen ligger hos Neon (Postgres). Kör filen i Neons SQL Editor eller
-- med psql "$DATABASE_URL" -f db/schema.sql. Går att köra flera gånger.
--
-- RLS är på och det finns MEDVETET inga policies. Besökarens webbläsare når
-- aldrig tabellerna; all läsning och skrivning går via serverfunktionerna,
-- som ansluter som tabellernas ägare och därför inte stoppas av RLS.

create extension if not exists pgcrypto;

-- ── Svar ────────────────────────────────────────────────────────────────────

create table if not exists kompass_svar (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Råsvaren, precis som de gavs. Allt nedan är härlett ur dem av servern.
  svar jsonb not null default '{}'::jsonb,

  -- Om företaget
  bransch text,
  antal_anstallda text,
  roll text,
  -- "Vad är viktigast just nu?" — styr vilket förslag som leder
  mal text,
  -- Följdfrågan efter målet: var det bromsar
  flaskhals text,
  -- Kontrollfrågan på resultatsidan: stämmer vår bedömning? (+ deras ord)
  bekraftelse text,
  bekraftelse_text text,
  tidshorisont text,
  verktyg jsonb not null default '[]'::jsonb,

  -- Kunder
  missade_samtal text,
  svarstid text,
  kundvarde text,

  -- Områden: [{ id, namn, lagt_min, lagt_max, idag, besparing_min,
  -- besparing_max, harledning, foreslaget, skal }]
  omraden jsonb not null default '[]'::jsonb,

  -- De tre förslagen som visades: [{ id, kalla, rubrik, varfor, steg,
  -- slipper, besparing_min, besparing_max, lagt_min, lagt_max, pengar,
  -- forsta_steget }]. Mejlen byggs av dessa, så de säger samma sak som sidan.
  forslag jsonb not null default '[]'::jsonb,

  -- Summor. timmar = vad de lägger i dag, besparing = vad som troligen går
  -- att spara, kronor = uteblivna affärer per månad från missade samtal.
  timmar_min numeric(5, 1),
  timmar_max numeric(5, 1),
  besparing_min numeric(5, 1),
  besparing_max numeric(5, 1),
  kronor_min integer,
  kronor_max integer,
  harledning_kronor text,

  -- "Om du kunde slippa en uppgift för alltid …" och Claudes förslag på det.
  fritext text,
  ai_forslag text,

  -- Den löpande AI-analysen: { hypotes, forslag, plan }. Byggs vidare efter
  -- varje skärm. ai_anrop räknar anropen — det finns ett tak per besök.
  ai_analys jsonb,
  ai_anrop integer not null default 0,

  -- Planen i tre faser som visades. Sätts när mejl lämnas, som forslag.
  plan jsonb not null default '[]'::jsonb,

  -- Referent från ?ref=
  ref text,

  -- Varifrån besökaren kom. referrer är bara domänen.
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  enhet text,

  -- Sparas löpande efter varje fråga. klar = resultatet har visats.
  -- En rad med klar = false är ett avhopp; senaste_fraga visar var.
  senaste_fraga text,
  klar boolean not null default false,

  -- Kontaktuppgifter, fylls i först när användaren lämnar dem
  kontakt_namn text,
  foretag text,
  telefon text,
  mejl text,
  ort text,
  skicka_resultat boolean not null default false,
  tips_namn text,
  tips_kontakt text,
  -- Satt när mejlen lämnats. Gör kontaktinskicket idempotent: bara första
  -- inskicket per besök kör eftersteg och skickar mejl.
  kontakt_at timestamptz,
  -- Satt när besökaren fyllt i det frivilliga på tacksidan. Går bara en gång.
  kompletterad_at timestamptz,

  -- Status per eftersteg: crm, saljmejl, resultatmejl.
  -- Varje steg är 'vantar' | 'skickad' | 'misslyckad', med försöksräknare.
  leverans_status jsonb not null default '{}'::jsonb,
  -- Sant när något steg misslyckats och ska försökas igen. Sätts tillsammans
  -- med leverans_status; cron-jobbet frågar efter den här kolumnen.
  behover_forsok boolean not null default false,
  -- Lås för cron-jobbet: raden behandlas av en körning fram till den här
  -- tiden. En annan körning rör den inte under tiden, så ingen lead får två
  -- mejl. Kraschar körningen släpper låset av sig självt när tiden gått ut.
  behandlas_till timestamptz
);

-- Kolumner som lagts till efter att tabellen först skapades. `create table if
-- not exists` rör inte en tabell som redan finns — de här raderna gör det, så
-- att filen alltid går att köra om. En ny kolumn läggs in på båda ställena,
-- och som en fil i db/migrations/.
alter table kompass_svar add column if not exists mal text;
alter table kompass_svar add column if not exists flaskhals text;
alter table kompass_svar add column if not exists bekraftelse text;
alter table kompass_svar add column if not exists bekraftelse_text text;
alter table kompass_svar add column if not exists behandlas_till timestamptz;

create index if not exists kompass_svar_session_idx on kompass_svar (session_id);
create index if not exists kompass_svar_created_idx on kompass_svar (created_at desc);
create index if not exists kompass_svar_klar_idx on kompass_svar (klar, created_at desc);

-- Hittar rader med eftersteg som behöver göras om. Används av cron-jobbet.
create index if not exists kompass_svar_leverans_idx
  on kompass_svar using gin (leverans_status);

-- Raderna cron-jobbet letar efter. Partiellt: bara de som väntar.
create index if not exists kompass_svar_behover_forsok_idx
  on kompass_svar (updated_at) where behover_forsok;

-- Håller updated_at aktuell utan att serverkoden behöver tänka på det.
create or replace function kompass_satt_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists kompass_svar_updated_at on kompass_svar;
create trigger kompass_svar_updated_at
  before update on kompass_svar
  for each row execute function kompass_satt_updated_at();

-- ── Mätning ─────────────────────────────────────────────────────────────────
-- Egen tabell, ingen tredjepartsspårare och inga cookies som kräver samtycke.

create table if not exists kompass_events (
  id bigint generated always as identity primary key,
  session_id text not null,
  steg text,
  handelse text not null,
  created_at timestamptz not null default now()
);

create index if not exists kompass_events_session_idx on kompass_events (session_id);
create index if not exists kompass_events_handelse_idx on kompass_events (handelse, created_at desc);

-- ── Spamskydd ───────────────────────────────────────────────────────────────
-- Räknar inskick per IP och timme. IP lagras som hash, aldrig i klartext.

create table if not exists kompass_inskick (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  -- 'inskick' = kontaktformuläret, 'ai' = anrop till Claude, 'session' = nya
  -- besök, 'event' = mätning. Egna gränser, se GRANSER i spamskydd.ts.
  typ text not null default 'inskick',
  created_at timestamptz not null default now()
);

create index if not exists kompass_inskick_idx on kompass_inskick (ip_hash, typ, created_at desc);

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- På, utan policies: ingen annan roll än ägaren kommer åt tabellerna.

alter table kompass_svar enable row level security;
alter table kompass_events enable row level security;
alter table kompass_inskick enable row level security;
