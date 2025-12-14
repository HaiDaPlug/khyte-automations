import Nav from "@/components/Nav";
import Container from "@/components/Container";
import Button from "@/components/Button";

const cases = [
  {
    title: "Prospektmotor för sälj",
    problem: "Manuell datainsamling tar för lång tid",
    build: "Automatisk hämtning av företagsdata till Google Sheets",
    result: "Säljteam får färdiga listor utan manuellt arbete",
  },
  {
    title: "Research-motor för byrå",
    problem: "Research om kunder tar timmar av arbetsveckan",
    build: "Automatisk insamling av bransch- och konkurrentdata",
    result: "Byrån kan fokusera på strategi istället för datainsamling",
  },
  {
    title: "Interna admin-flöden",
    problem: "Manuell datahantering mellan verktyg",
    build: "Automatiserade flöden för påminnelser och dataförflyttning",
    result: "Mindre manuellt arbete, färre fel",
  },
];

export default function Cases() {
  return (
    <div>
      <Container>
        <Nav />

        <main className="py-16">
          <div className="mb-12">
            <span className="section-header">Case</span>
            <p className="text-[var(--color-muted)] text-[15px] max-w-2xl">
              Exempel på automationer jag byggt
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-16">
            {cases.map((caseItem, index) => (
              <div
                key={index}
                className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-10 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]"
              >
                <h2 className="text-2xl font-medium text-[var(--color-text)] mb-6">
                  {caseItem.title}
                </h2>
                <div className="space-y-4 text-[15px]">
                  <div>
                    <p className="text-[var(--color-accent)] font-medium mb-1">
                      Problem
                    </p>
                    <p className="text-[var(--color-muted)] leading-[1.6]">
                      {caseItem.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--color-accent)] font-medium mb-1">
                      Build
                    </p>
                    <p className="text-[var(--color-muted)] leading-[1.6]">
                      {caseItem.build}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--color-accent)] font-medium mb-1">
                      Result
                    </p>
                    <p className="text-[var(--color-muted)] leading-[1.6]">
                      {caseItem.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-lg text-[var(--color-muted)] mb-6">
              Vill du ha en liknande lösning?
            </p>
            <Button variant="primary" href="/contact">
              Kontakta mig
            </Button>
          </div>
        </main>
      </Container>
    </div>
  );
}
