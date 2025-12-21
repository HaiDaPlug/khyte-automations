import Nav from "@/components/Nav";
import Container from "@/components/Container";
import Button from "@/components/Button";

const cases = [
  {
    title: "Lead Engine för sälj",
    problem: "Manuell datainsamling från Allabolag tar för lång tid",
    build: "Automatisk hämtning av företagsdata till Google Sheets",
    result: "Säljteam får färdiga listor utan manuellt arbete",
  },
  {
    title: "SEO-Research för potentiella kunder",
    problem: "Research tar timmar ur arbetsveckan",
    build: "Automatisk insamling av leadsinformation med analys av digital närvaro och förbättringar",
    result: "Byrån kan fokusera på strategi istället för datainsamling",
  },
];

export default function Cases() {
  return (
    <div>
      <Nav />
      <Container>
        <main className="pt-32 pb-20">
          <div className="mb-16">
            <h1 className="text-[clamp(3rem,5vw,4rem)] font-bold text-[var(--color-text)] mb-4 tracking-[-0.03em] leading-[1.1]">
              Case
            </h1>
            <p className="text-[var(--color-text-body)] text-[1.25rem] leading-[1.6] max-w-[65ch]">
              Exempel på automationer vi har byggt
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-16">
            {cases.map((caseItem, index) => (
              <div
                key={index}
                className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]"
              >
                <h2 className="text-[2rem] font-semibold text-[var(--color-text)] mb-6 tracking-[-0.01em] leading-[1.2]">
                  {caseItem.title}
                </h2>
                <div className="space-y-4 text-[15px]">
                  <div>
                    <p className="text-[var(--color-accent)] font-bold mb-2 text-sm tracking-[0.02em]">
                      Problem
                    </p>
                    <p className="text-[var(--color-text-body)] leading-[1.5] text-base max-w-[460px]">
                      {caseItem.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--color-accent)] font-bold mb-2 text-sm tracking-[0.02em]">
                      Build
                    </p>
                    <p className="text-[var(--color-text-body)] leading-[1.5] text-base max-w-[460px]">
                      {caseItem.build}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--color-accent)] font-bold mb-2 text-sm tracking-[0.02em]">
                      Result
                    </p>
                    <p className="text-[var(--color-text-body)] leading-[1.5] text-base max-w-[460px]">
                      {caseItem.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-8">
            <p className="text-[1.25rem] text-[var(--color-text)] mb-6 font-medium leading-[1.6]">
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
