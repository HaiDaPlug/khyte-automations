import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Skräddarsydd Automation & Implementation | Khyte Automations",
  description: "Vi bygger, testar och driftsätter er automation. Nyckelfärdigt system med error handling, dokumentation och fast pris.",
};

const BUILD_FROM_SEK = "45 000 kr";
const BUILD_RANGE_SEK = "60 000 - 150 000 kr";
const SUPPORT_WINDOW_DAYS = "30";

export default function CustomBuildPage() {
  return (
    <main className="pt-32 pb-24">
      <Container>
        {/* 1. HERO */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-8 max-w-[900px]">
            Skräddarsydd Automation
          </h1>
          <p className="text-xl text-white/60 max-w-[640px] leading-relaxed mb-10">
            Vi bygger, testar och driftsätter ett system som ersätter manuellt arbete. Robust kod som ni äger.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Button href="/contact" variant="primary">
              Boka kvalificeringssamtal
            </Button>
            <Button href="/services/audit" variant="secondary">
              Se förstudie
            </Button>
          </div>

          {/* Differentiation Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-left max-w-3xl w-full bg-white/[0.02] border border-white/5 rounded-[4px] p-6">
            <div>
              <span className="block font-semibold text-white mb-1">Gratis Intro</span>
              <span className="text-[var(--color-muted)]">Kvalificering & kemi. Ingen leverans eller rådgivning.</span>
            </div>
            <div>
              <span className="block font-semibold text-white mb-1">Förstudie</span>
              <span className="text-[var(--color-muted)]">Teknisk blueprint, scope och fast prisoffert.</span>
            </div>
            <div>
              <span className="block font-semibold text-white mb-1">Build (Detta)</span>
              <span className="text-[var(--color-muted)]">Vi bygger systemet baserat på förstudien.</span>
            </div>
          </div>
        </div>

        {/* 2. ALWAYS INCLUDED */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Alltid inkluderat i leveransen
            </h2>
            <span className="text-sm text-white/40">
              Inga dolda tillägg för grundläggande kvalitet.
            </span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
            {[
              "Robust error handling & felloggar",
              "Omfattande testning (UAT)",
              "Dokumentation & instruktioner",
              "Överlämning & Onboarding-möte",
              "Notifieringar vid systemhändelser",
              "Fullt ägarskap (Ni äger koden)",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] p-5 rounded-[4px]">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-white/80 font-medium">{item}</span>
              </li>
            ))}

            {/* Support Highlight Card */}
            <li className="flex items-center gap-3 bg-[var(--color-card-bg)] border border-emerald-500/20 p-5 rounded-[4px] md:col-span-2 lg:col-span-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-white font-medium">
                Support: Vi finns tillgängliga för buggfixar i {SUPPORT_WINDOW_DAYS} dagar efter leverans.
              </span>
            </li>
          </ul>
        </section>

        {/* 3. PRICING ANCHORS */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Pricing Card */}
            <div className="lg:col-span-5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Investering</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <span className="text-white/50 text-sm block mb-1">Från</span>
                  <span className="text-4xl font-bold text-white">{BUILD_FROM_SEK}</span>
                </div>
                <div>
                  <span className="text-white/50 text-sm block mb-1">Typiskt projekt</span>
                  <span className="text-2xl font-medium text-white/80">{BUILD_RANGE_SEK}</span>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-[var(--color-border)] rounded-[4px] p-4">
                <p className="text-sm text-white/80 font-medium">
                  Alltid fast pris efter genomförd förstudie. Inga löpande timmar eller överraskningar.
                </p>
              </div>
            </div>

            {/* Right: Scope Factors */}
            <div className="lg:col-span-7 pt-4">
              <h3 className="text-xl font-semibold text-white mb-6">
                Vad påverkar priset?
              </h3>
              <p className="text-white/60 mb-8 leading-relaxed max-w-xl">
                Varje system är unikt. Priset sätts baserat på komplexitet, antal integrationer och krav på säkerhet. Här är de största faktorerna:
              </p>

              <ul className="space-y-4">
                {[
                  { factor: "Antal system", desc: "Ju fler system som ska prata med varandra, desto högre komplexitet." },
                  { factor: "Datakvalitet", desc: "Krävs det mycket städning och formatering av data innan den kan användas?" },
                  { factor: "Edge cases", desc: "Hur många undantag finns det i processen som måste hanteras manuellt idag?" },
                  { factor: "Säkerhet & Behörighet", desc: "Krav på godkännande-loopar eller specifik dataisolering." },
                  { factor: "Monitoring", desc: "Behov av avancerade dashboards för att övervaka flödet i realtid." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-emerald-500 font-mono text-sm mt-0.5 min-w-[120px]">{item.factor}</span>
                    <span className="text-white/60 text-sm">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. PROCESS STEPS */}
        <section className="mb-32">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-10 text-center md:text-left">
            Vägen till leverans
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-4 list-none">
            {[
              { title: "1. Audit", desc: "Vi sätter scope och designar lösningen (separat tjänst)." },
              { title: "2. Build", desc: "Vi utvecklar automationen i vår miljö och kopplar ihop systemen." },
              { title: "3. Test (UAT)", desc: "Vi testar tillsammans med er för att säkerställa att allt fungerar." },
              { title: "4. Handover", desc: "Vi flyttar lösningen till er miljö och utbildar teamet." },
            ].map((step, i) => (
              <li key={i} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-[4px]">
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. TRUST ELEMENTS */}
        <section className="mb-32 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-16">
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold">Tydlig dokumentation</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Ni får inte bara kod. Vi levererar instruktioner och dokumentation så att ni förstår hur systemet hänger ihop.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold">Security-first</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Vi hanterar API-nycklar säkert och designar flöden för att minimera risken för dataläckage.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold">Enkel handover</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Målet är att ni ska vara självständiga. Vi sätter upp allt på ert konto så att ni har full kontroll.
            </p>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="mb-32 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-10 text-center">
            Vanliga frågor
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "Måste vi göra en förstudie?",
                a: "Ja. För att kunna ge ett fast pris och garantera resultatet måste vi veta exakt vad som ska byggas. Utan en blueprint blir projekt ofta dyrare och sämre."
              },
              {
                q: "Hur lång tid tar en implementation?",
                a: "Ett typiskt projekt tar mellan 2-6 veckor från start till driftsättning, beroende på komplexitet och hur snabbt vi får tillgång till systemen."
              },
              {
                q: "Vad händer om vi redan vet exakt vad vi vill ha?",
                a: "Om ni redan har en färdig teknisk specifikation kan vi ibland hoppa över delar av förstudien. Vi granskar då er specifikation och ger en offert baserat på den."
              },
              {
                q: "Kan ni jobba med vår tech-stack?",
                a: "Vi är experter på moderna API-baserade verktyg och Python. Under kvalificeringssamtalet ser vi snabbt om era system är kompatibla med våra metoder."
              },
              {
                q: "Vad ingår efter leverans?",
                a: "Vi erbjuder 30 dagars garanti där vi fixar buggar kostnadsfritt. Därefter äger ni systemet helt. Behöver ni vidareutveckling eller löpande support kan vi diskutera ett separat avtal."
              }
            ].map((item, i) => (
              <div key={i} className="border-b border-white/10 pb-6 last:border-0">
                <h3 className="text-white font-medium mb-2">{item.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CLOSING CTA */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
            Låt oss bygga bort det manuella
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl">
            Har ni processen klar för er? Boka ett intro så tittar vi på hur vi kan automatisera den.
          </p>
          <Button href="/contact" variant="primary">
            Kontakta oss
          </Button>
        </div>
      </Container>
    </main>
  );
}
