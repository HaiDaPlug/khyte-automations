import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import CalendlyButton from "@/components/CalendlyButton";

export const metadata: Metadata = {
  title: "Tjänster – Automationer för svenska företag",
  description: "Vi automatiserar manuella processer. Transparent prissättning, fast pris, ingen vendor lock-in.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-24">
      <Container>

        {/* 1. HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <h1 className="text-hero text-5xl md:text-7xl text-[var(--color-text)] mb-8 max-w-[800px]">
            Våra tjänster
          </h1>
          <p className="text-xl text-[var(--color-text-body)] max-w-[640px] leading-relaxed mb-10">
            Vi bygger automationer som tar hand av manuellt arbete. Ni äger koden, ni bestämmer takten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <CalendlyButton variant="primary">
              Boka intro (15 min)
            </CalendlyButton>
            <a
              href="#sa-jobbar-vi"
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
            >
              Se hur vi jobbar
            </a>
          </div>
        </div>

        {/* 2. VAD VI AUTOMATISERAR */}
        <div className="mb-32">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Vad vi automatiserar
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              Typ av processer vi brukar ta hand av.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Leads", desc: "Hämta och förädla data från Allabolag och andra källorna" },
              { label: "CRM", desc: "Synka och uppdatera poster mellan era system" },
              { label: "Uppföljning", desc: "Automatisk e-post research och uppföljning på leads" },
              { label: "Bokföring", desc: "Faktura- och bokföringsflöden som sköter sig själv" },
              { label: "Rapporter", desc: "Sammanställning och rapportgenerering från era data" },
              { label: "Monitoring", desc: "Automatiska alerts och notifikationer vid fel eller händelser" },
              { label: "Dokumenter", desc: "Förädling och hantering av filer och dokument" },
              { label: "Validering", desc: "Kvalitets- och datakontroll innan data når nästa steg" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-6 hover:border-[rgba(58,51,48,0.20)] transition-colors"
              >
                <p className="text-label mb-2">{item.label}</p>
                <p className="text-[var(--color-text-body)] text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SÅ JOBBAR VI */}
        <div id="sa-jobbar-vi" className="border-t border-[var(--color-border)] pt-24 mb-32">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Så jobbar vi
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              Vi tar ett projekt i taget. Inga parallella uppdrag, inga halv-implementationer. Er automation får full fokus från start till mål.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                step: "01",
                title: "Kvalificeringssamtal (gratis)",
                desc: "Ett 15-minuters intro där vi diskuterar era flöden på hög nivå. Inga slides, ingen försäljning – vi avgör tillsammans om vi kan hjälpa er."
              },
              {
                step: "02",
                title: "Förstudie (fast pris)",
                desc: "Vi går in i era system, kartlägger flöden, och designar den tekniska lösningen. Ni får en blueprint och ett fast pris för implementation. Priset diskuteras vid kontakt."
              },
              {
                step: "03",
                title: "Implementation (fast pris efter förstudie)",
                desc: "Vi bygger automationen i iterationer. Ni godkänner varje milestone innan vi går vidare. Transparenta kostnader, inga överraskningar."
              },
              {
                step: "04",
                title: "Överlämning & Drift",
                desc: "Vi tränar ert team, överlämnar dokumentation, och ger er full äganderätt. Ni får också en supportperiod där vi fixar eventuella buggar."
              }
            ].map((item, i) => (
              <div key={i} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8">
                <div className="text-xs font-bold text-[var(--color-muted)] mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] text-[var(--color-text-body)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SKRÄDDARSYDD AUTOMATION */}
        <div className="border-t border-[var(--color-border)] pt-24 mb-32">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Skräddarsydd automation
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              Vi bygger, integrar och levererar automationer anpassade till era system och flöden. Alltid ett projekt i taget – alltid skräddarsydda, alltid med fast pris.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price card */}
            <div className="bg-[var(--color-card-bg)] border border-[rgba(58,51,48,0.25)] rounded-[4px] p-8">
              <div className="text-3xl font-bold text-[var(--color-text)] mb-1">25 000 – 120 000 kr</div>
              <p className="text-[var(--color-text-body)] text-sm mb-6">Fast pris efter scope</p>
              <p className="text-[var(--color-muted)] text-xs font-bold uppercase tracking-wider mb-3">Vad som påverkar priset</p>
              <ul className="space-y-2">
                {[
                  "Antal system och integrationspunkter",
                  "Datakvalitet i era nuläge",
                  "Antal steg i flödet",
                  "Edge cases och undantagsfall",
                  "Godkännandesteg och inblandade parter",
                ].map((item, i) => (
                  <li key={i} className="text-[15px] text-[var(--color-text-body)] leading-relaxed">– {item}</li>
                ))}
              </ul>
            </div>

            {/* What's included card */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8">
              <p className="text-[var(--color-muted)] text-xs font-bold uppercase tracking-wider mb-3">Vad ingår</p>
              <ul className="space-y-2">
                {[
                  "Kickoff och scope-definition",
                  "Byggande av automationen",
                  "Testing och quality check",
                  "Grundläggande logging och synlighet",
                  "Dokumentation",
                  "Kort supportfönster efter leverans",
                ].map((item, i) => (
                  <li key={i} className="text-[15px] text-[var(--color-text-body)] leading-relaxed">– {item}</li>
                ))}
              </ul>
              <div className="mt-8">
                <CalendlyButton variant="primary">Diskutera ert projekt</CalendlyButton>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SUPPORT & FÖRBÄTTRING */}
        <div className="border-t border-[var(--color-border)] pt-24 mb-32">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Support & förbättring (valfritt)
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              Efter leverans kan ni köra själva — eller så hjälper vi er hålla flödet stabilt och göra små förbättringar när processen ändras.
            </p>
          </div>

          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8">
            <p className="text-[var(--color-muted)] text-xs font-bold uppercase tracking-wider mb-3">Vad ingår i support</p>
            <ul className="space-y-2">
              {[
                "Justeringar när er process ändras",
                "Felsökning om något stannar upp",
                "Små förbättringar baserade på verklig användning",
                "Månatlig avstämning och grundläggande monitoring",
                "Dokumentationsuppdateringar vid ändrat flöde",
                "Mindre tillägg kan göras vid behov",
              ].map((item, i) => (
                <li key={i} className="text-[15px] text-[var(--color-text-body)] leading-relaxed">– {item}</li>
              ))}
            </ul>
          </div>

          <p className="text-[var(--color-muted)] text-sm mt-6">
            Prissätts efter leverans beroende på omfattning — vi sätter ett fast månadsbelopp efter en kort avstämning.
          </p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
            >
              Prata om support
            </Link>
          </div>
        </div>

        {/* 6. AUTOMATIONSRESA */}
        <div className="border-t border-[var(--color-border)] pt-24 mb-32">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Automationsresa (3 / 6 / 12 månader)
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              För team som vill jobba stegvis över tid. Vi bygger en automation i taget, mäter effekten, och fortsätter där det ger mest värde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                duration: "3 månader",
                subtitle: "Snabba vinster",
                bullets: [
                  "Identifiera och bygga er första automation",
                  "Kartläggning av var det ger snabbast effekt",
                  "Uppföljning och justeringar efter första veckor i drift",
                ],
              },
              {
                duration: "6 månader",
                subtitle: "Systematisera",
                bullets: [
                  "Ofta 2–3 automationer på plats",
                  "Systematisk uppföljning på varje flöde",
                  "Nästa steg baserat på verklig data",
                  "Dokumentation och teamutbildning löpande",
                ],
              },
              {
                duration: "12 månader",
                subtitle: "Långsiktig partner",
                bullets: [
                  "En hel automationssvit på plats",
                  "Löpande optimering och nya flöden",
                  "En sak i taget — tydligt scope hela vägen",
                  "Vi säger om det inte är värt att bygga",
                ],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8 hover:border-[rgba(58,51,48,0.20)] transition-colors"
              >
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">{tier.duration}</h3>
                <p className="text-label mb-3">{tier.subtitle}</p>
                <ul className="space-y-2 mt-4">
                  {tier.bullets.map((b, j) => (
                    <li key={j} className="text-[15px] text-[var(--color-text-body)] leading-relaxed">– {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-[var(--color-muted)] text-sm mt-8">
            Fast månadsupplägg efter scope — vi föreslår ett upplägg efter en kort genomgång.
          </p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
            >
              Prata om en automationsresa
            </Link>
          </div>
        </div>

        {/* 7. RESULTAT / VAD NI BRUKAR FÅ */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8 md:p-12 mb-32">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Resultat / vad ni brukar få
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              Typiska resultat. Alla siffror beror på er specifika process – vi är alltid öppna med vad som är realistiskt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">5–20h/vecka</div>
              <p className="text-[15px] text-[var(--color-text-body)]">
                Sparade timmar per automation, beroende på process och volym.
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">Färre fel</div>
              <p className="text-[15px] text-[var(--color-text-body)]">
                Automation följer regler konsekvent, men resultaten beror på datakvalitet.
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">2–6 veckor</div>
              <p className="text-[15px] text-[var(--color-text-body)]">
                Från förstudie till drift, beroende på komplexitet och integrationskrav.
              </p>
            </div>
          </div>
        </div>

        {/* 8. FAQ */}
        <div className="mb-32">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
              Vanliga frågor
            </h2>
            <p className="text-[var(--color-text-body)] text-lg max-w-2xl">
              Svar på frågor vi får ofta.
            </p>
          </div>

          <div>
            {[
              {
                q: "Varför ska vi betala för en förstudie?",
                a: "Förstudien är djup teknisk analys och design – inte ett försäljningssamtal. Vi går in i era system, kartlägger dataflöden, och ritar en exakt lösning. Det tar tid och kräver expertis. Beloppet ger er en konkret plan och ett fast pris för bygget."
              },
              {
                q: "Hur lång tid tar en implementation?",
                a: "Det beror på komplexitet. Små automationer kan vara klara på 2-3 veckor, större projekt tar 4-6 veckor. Vi ger er en tidsplan i förstudien så ni vet exakt vad som gäller."
              },
              {
                q: "Vad händer om det inte är värt att automatisera?",
                a: "Då säger vi det direkt. Vi säljer inte på er något som inte ger värde. Om ROI inte är tydlig eller processen är för komplex, är vi öppna med det redan i kvalificeringssamtalet."
              },
              {
                q: "Vilka system kan ni jobba med?",
                a: "De flesta moderna verktyg med API:er – CRM (HubSpot, Pipedrive), bokföring (Fortnox, Visma), e-post (Gmail, Outlook), databaser, och webbapplikationer. Om systemet har ett API eller kan skrapas, kan vi ofta integrera det."
              },
              {
                q: "Vad ingår efter leverans?",
                a: "Ni får dokumentation, utbildning för ert team, och en supportperiod där vi fixar buggar kostnadsfritt. Ni äger koden och kan drifta allt själva. Om ni vill ha löpande support senare kan vi diskutera det separat."
              },
              {
                q: "Kan vi bara köpa implementationen utan förstudie?",
                a: "Nej. Förstudien är avgörande för att förstå era system och ge ett fast pris. Utan den riskerar vi att bygga fel sak eller att kostnaderna spårar ur. Vi vill inte ta den risken – och ni bör inte heller göra det."
              },
              {
                q: "Hur mycket kostar det typiskt?",
                a: "Vi jobbar med fast pris i intervallet 25 000–120 000 kr, beroende på scope. Exakt pris bestäms i förstudien – så ni vet vad det kostar innan ni bestämmer er."
              },
              {
                q: "Vem äger automationen efteråt?",
                a: "Ni gör. All kod, all dokumentation, alla inloggningsuppgifter. Ni kan drifta, ändra, och vidareutveckla systemet själva. Ingen vendor lock-in."
              }
            ].map((item, i, arr) => (
              <details
                key={i}
                className={`${i !== arr.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}
              >
                <summary className="flex justify-between items-center py-10 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(58,51,48,0.30)] rounded">
                  <span className="text-lg font-bold text-[var(--color-text)]">{item.q}</span>
                  <span className="faq-chevron transition-transform duration-200 text-[var(--color-muted)] flex-shrink-0 ml-4">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-10">
                  <p className="text-[15px] text-[var(--color-text-body)] leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 9. CTA SECTION */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-6">
            Redo att eliminera manuellt arbete?
          </h2>
          <p className="text-[var(--color-text-body)] text-lg mb-8 max-w-xl">
            Visa oss ett flöde – vi säger om vi kan hjälpa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <CalendlyButton variant="primary">
              Boka intro (15 min)
            </CalendlyButton>
            <Link
              href="/cases"
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
            >
              Se case
            </Link>
          </div>
        </div>

      </Container>
    </main>
  );
}
