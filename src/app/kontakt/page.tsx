import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Boka ett intro (30 min) eller berätta om era arbetsflöden",
  description:
    "Boka ett 30-minuters intro eller berätta om era arbetsflöden. Vi svarar inom 24h med en första bedömning och nästa steg.",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function Contact() {
  return (
    <div className="max-w-[1200px] mx-auto px-6">

      {/* ── Top block ── */}
      <div className="pt-32 border-b border-[var(--color-border)]">
        <div
          className="grid grid-cols-1 md:grid-cols-[5fr_7fr] border-t border-[var(--color-border)]"
          style={{ minHeight: "420px" }}
        >
          {/* Left: info */}
          <div className="flex flex-col justify-between py-10 pr-10 border-b md:border-b-0">
            <div className="flex flex-col gap-10">
              <h1
                className="text-[var(--color-text)] leading-[1.0] tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                }}
              >
                Khyte Automations
              </h1>

              {/* Contact block */}
              <div className="flex flex-col gap-6">
                {/* Office */}
                <div>
                  <p className="text-[12px] tracking-[0.16em] uppercase text-[var(--color-muted)] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    Kontor
                  </p>
                  <div className="flex flex-col gap-0.5 text-base font-semibold text-[var(--color-text)]">
                    <span>Västerbrogatan 8A</span>
                    <span>503 30, Borås</span>
                  </div>
                </div>

                {/* Direct contact */}
                <div>
                  <p className="text-[12px] tracking-[0.16em] uppercase text-[var(--color-muted)] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    Kontakt
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="tel:0700996838"
                      className="text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                      style={{ textDecoration: "underline", textUnderlineOffset: "4px", textDecorationThickness: "1px", textDecorationColor: "rgba(58,51,48,0.2)" }}
                    >
                      070-099 68 38
                    </a>
                    <a
                      href="mailto:hai@khyteteam.com"
                      className="text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                      style={{ textDecoration: "underline", textUnderlineOffset: "4px", textDecorationThickness: "1px", textDecorationColor: "rgba(58,51,48,0.2)" }}
                    >
                      hai@khyteteam.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="https://www.linkedin.com/company/khyte"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                <img src="/icons/black-linkedin-icon.png" alt="" aria-hidden="true" className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Right: map */}
          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full rounded-xl overflow-hidden border border-[var(--color-border)]" style={{ height: "300px" }}>
              <iframe
                title="Khyte Automations på kartan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2131.5!2d12.9370434!3d57.7217545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465aa1f0f4aaaaab%3A0x0!2sV%C3%A4sterbrogatan+8A%2C+503+30+Bor%C3%A5s!5e0!3m2!1ssv!2sse!4v1"
                style={{ width: "100%", height: "100%", border: 0, display: "block", filter: "grayscale(1) contrast(1.1) opacity(0.9)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Team section ── */}
      <section className="pt-8 pb-24">
        <h2
          className="text-[var(--color-text)] mb-5 tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)" }}
        >
          Vi bakom Khyte
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Hai */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)]">
            <div
              className="aspect-[4/4] overflow-hidden relative"
              style={{
                background: "linear-gradient(160deg, #2C1A10 0%, #4A2010 22%, #8B3A12 48%, #C8581A 72%, #E89050 90%, #F0A868 100%)",
              }}
            >
              <Image
                src="/1.svg"
                alt="Hai Bui"
                width={1414}
                height={2000}
                className="w-full h-full object-contain object-bottom scale-[1.32] origin-bottom relative z-10"
              />
            </div>
            <div className="p-8 pt-7 relative">
              <a
                href="https://www.linkedin.com/in/hai-pham-bui-8a9893395"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hai Bui på LinkedIn"
                className="absolute bottom-8 right-8 hover:opacity-70 transition-opacity"
              >
                <img src="/icons/black-linkedin-icon.png" alt="" aria-hidden="true" className="h-6 w-6" />
              </a>
              <h3 className="text-2xl font-bold mb-1 tracking-tight leading-[1.3]" style={{ color: "#1A120E" }}>
                Hai Bui
              </h3>
              <p className="text-label mb-5" style={{ color: "var(--color-accent)" }}>
                Grundare och Automationsansvarig
              </p>
              <p className="text-base leading-[1.6] text-[var(--color-text-body)] mb-6 max-w-[460px]">
                Har grundat Khyte Automations och driver bolaget idag. Värderar ärlighet, sårbarhet och gillar att ha kul. Väldigt nyfiken och är alltid öppen för nytt.
              </p>
              <div style={{ borderTop: "1px solid rgba(58,51,48,0.10)", marginBottom: "1rem" }} />
              <div className="space-y-2 text-sm text-[var(--color-text-body)]">
                <div><span className="font-semibold" style={{ color: "var(--color-text)" }}>Favorittuggummi:</span> Melon Mint</div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text)" }}>Mobil:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-[var(--color-text)] transition-colors" href="tel:+46700996838">070-099 68 38</a>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text)" }}>Mejl:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-[var(--color-text)] transition-colors" href="mailto:hai@khyteteam.com">hai@khyteteam.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Abdi */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)]">
            <div
              className="aspect-[4/4] overflow-hidden relative"
              style={{
                background: "linear-gradient(160deg, #2C1A10 0%, #4A2010 22%, #8B3A12 48%, #C8581A 72%, #E89050 90%, #F0A868 100%)",
              }}
            >
              <Image
                src="/2.svg"
                alt="Abdimajiid Mohamud"
                width={1414}
                height={2000}
                className="w-full h-full object-contain object-bottom scale-[1.35] origin-bottom relative z-10"
              />
            </div>
            <div className="p-8 pt-7 relative">
              <a
                href="https://www.linkedin.com/in/abdimajiid-mohamud-233539329/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abdimajiid Mohamud på LinkedIn"
                className="absolute bottom-8 right-8 hover:opacity-70 transition-opacity"
              >
                <img src="/icons/black-linkedin-icon.png" alt="" aria-hidden="true" className="h-6 w-6" />
              </a>
              <h3 className="text-2xl font-bold mb-1 tracking-tight leading-[1.3]" style={{ color: "#1A120E" }}>
                Abdimajiid Mohamud
              </h3>
              <p className="text-label mb-5" style={{ color: "var(--color-accent)" }}>
                Operativt ansvarig – Säljare
              </p>
              <p className="text-base leading-[1.6] text-[var(--color-text-body)] mb-6 max-w-[460px]">
                Hjälper till som en "högra hand", och har en extremt bra känsla för lösningar. En social kille med ett stort driv och engagemang för att skapa värde för kunderna.
              </p>
              <div style={{ borderTop: "1px solid rgba(58,51,48,0.10)", marginBottom: "1rem" }} />
              <div className="space-y-2 text-sm text-[var(--color-text-body)]">
                <div><span className="font-semibold" style={{ color: "var(--color-text)" }}>Favoritaktivitet:</span> ICA Maxi</div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text)" }}>Mobil:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-[var(--color-text)] transition-colors" href="tel:+46706766952">070-676 69 52</a>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text)" }}>Mejl:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-[var(--color-text)] transition-colors" href="mailto:abdi@khyteteam.com">abdi@khyteteam.com</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
