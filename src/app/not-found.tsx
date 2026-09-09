import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";

/**
 * Custom 404.
 *
 * Uses the shared PageHeader + Container shell so a dead link lands somewhere
 * that still looks like the site, and routes the visitor onward instead of
 * dead-ending — a default Next.js 404 leaks both the visit and the link equity.
 *
 * Rendered inside the root layout, so Nav / PreFooterCTA / Footer come for free.
 */

const destinations = [
  {
    href: "/tjanster",
    label: "Tjänster",
    desc: "Hur vi jobbar, vad det kostar och vad ni får.",
  },
  {
    href: "/case",
    label: "Case",
    desc: "Automationer vi byggt, och vad de faktiskt gav.",
  },
  {
    href: "/om-oss",
    label: "Om oss",
    desc: "Vilka vi är och varför vi bygger som vi gör.",
  },
  {
    href: "/kontakt",
    label: "Kontakt",
    desc: "Boka ett intro på 30 minuter, eller mejla oss.",
  },
];

export default function NotFound() {
  return (
    <Container>
      <main className="pt-32 pb-24">
        <PageHeader
          line1="Sidan finns"
          line2="inte här"
          intro="Länken är död, adressen felstavad, eller så har vi flyttat sidan. Inget dramatiskt — här är vägarna vidare."
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" href="/">
              Till startsidan
            </Button>
            <Button variant="secondary" href="/kontakt">
              Kontakta oss
            </Button>
          </div>
        </PageHeader>

        <nav
          aria-label="Populära sidor"
          className="mt-16 grid gap-2 sm:grid-cols-2 max-w-[900px]"
        >
          {destinations.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] px-7 py-6 no-underline transition-colors duration-200 hover:bg-[var(--color-card-bg)]"
            >
              <span className="flex items-center gap-2 text-lg font-semibold tracking-[-0.01em] text-[var(--color-text)]">
                {label}
                <span
                  aria-hidden="true"
                  className="text-[var(--color-muted)] transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
              <span className="text-base leading-[1.6] text-[var(--color-text-body)]">
                {desc}
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </Container>
  );
}
