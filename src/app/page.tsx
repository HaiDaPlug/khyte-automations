import Nav from "@/components/Nav";
import Button from "@/components/Button";
import CaseCard from "@/components/CaseCard";
import Container from "@/components/Container";
import { DnaWeaveSvg } from "@/components/DnaWeaveSvg";

const casePreviews = [
  {
    problem: '"Jag jobbar mycket med allabolag."',
    title: "Automatiserad informationsförädling",
    description:
      "Kunden jobbar mycket med informationssökning manuellt på allabolag. Istället gjorde vi hela processen automatisk.",
  },
  {
    problem: '"Kan man hitta företag utanför top 5 på Google?"',
    title: "SEO-Research på potentiella leads",
    description:
      "Ett system som hittar hemsidor utanför top 5, researchar sidan, kommer tillbaka med svagheter och styrkor samt förbättringar.",
  },
];

export default function Home() {
  return (
    <div>
      <Container>
        <Nav />

        {/* Hero Section */}
        <header className="relative min-h-[92svh] md:min-h-[100svh] flex flex-col justify-center max-w-[900px] pb-10 md:pb-12 mx-auto text-center items-center">
          <h1
            className="text-[clamp(3rem,5vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.03em] mb-8 text-[var(--color-text)]"
            style={{ fontWeight: 500 }}
          >
            AI som tar hand om jobbet som du inte behöver göra.
          </h1>

          <p
            className="text-[clamp(1.1rem,2vw,1.25rem)] text-[var(--color-muted)] max-w-[600px] mb-12"
            style={{ fontWeight: 300 }}
          >
            Vi bygger automationer som tar bort friktion i vardagen - kundnära
            effektivt, med fungerande workflows.
          </p>

          <div className="flex gap-4">
            <Button variant="primary" href="/contact">
              Boka ett samtal
            </Button>
            <Button variant="secondary" href="/cases">
              Se hur det funkar
            </Button>
          </div>

          {/* Scroll cue chevron */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] opacity-70 hover:opacity-100 transition flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="var(--color-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </header>

        {/* Full-width divider */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-b border-[var(--color-border)]"></div>

        {/* Spacer */}
        <div className="h-12 md:h-16"></div>

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
              Så jobbar vi
            </h2>
            <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
              En simpel process utan onödigt skit. Från problem till lösning på
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
                Kartlägger flödet - vi hittar tidstjuvarna
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
                Bygger en prototyp och testar snabbt
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
                Inget evighetsplanerande. Vi bygger en fungerande version som
                vi testar mot verkligheten direkt.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)]">
                3
              </div>
              <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
                Implementerar skarpt - justerar tills det sitter
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
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-medium mb-4 text-[var(--color-text)]">
              Redo att automatisera bort tråkiga uppgifter?
            </h2>
            <p className="text-[var(--color-muted)] text-base leading-[1.6] mb-8 max-w-2xl">
              Boka ett samtal så går vi igenom hur automation kan frigöra tid
              i din verksamhet.
            </p>
            <Button variant="primary" href="/contact">
              Boka ett samtal
            </Button>

            <div className="mt-6 w-full flex justify-center">
              <DnaWeaveSvg
                className="max-w-full h-auto rounded-[4px] max-h-80 md:max-h-[320px] opacity-[0.24]"
                style={{ color: 'var(--color-muted)' }}
                aria-label="DNA weave animation"
              />
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
}
