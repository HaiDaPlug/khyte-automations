-- 2026-09-28: målet ("Vad är viktigast just nu?") sparas i egen kolumn.
-- Kör i Neons SQL Editor (eller med psql) på en databas där schema.sql redan
-- körts före det här datumet. Går att köra flera gånger.
alter table kompass_svar add column if not exists mal text;
