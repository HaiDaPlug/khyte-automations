import Container from "./Container";
import CalendlyButton from "./CalendlyButton";

export default function PreFooterCTA() {
  return (
    <section className="bg-transparent py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-warm-text)] tracking-tight mb-4">
            Visa oss en process - vi visar vad som går att automatisera
          </h2>
          <p className="text-[var(--color-warm-text-muted)] text-base md:text-lg mb-8 leading-relaxed">
            Boka ett 15-minuters intro. Inga slides, ingen försäljning - bara en
            ärlig diskussion om era flöden.
          </p>
          <CalendlyButton
            variant="warm"
            className="rounded-full px-7 bg-[#3A3330] text-white hover:bg-[#2A2320] border border-[rgba(255,255,255,0.10)] shadow-[0_10px_26px_rgba(42,31,26,0.32)]"
          >
            Boka intro (15 min)
          </CalendlyButton>
        </div>
      </Container>
    </section>
  );
}
