import Container from "./Container";
import CalendlyButton from "./CalendlyButton";

export default function PreFooterCTA() {
  return (
    <section className="bg-transparent py-14 md:py-16">
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-warm-text)] tracking-[-0.02em] leading-[1.05] text-balance mb-4">
            Redo för att automatisera repetitivt arbete?
          </h2>
          <p className="text-[var(--color-warm-text-muted)] text-base md:text-lg leading-[1.6] max-w-[60ch] mb-6">
            Boka ett 15-minuters samtal. Ingen press, vi går igenom era arbetsflöden och ser om det finns potential för ett samarbete.
          </p>
          <CalendlyButton
            variant="warm"
            className="btn-cta-lift rounded-full px-7 text-[15px] md:text-[16px] font-semibold tracking-[-0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
          >
            Boka genomgång
          </CalendlyButton>
        </div>
      </Container>
    </section>
  );
}
