import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Automation Case – Verkliga resultat från säljautomation & research",
  description:
    "Se hur vi automatiserat säljprocesser och research för svenska företag. Konkreta exempel på effektivare arbetsflöden.",
  alternates: {
    canonical: "/cases",
  },
};

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
            <h1 className="text-hero text-5xl md:text-7xl text-[var(--color-text)] mb-4 tracking-[-0.03em]">
              Utvalda Case
            </h1>
            <p className="text-[var(--color-text-body)] text-xl leading-[1.6] max-w-[60ch]">
              Exempel på automationer vi har byggt
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-16">
            {cases.map((caseItem, index) => (
              <article
                key={index}
                className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]"
              >
                <h2 className="text-[2rem] font-semibold text-[var(--color-text)] mb-6 tracking-[-0.01em] leading-[1.2]">
                  {caseItem.title}
                </h2>
                <div className="space-y-4 text-[15px]">
                  <div>
                    <p className="text-label mb-2">
                      Problem
                    </p>
                    <p className="text-[var(--color-text-body)] leading-[1.5] text-base max-w-[460px]">
                      {caseItem.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-label mb-2">
                      Build
                    </p>
                    <p className="text-[var(--color-text-body)] leading-[1.5] text-base max-w-[460px]">
                      {caseItem.build}
                    </p>
                  </div>
                  <div>
                    <p className="text-label mb-2">
                      Result
                    </p>
                    <p className="text-[var(--color-text-body)] leading-[1.5] text-base max-w-[460px]">
                      {caseItem.result}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-8 pb-20">
            <p className="text-4xl md:text-5xl text-[var(--color-text)] mb-6 font-bold tracking-tight leading-[1.6]">
              Vill du ha en liknande lösning?
            </p>
            <div className="mt-8">
              <Button variant="primary" href="/contact">
                Kontakta oss
              </Button>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}
