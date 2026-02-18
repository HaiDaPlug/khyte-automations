import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Villkor",
  description:
    "Villkor för användning av Khyte Automations webbplats och bokning av introduktionsmöten.",
  alternates: {
    canonical: "/villkor",
  },
};

const UPDATED_AT = "2026-02-18";

export default function TermsPage() {
  return (
    <div>
      <Container>
        <main className="pt-32 pb-20">
          <header className="max-w-[70ch] mb-12">
            <h1 className="text-hero text-4xl md:text-6xl text-[var(--color-text)] mb-4">
              Villkor
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-5">
              Senast uppdaterad: {UPDATED_AT}
            </p>
            <p className="text-lg leading-[1.65] text-[var(--color-text-body)]">
              Kort version: Innehållet på webbplatsen är information. En
              bokning är en förfrågan om möte, inte ett bindande uppdragsavtal.
              Eventuella uppdrag regleras alltid i separat offert eller avtal.
            </p>
          </header>

          <article className="max-w-[70ch] space-y-10 text-[var(--color-text-body)] leading-[1.7]">
            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                1. Om webbplatsen
              </h2>
              <p>
                Webbplatsen beskriver våra tjänster och gör det möjligt att ta
                kontakt eller boka ett introduktionsmöte.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                2. Bokning
              </h2>
              <p>
                Bokning av möte innebär att du begär en tid. Tiden är bekräftad
                när den syns som bokad i bokningsflödet.
              </p>
              <p>
                Om du behöver avboka eller omboka, gör det gärna senast 24
                timmar innan mötet.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                3. Immateriella rättigheter
              </h2>
              <p>
                Innehåll på webbplatsen tillhör Khyte Automations om inget annat
                anges. Innehållet får inte kopieras eller spridas kommersiellt
                utan skriftligt tillstånd.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                4. Ansvarsbegränsning
              </h2>
              <p>
                Innehållet på webbplatsen tillhandahålls i informationssyfte.
                Vi strävar efter korrekt information men kan inte garantera att
                allt alltid är komplett eller felfritt.
              </p>
              <p>
                Khyte Automations ansvarar inte för indirekta skador som uppstår
                vid användning av webbplatsen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                5. Tredjepartslänkar
              </h2>
              <p>
                Webbplatsen kan innehålla länkar till externa webbplatser. Vi
                ansvarar inte för innehåll eller behandling av uppgifter på
                sådana webbplatser.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                6. Tillämplig lag
              </h2>
              <p>
                Dessa villkor regleras av svensk lag. Eventuella tvister hanteras
                av svensk domstol.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                7. Kontakt
              </h2>
              <p>
                Frågor om villkoren skickas till
                {" "}
                <a className="underline underline-offset-2" href="mailto:hai@khyteteam.com">hai@khyteteam.com</a>.
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
                Vill du boka ett samtal? Gå till kontakt →
              </Link>
            </p>
          </aside>
        </main>
      </Container>
    </div>
  );
}
