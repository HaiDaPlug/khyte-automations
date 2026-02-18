import Container from "./Container";
import CalendlyButton from "./CalendlyButton";

export default function PreFooterCTA() {
  return (
    <section className="bg-transparent py-14 md:py-16">
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-warm-text)] tracking-[-0.02em] leading-[1.05] text-balance mb-4">
            Visa oss en process - vi visar vad som går att automatisera
          </h2>
          <p className="text-[var(--color-warm-text-muted)] text-base md:text-lg leading-[1.6] max-w-[60ch] mb-6">
            Boka ett 15-minuters intro. Inga slides, ingen försäljning - bara en
            ärlig diskussion om era flöden.
          </p>
          <CalendlyButton
            variant="warm"
            className="rounded-full px-7 text-[15px] md:text-[16px] font-semibold tracking-[-0.01em] bg-[var(--color-cta-primary)] text-white/95 hover:bg-[var(--color-cta-primary-hover)] border border-white/10 shadow-[0_14px_34px_rgba(40,22,15,0.32)] hover:shadow-[0_18px_40px_rgba(40,22,15,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
          >
            Boka intro (15 min)
          </CalendlyButton>
        </div>
      </Container>
    </section>
  );
}
