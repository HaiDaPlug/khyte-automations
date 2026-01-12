import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import CaseCard from "@/components/CaseCard";
import Container from "@/components/Container";
import { DnaWeaveSvg } from "@/components/DnaWeaveSvg";
import TimelineProcess from "@/components/TimelineProcess";
import ToolsTicker from "@/components/ToolsTicker";

export const metadata: Metadata = {
  title: "AI-automation för företag – Frigör tid från manuellt arbete",
  description:
    "Vi bygger AI-automationer som eliminerar repetitivt arbete i er verksamhet. Snabb implementering, tydlig process. Se konkreta exempel från säljautomation och research.",
  alternates: {
    canonical: "/",
  },
};

const casePreviews = [
  {
    problem: '"Jag jobbar mycket med Allabolag."',
    title: "Automatiserad informationsförädling",
    description:
      "Kunden jobbar mycket med informationssökning manuellt på allabolag. Istället gjorde vi hela processen automatisk.",
  },
  {
    problem: '"Kan man hitta företag utanför topp 5 på Google?"',
    title: "SEO-research på potentiella leads",
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
        <section className="min-h-[100dvh] flex flex-col justify-center items-center pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="max-w-[900px] mx-auto text-center">
            <h1 className="text-hero text-5xl md:text-7xl mb-8 drop-shadow-sm text-[var(--color-text)]">
              AI som tar hand om jobbet du inte behöver göra.
            </h1>

            <p className="text-xl text-[var(--color-text-body)] max-w-[580px] mx-auto leading-relaxed mb-12">
              Vi eliminerar manuella fel och frigör tid för det som faktiskt skapar värde. Kundnära, effektivt och byggt för att hålla.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Button variant="primary" href="/contact">
                Boka ett samtal
              </Button>
              <Button variant="secondary" href="/cases">
                Se hur det funkar
              </Button>
            </div>
          </div>

          {/* Tools Ticker */}
          <div className="mt-20">
            <ToolsTicker />
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
        </section>

        {/* Full-width divider */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-b border-[var(--color-border)]"></div>

        {/* Spacer */}
        <div className="h-12 md:h-16"></div>

        {/* Cases Section */}
        <section className="section">
          <span className="text-label mb-8">Senaste projekt</span>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8">
            {casePreviews.slice(0, 2).map((caseItem, index) => (
              <CaseCard
                key={index}
                problem={caseItem.problem}
                title={caseItem.title}
                description={caseItem.description}
              />
            ))}
          </div>

          <p className="text-center mt-8 mb-[var(--spacing-section)]">
            <a href="/cases" className="text-[var(--color-muted)] hover:text-[var(--color-text)] underline transition-colors">
              Se mer av våra cases →
            </a>
          </p>
        </section>

        {/* Process Section */}
        <TimelineProcess />

        {/* Footer CTA */}
        <footer className="py-[100px] border-t border-[var(--color-border)]">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-5xl md:text-6xl font-semibold mb-4 text-[var(--color-text)] tracking-[-0.01em] leading-[1.2]">
              Redo att automatisera bort tråkiga uppgifter?
            </h2>
            <p className="text-[var(--color-text-body)] text-base leading-[1.6] mb-10 max-w-2xl">
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
