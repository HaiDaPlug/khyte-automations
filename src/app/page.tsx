import Nav from "@/components/Nav";
import Button from "@/components/Button";
import CaseCard from "@/components/CaseCard";
import Container from "@/components/Container";

const casePreviews = [
  {
    problem: '"Vi lägger timmar på att flytta data manuellt."',
    title: "Automatiserad orderhantering",
    description:
      "Kopplade ihop e-handelsplattformen med affärssystemet. Resultatet blev noll manuell inmatning och realtidsuppdaterat lager.",
  },
  {
    problem: '"Inkorgen är ett svart hål av frågor."',
    title: "AI-driven inbox triage",
    description:
      "Ett system som läser, kategoriserar och utkast-svarar på inkommande kundmail. Kunden godkänner bara svaret innan det skickas.",
  },
];

export default function Home() {
  return (
    <div>
      <Container>
        <Nav />

        {/* Hero Section */}
        <header className="min-h-[85vh] flex flex-col justify-center max-w-[900px]">
          <h1
            className="text-[clamp(3rem,5vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.03em] mb-8 text-[var(--color-text)]"
            style={{ fontWeight: 500 }}
          >
            AI som tar hand om jobbet du inte vill göra.
          </h1>

          <p
            className="text-[clamp(1.1rem,2vw,1.25rem)] text-[var(--color-muted)] max-w-[600px] mb-12"
            style={{ fontWeight: 300 }}
          >
            Jag bygger automationer som tar bort friktion i vardagen — utan
            hype, bara fungerande workflows.
          </p>

          <div className="flex gap-4">
            <Button variant="primary" href="/contact">
              Boka ett samtal
            </Button>
            <Button variant="secondary" href="/cases">
              Se hur det funkar
            </Button>
          </div>
        </header>

        {/* Cases Section */}
        <section className="section">
          <span className="section-header">Nyliga projekt</span>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-[var(--spacing-section)]">
            {casePreviews.slice(0, 2).map((caseItem, index) => (
              <CaseCard
                key={index}
                problem={caseItem.problem}
                title={caseItem.title}
                description={caseItem.description}
              />
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="section-border mb-[var(--spacing-section)]">
          <div className="max-w-[600px] mb-16">
            <h2 className="text-2xl font-medium text-[var(--color-text)] mb-3">
              Så jobbar jag
            </h2>
            <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
              En rak process utan onödiga möten. Från problem till lösning på
              kortast möjliga tid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Timeline connecting line - only visible on desktop */}
            <div className="hidden md:block absolute top-6 left-6 right-6 h-[2px] bg-[var(--color-border)] z-0" />

            {/* Step 1 */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-accent)] text-[var(--color-bg)]">
                1
              </div>
              <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
                Kartlägger flödet – vi hittar tidstjuvarna
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
                Vi går igenom era processer och identifierar var energin läcker.
                Vi letar efter upprepning och friktion.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-bg)] border-2 border-[var(--color-accent)] text-[var(--color-accent)]">
                2
              </div>
              <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
                Bygger en prototyp – testar snabbt
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
                Inget evighetsplanerande. Jag bygger en fungerande version som
                vi testar mot verkligheten direkt.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)]">
                3
              </div>
              <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
                Implementerar skarpt – justerar tills det sitter
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
                Vi driftsätter lösningen. Jag finns kvar och trimmar systemet
                tills det rullar av sig själv.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="py-[100px] border-t border-[var(--color-border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-medium mb-4 text-[var(--color-text)]">
                Redo att automatisera bort tråkiga uppgifter?
              </h2>
              <p className="text-[var(--color-muted)] text-base leading-[1.6] mb-8">
                Boka ett samtal så går vi igenom hur automation kan frigöra tid
                i din verksamhet.
              </p>
              <Button variant="primary" href="/contact">
                Boka ett samtal
              </Button>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face"
                alt="Person working"
                className="max-w-full h-auto rounded-[4px] max-h-80 md:max-h-[320px] object-cover"
              />
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
}
