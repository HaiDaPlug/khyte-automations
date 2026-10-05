-- 2026-10-05: tak per dygn för AI-anropen på hela sajten (spamskydd.ts).
-- Räknar kompass_inskick per typ oavsett IP — det här indexet gör det snabbt.
-- Kör i Neons SQL Editor (eller med psql) på en databas där schema.sql redan
-- körts före det här datumet. Går att köra flera gånger.
create index if not exists kompass_inskick_typ_idx on kompass_inskick (typ, created_at desc);
