-- 2026-09-30: lås för cron-jobbet, så att två samtidiga körningar inte
-- skickar samma mejl två gånger (Vercel kan köra ett cron-jobb mer än en gång).
-- Kör i Neons SQL Editor (eller med psql) på en databas där schema.sql redan
-- körts före det här datumet. Går att köra flera gånger.
alter table kompass_svar add column if not exists behandlas_till timestamptz;
