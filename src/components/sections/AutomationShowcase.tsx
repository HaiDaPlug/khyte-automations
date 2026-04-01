import { RefreshCw, Inbox, BarChart3 } from "lucide-react";

export default function AutomationShowcase() {
  return (
    <section className="border-t border-[var(--color-border)] py-16 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* Section header */}
        <div className="mb-10">
          <span className="section-eyebrow">Automatisering</span>
          <h2 className="font-display overflow-visible text-[2.5rem] md:text-[3.5rem] leading-[1.15] tracking-wide uppercase text-[var(--color-text)]">
            SLUTA SLÖSA TID<br /><span style={{ color: "#D4622B" }}>PÅ DET SOM GÅR ATT AUTOMATISERA.</span>
          </h2>
          <p className="text-base font-medium text-[var(--color-text)] leading-[1.5] mt-3 max-w-[52ch]">
            Vi hittar vad som stjäl era timmar och bygger det som tar hand om det istället.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Card 01 — full-width */}
          <div
            className="md:col-span-2 rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]"
          >
            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mt-2 mb-3">
              <RefreshCw className="w-5 h-5 text-[var(--color-muted)] shrink-0" strokeWidth={2} />
              Samma data, tre system, varje dag
            </h3>
            <p className="text-base font-medium text-[var(--color-text)] leading-relaxed max-w-[52ch]">
              Ni matar in samma information på tre ställen. Det är inte ett arbetsflöde, det är slöseri. Vi kopplar ihop era verktyg så det händer automatiskt, en gång.
            </p>
          </div>

          {/* Card 02 */}
          <div
            className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]"
          >
            <h3 className="flex items-center gap-3 text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mt-2 mb-3">
              <Inbox className="w-5 h-5 text-[var(--color-muted)] shrink-0" strokeWidth={2} />
              Ärenden som ingen äger
            </h3>
            <p className="text-base font-medium text-[var(--color-text)] leading-relaxed max-w-[34ch]">
              Mejlet kom in. Ingen såg det. Kunden väntar fortfarande. Vi bygger flöden som fångar varje ärende, sorterar det och skickar det rätt utan att någon behöver kolla.
            </p>
          </div>

          {/* Card 03 */}
          <div
            className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]"
          >
            <h3 className="flex items-center gap-3 text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mt-2 mb-3">
              <BarChart3 className="w-5 h-5 text-[var(--color-muted)] shrink-0" strokeWidth={2} />
              Rapporten som tar hela fredagen
            </h3>
            <p className="text-base font-medium text-[var(--color-text)] leading-relaxed max-w-[34ch]">
              Dra data, formatera, skicka. Varje vecka. Vi automatiserar hela kedjan så rapporten landar i inkorgen utan att ni rör det.
            </p>
          </div>

        </div>

        {/* Brutalist CTA — pulls eye toward CasesSection */}
        <div className="flex justify-end mt-8">
          <a
            href="#cases"
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300 flex items-center gap-2"
          >
            UTFORSKA VÅRA CASES
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
