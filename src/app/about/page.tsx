import Nav from "@/components/Nav";
import Container from "@/components/Container";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div>
      <Nav />
      <Container>
        <main className="pt-32 pb-20">
          {/* Page header */}
          <div className="mb-16">
            <h1 className="text-[2.5rem] font-medium text-[var(--color-text)] mb-4 tracking-[-0.02em]">
              Om Khyte Automations
            </h1>
          </div>

          {/* Section 1: Varför Khyte finns */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left column - Copy */}
              <div>
                <p className="text-[15px] leading-[1.6] text-[var(--color-muted)]">
                  Khyte Automations finns för att göra arbetet lättare. Många företag sitter med onödigt manuellt arbete som människan egentligen inte behöver göra - uppgifter som dataförflyttning, klipp-och-klistra och arbete som tar energi men inte ger tillbaka. Därför fokuserar vi på att bygga och integrera AI i flöden för att eliminera friktionen i vardagen - så att företag får mer tid och fokus, med färre onödiga moment.
                </p>
              </div>
              {/* Right column - Placeholder image */}
              <div>
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] aspect-[16/10]"></div>
              </div>
            </div>
          </section>

          {/* Section 2: Hur vi tänker & vad du kan förvänta dig */}
          <section className="mb-20">
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-10 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]">
              <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] mb-6">
                Vi tror inte att AI kan göra allt. Däremot kan den göra mycket, rätt byggt kan det ta hand om repetitivt arbete och göra flöden mer effektiva.
              </p>

              <p className="text-[var(--color-text)] font-medium mb-3">
                Du kan förvänta dig att vi:
              </p>

              <ul className="space-y-2 mb-6 text-[15px] leading-[1.6] text-[var(--color-muted)]">
                <li>- Vi börjar alltid med flödet, inte verktyget.</li>
                <li>- Bygger en snabb prototyp och testar i verkligheten.</li>
                <li>- Håller det simpelt, robust och säkert.</li>
                <li>- Transparenta och rakt på sak.</li>
                <li>- Finslipar tills det är produktionsredo, och lämnar något ni är stolta att äga.</li>
              </ul>

              <p className="text-[15px] leading-[1.6] text-[var(--color-muted)]">
                Målet är alltid: mindre friktion, färre fel och mer tid för tillväxt.
              </p>
            </div>
          </section>

          {/* Section 3: Vi bakom Khyte */}
          <section>
            <h2 className="text-2xl font-medium text-[var(--color-text)] mb-8">
              Vi bakom Khyte
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Profile 1 - Hai */}
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-10 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]">
                {/* Profile image */}
                <div className="border border-[var(--color-border)] rounded-[4px] aspect-[4/7] mb-6 overflow-hidden">
                  <Image
                    src="/Hai Bui.png"
                    alt="Hai Bui"
                    width={1414}
                    height={2000}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-medium text-[var(--color-text)] mb-1">
                  Hai Bui
                </h3>

                {/* Role */}
                <p className="text-sm text-[var(--color-muted)] mb-4">
                  Grundare och Automationsansvarig
                </p>

                {/* Description */}
                <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] mb-4">
                  Har grundat Khyte Automations och driver bolaget idag. Värderar ärlighet, sårbarhet och gillar att ha kul. Väldigt nyfiken och är alltid öppen för nytt.
                </p>

                {/* Contact */}
                <a
                  href="mailto:hai@khyteteam.com"
                  className="text-[15px] text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-200"
                >
                  hai@khyteteam.com
                </a>
              </div>

              {/* Profile 2 - Abdi */}
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-10 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]">
                {/* Profile image */}
                <div className="border border-[var(--color-border)] rounded-[4px] aspect-[4/7] mb-6 overflow-hidden">
                  <Image
                    src="/Abdi.png"
                    alt="Abdimajiid Mohamud"
                    width={1414}
                    height={2000}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-medium text-[var(--color-text)] mb-1">
                  Abdimajiid Mohamud
                </h3>

                {/* Role */}
                <p className="text-sm text-[var(--color-muted)] mb-4">
                  Partner - Säljare
                </p>

                {/* Description */}
                <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] mb-4">
                  Hjälper till som en "högra hand", och har en extremt bra känsla för lösningar. En social kille med mycket att erbjuda. 
                </p>

                {/* Contact placeholder */}
                <a
                  href="mailto:abdimajiidmohamud@gmail.com"
                  className="text-[15px] text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-200"
                >
                  abdimajiidmohamud@gmail.com
                </a>
              </div>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
