-- 2026-09-28: följdfrågan efter målet och kontrollfrågan på resultatsidan.
-- Kör i Supabase Dashboard → SQL Editor på en databas där schema.sql redan
-- körts före det här datumet. Går att köra flera gånger.
alter table kompass_svar add column if not exists flaskhals text;
alter table kompass_svar add column if not exists bekraftelse text;
alter table kompass_svar add column if not exists bekraftelse_text text;
