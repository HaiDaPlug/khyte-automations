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
                  Khyte Automations finns för att göra arbete lättare att bära. Många företag sitter fast i manuella rutiner som "bara blev så" — klipp-och-klistra, dubbelarbete och saker som tar energi utan att skapa värde. Vi bygger automationer som tar bort friktion i vardagen så att ni får mer tid, mer fokus och färre onödiga moment. Inga stora ord. Bara lösningar som fungerar.
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
                Vi tror inte att AI löser allt. Men rätt byggt kan det ta hand om repetitiva uppgifter och göra era flöden mer stabila.
              </p>

              <p className="text-[var(--color-text)] font-medium mb-3">
                Du kan förvänta dig att vi:
              </p>

              <ul className="space-y-2 mb-6 text-[15px] leading-[1.6] text-[var(--color-muted)]">
                <li>– börjar med flödet, inte verktyget</li>
                <li>– bygger snabbt och testar i verkligheten</li>
                <li>– håller det enkelt, robust och lätt att underhålla</li>
                <li>– kommunicerar rakt och tydligt (ingen konsultdimma)</li>
                <li>– justerar tills det sitter, och lämnar något ni kan äga</li>
              </ul>

              <p className="text-[15px] leading-[1.6] text-[var(--color-muted)]">
                Målet är alltid detsamma: mindre friktion, färre fel, mer momentum.
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
                <div className="border border-[var(--color-border)] rounded-[4px] aspect-[4/5] mb-6 overflow-hidden">
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
                  Automations & Implementation
                </p>

                {/* Description */}
                <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] mb-4">
                  Jag bygger systemen, kopplar ihop verktygen och ser till att det håller i drift. Jag gillar tydlighet, tempo och att få saker att rulla utan krångel.
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
                {/* Profile placeholder */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] aspect-[4/5] mb-6"></div>

                {/* Name */}
                <h3 className="text-xl font-medium text-[var(--color-text)] mb-1">
                  Abdi
                </h3>

                {/* Role */}
                <p className="text-sm text-[var(--color-muted)] mb-4">
                  Operativt stöd & Kvalitet
                </p>

                {/* Description */}
                <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] mb-4">
                  Abdi hjälper till med struktur, kvalitet och att få lösningar att fungera i praktiken. Fokus ligger på att göra arbetet lätt att ta över och enkelt att använda.
                </p>

                {/* Contact placeholder */}
                <p className="text-[15px] text-[var(--color-muted)]">
                  (lägg till Abdis kontakt när ni vill)
                </p>
              </div>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
