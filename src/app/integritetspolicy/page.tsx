import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Så hanterar Khyte Automations personuppgifter på webbplatsen och vid kontakt.",
  alternates: {
    canonical: "/integritetspolicy",
  },
};

const UPDATED_AT = "2026-02-18";

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Container>
        <main className="pt-32 pb-20">
          <header className="max-w-[70ch] mb-12">
            <h1 className="text-hero text-4xl md:text-6xl text-[var(--color-text)] mb-4">
              Integritetspolicy
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-5">
              Senast uppdaterad: {UPDATED_AT}
            </p>
            <p className="text-lg leading-[1.65] text-[var(--color-text-body)]">
              Kort version: Vi samlar bara in uppgifter vi behöver för att svara
              på förfrågningar, hålla möten och leverera våra tjänster. Vi säljer
              inte personuppgifter. Du kan alltid begära registerutdrag,
              rättelse eller radering.
            </p>
          </header>

          <article className="max-w-[70ch] space-y-10 text-[var(--color-text-body)] leading-[1.7]">
            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                1. Personuppgiftsansvarig
              </h2>
              <p>Khyte Automations ansvarar för behandlingen av personuppgifter.</p>
              <p>
                Kontakt: <a className="underline underline-offset-2" href="mailto:hai@khyteteam.com">hai@khyteteam.com</a>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                2. Vilka uppgifter vi samlar in
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kontaktformulär: namn, e-post, telefon (om angivet) och meddelande.</li>
                <li>Bokning: uppgifter du lämnar vid mötesbokning.</li>
                <li>
                  Webbplatsdata: teknisk användningsdata via analysverktyg (om
                  aktiverat), till exempel enhet, sidor och händelser.
                </li>
                <li>E-post: uppgifter du själv skickar till oss.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                3. Varför vi samlar in uppgifterna
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>För att svara på frågor och förfrågningar.</li>
                <li>För att planera och genomföra möten.</li>
                <li>För att förbättra webbplatsen och förstå hur den används.</li>
                <li>För säkerhet och för att förebygga missbruk.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                4. Rättslig grund
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Berättigat intresse (drift, förbättring och säkerhet).</li>
                <li>Avtal eller åtgärder inför avtal (när vi diskuterar uppdrag).</li>
                <li>Samtycke, där det krävs.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                5. Delning och tredjepartsleverantörer
              </h2>
              <p>
                Vi delar uppgifter med leverantörer som behandlar data för vår
                räkning, exempelvis för hosting, mötesbokning, e-post och
                analysverktyg (om aktiverat).
              </p>
              <p>
                Data kan i vissa fall behandlas utanför EU/EES beroende på
                leverantörernas infrastruktur och skyddsåtgärder.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                6. Lagringstid
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Förfrågningar sparas normalt i upp till 12 månader.</li>
                <li>Kundrelaterad kommunikation sparas så länge det behövs för avtal och bokföring.</li>
                <li>Analysdata sparas enligt inställningar i respektive verktyg.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                7. Dina rättigheter
              </h2>
              <p>
                Du har rätt att begära registerutdrag, rättelse, radering,
                begränsning, invändning och i vissa fall dataportabilitet.
              </p>
              <p>
                Du kan också lämna klagomål till
                Integritetsskyddsmyndigheten (IMY).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                8. Cookies
              </h2>
              <p>
                Vi använder nödvändiga cookies för att webbplatsen ska fungera.
                Om analyscookies används informerar vi om det.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                9. Ändringar
              </h2>
              <p>
                Vi kan uppdatera policyn vid behov. Datumet ovan visar senaste
                uppdatering.
              </p>
            </section>
          </article>

          <aside className="max-w-[70ch] mt-14 p-6 border border-[var(--color-border)] rounded-[8px] bg-[var(--color-card-bg)]">
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3 tracking-[-0.01em]">
              Kontakta oss
            </h2>
            <p className="text-[var(--color-text-body)] mb-2">Khyte Automations</p>
            <a
              href="mailto:hai@khyteteam.com"
              className="text-[var(--color-text)] hover:text-[var(--color-muted)] transition-colors underline underline-offset-2"
            >
              hai@khyteteam.com
            </a>
            <p className="mt-4">
              <Link
                href="/contact"
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
              >
                Behöver du hjälp? Kontakta oss →
              </Link>
            </p>
          </aside>
        </main>
      </Container>
    </div>
  );
}
