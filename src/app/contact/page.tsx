import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Boka ett intro eller berätta vad ni vill automatisera. Vi svarar snabbt och hjälper er hitta rätt nästa steg.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Contact() {
  return (
    <div>
      <Nav />
      <Container>
        <main className="pt-32 pb-20">
          <div className="mb-16">
            <h1 className="text-hero text-5xl md:text-7xl text-[var(--color-text)] mb-6">
              Kontakt
            </h1>
            <p className="text-xl text-[var(--color-text-body)] max-w-[60ch] leading-[1.6]">
              Låt oss prata om din automation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Formspree Form */}
            <div>
              <form
                action="https://formspree.io/f/xzznjaly"
                method="POST"
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-label mb-2"
                  >
                    Namn *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-label mb-2"
                  >
                    Företag
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-label mb-2"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-label mb-2"
                  >
                    E-post *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-label mb-2"
                  >
                    Meddelande *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <Button variant="primary" className="w-full">
                  Skicka förfrågan
                </Button>
              </form>
            </div>

            {/* Direct Contact Options */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]">
              <h2 className="text-4xl font-bold text-[var(--color-text)] mb-8 tracking-tight leading-[1.2]">
                Andra sätt att nå oss
              </h2>

              <div className="space-y-6 mb-8">
                  <div>
                    <p className="text-label mb-2">
                      E-post
                    </p>
                    <a
                      href="mailto:hai@khyteteam.com"
                      className="text-xl text-white hover:text-white/80 transition-colors underline underline-offset-2"
                    >
                      hai@khyteteam.com
                    </a>
                  </div>

                  <div>
                    <p className="text-label mb-2">
                      Telefon
                    </p>
                    <a
                      href="tel:070-099 68 38"
                      className="text-xl text-white hover:text-white/80 transition-colors underline underline-offset-2"
                    >
                      070-099 68 38
                    </a>
                  </div>

                  <div>
                    <p className="text-label mb-3">
                      Boka möte
                    </p>
                    <a
                      href="https://calendly.com/hai-khyteteam/30min"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-8 py-3 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-[4px] hover:border-[var(--color-text)] transition-colors"
                    >
                      Boka 30 min
                    </a>
                  </div>
                </div>

              <div className="pt-8 border-t border-[var(--color-border)]">
                <p className="text-base text-[var(--color-text-body)] leading-[1.5] max-w-[460px]">
                  Vi svarar vanligtvis inom 24 timmar. Berätta gärna lite om
                  vilka processer eller arbetsflöden du vill automatisera, så
                  kan vi se om det är en bra match.
                </p>
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}
