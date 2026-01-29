import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Container from "@/components/Container";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Om oss – teamet bakom Khyte Automations",
  description:
    "Möt Hai och Abdi – teamet som bygger automationer för svenska företag. Transparent process, snabb leverans, långsiktigt samarbete.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div>
      <Nav />
      <Container>
        <main className="pt-32 pb-20">
          {/* Page header - Centered */}
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-hero text-5xl md:text-7xl text-[var(--color-text)] mb-6">
              Om Khyte Automations
            </h1>
            <p className="text-xl text-[var(--color-text-body)] max-w-2xl leading-[1.6]">
              Vilka vi är, vad vi står för och varför vi finns.
            </p>
          </div>

          {/* Section 1: Varför Khyte finns */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left column - Copy */}
              <div>
                <p className="text-[1.25rem] leading-[1.6] text-[var(--color-text-body)] max-w-[65ch]">
                  Khyte Automations finns för att göra arbetet lättare. Många företag sitter med onödigt manuellt arbete som människan egentligen inte behöver göra. Uppgifter som dataförflyttning, klipp-och-klistra och arbete som tar energi men inte ger tillbaka. Därför fokuserar vi på att bygga och integrera AI i flöden för att eliminera friktionen i vardagen - så att företag får mer tid och fokus, med färre onödiga moment.
                </p>
              </div>
              {/* Right column - Placeholder image */}
              <div>
                <div className="bg-white/5 border border-white/10 rounded-[4px] aspect-[16/10]"></div>
              </div>
            </div>
          </section>

          {/* Section 2: Hur vi tänker & vad du kan förvänta dig */}
          <section className="mb-20">
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]">
              <p className="text-[1.25rem] leading-[1.6] text-[var(--color-text-body)] mb-6 max-w-[65ch]">
                Vi tror inte att AI kan göra allt. Däremot kan den göra mycket, rätt byggt kan det ta hand om repetitivt arbete och göra flöden mer effektiva.
              </p>

              <p className="text-[var(--color-text)] font-semibold mb-3">
                Du kan förvänta dig att vi:
              </p>

              <ul className="space-y-2 mb-6 text-base leading-[1.5] text-[var(--color-text-body)]">
                <li>- Vi börjar alltid med flödet, inte verktyget.</li>
                <li>- Bygger en snabb prototyp och testar i verkligheten.</li>
                <li>- Håller det simpelt, robust och säkert.</li>
                <li>- Transparenta och rakt på sak.</li>
                <li>- Finslipar tills det är produktionsredo, och lämnar något ni är stolta att äga.</li>
              </ul>

              <p className="text-base leading-[1.5] text-[var(--color-text-body)]">
                Målet är alltid: mindre friktion, färre fel och mer tid för tillväxt.
              </p>
            </div>

            <div className="text-center mt-8">
              <a href="/cases" className="text-[var(--color-text)] hover:text-[var(--color-muted)] underline transition-colors">
                Se exempel på våra automationer →
              </a>
            </div>
          </section>

          {/* Section 3: Vi bakom Khyte */}
          <section>
            <h2 className="text-4xl font-bold text-[var(--color-text)] mb-10 tracking-tight leading-[1.2]">
              Vi bakom Khyte
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Profile 1 - Hai */}
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)] relative">
                {/* LinkedIn Icon - Bottom Right */}
                <a
                  href="https://www.linkedin.com/in/hai-pham-bui-8a9893395"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hai Bui på LinkedIn"
                  className="absolute bottom-8 right-8 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <img
                    src="/icons/linkedin.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </a>

                {/* Profile image */}
                <div className="border border-[var(--color-border)] rounded-[4px] aspect-[5/6] mb-6 overflow-hidden">
                  <Image
                    src="/Hai Bui 2.png"
                    alt="Hai Bui"
                    width={1414}
                    height={2000}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight leading-[1.3]">
                  Hai Bui
                </h3>

                {/* Role */}
                <p className="text-label mb-4">
                  Grundare och Automationsansvarig
                </p>

                {/* Description */}
                <p className="text-base leading-[1.5] text-[var(--color-text-body)] mb-4 max-w-[460px]">
                  Har grundat Khyte Automations och driver bolaget idag. Värderar ärlighet, sårbarhet och gillar att ha kul. Väldigt nyfiken och är alltid öppen för nytt.
                </p>

                {/* Contact Details */}
                <div className="mt-6 space-y-2 text-sm text-white/80">
                  <div>
                    <span className="font-semibold">Favorittuggummi:</span> Melon Mint
                  </div>
                  <div>
                    <span className="font-semibold">Mobil:</span>{" "}
                    <a
                      className="underline underline-offset-4 hover:text-white transition-colors"
                      href="tel:+46700996838"
                    >
                      070-099 68 38
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Mejl:</span>{" "}
                    <a
                      className="underline underline-offset-4 hover:text-white transition-colors"
                      href="mailto:hai@khyteteam.com"
                    >
                      hai@khyteteam.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Profile 2 - Abdi */}
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)] relative">
                {/* LinkedIn Icon - Bottom Right */}
                <a
                  href="https://www.linkedin.com/in/abdimajiid-mohamud-233539329/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abdimajiid Mohamud på LinkedIn"
                  className="absolute bottom-8 right-8 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <img
                    src="/icons/linkedin.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </a>

                {/* Profile image */}
                <div className="border border-[var(--color-border)] rounded-[4px] aspect-[5/6] mb-6 overflow-hidden">
                  <Image
                    src="/Abdi 2.png"
                    alt="Abdimajiid Mohamud"
                    width={1414}
                    height={2000}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight leading-[1.3]">
                  Abdimajiid Mohamud
                </h3>

                {/* Role */}
                <p className="text-label mb-4">
                  Operativt ansvarig - Säljare
                </p>

                {/* Description */}
                <p className="text-base leading-[1.5] text-[var(--color-text-body)] mb-4 max-w-[460px]">
                  Hjälper till som en "högra hand", och har en extremt bra känsla för lösningar. En social kille med ett stort driv och engagemang för att skapa värde för kunderna.
                </p>

                {/* Contact Details */}
                <div className="mt-6 space-y-2 text-sm text-white/80">
                  <div>
                    <span className="font-semibold">Favoritaktivitet:</span> ICA Maxi
                  </div>
                  <div>
                    <span className="font-semibold">Mobil:</span>{" "}
                    <a
                      className="underline underline-offset-4 hover:text-white transition-colors"
                      href="tel:+46701234567"
                    >
                      070-123 45 67
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Mejl:</span>{" "}
                    <a
                      className="underline underline-offset-4 hover:text-white transition-colors"
                      href="mailto:abdimajiidmohamud@gmail.com"
                    >
                      abdimajiidmohamud@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
