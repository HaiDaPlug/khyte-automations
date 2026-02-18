import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent mt-auto">
      <Container>
        <div className="pt-10 md:pt-12 pb-7 border-t border-[var(--color-footer-seam)]">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
            {/* Brand Column */}
            <div className="lg:w-1/3 flex flex-col items-start">
              <Link href="/" className="mb-6 block">
                <Image
                  src="/khyte-logo-text.svg"
                  alt="Khyte Automations"
                  width={270}
                  height={72}
                  className="h-16 w-auto"
                />
              </Link>

              <div className="mb-6 flex flex-col gap-3">
                <p className="text-label !text-white/95 tracking-[0.12em]">Kontakt</p>
                <a
                  href="tel:070-0996838"
                  className="text-[15px] leading-[1.35] font-medium text-white/90 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                >
                  070-099 68 38
                </a>
                <a
                  href="mailto:hai@khyteteam.com"
                  className="text-[15px] leading-[1.35] font-medium text-white/90 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                >
                  hai@khyteteam.com
                </a>
              </div>

              <a
                href="https://www.linkedin.com/company/khyte-automations"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Khyte Automations på LinkedIn"
                className="rounded-md opacity-75 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
              >
                <img
                  src="/icons/linkedin.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-7 w-7"
                />
              </a>
            </div>

            {/* Links Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-2 gap-8 sm:gap-10">
              {/* Utforska */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label !text-white/95 tracking-[0.12em]">Utforska</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/cases"
                      className="text-[15px] leading-[1.35] font-medium text-white/90 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                    >
                      Case
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Företag */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label !text-white/95 tracking-[0.12em]">Företag</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/about"
                      className="text-[15px] leading-[1.35] font-medium text-white/90 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                    >
                      Om oss
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-[15px] leading-[1.35] font-medium text-white/90 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
                    >
                      Kontakt
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 border-t border-[var(--color-footer-seam-soft)] pt-5 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:items-center sm:text-left">
            <p className="text-[13px] text-white/66 font-medium tracking-[0.01em]">
              © {currentYear} Khyte Automations. Alla rättigheter förbehållna.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
              <Link
                href="/villkor"
                className="text-[13px] leading-[1.35] font-medium text-white/78 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
              >
                Användarvillkor
              </Link>
              <Link
                href="/integritetspolicy"
                className="text-[13px] leading-[1.35] font-medium text-white/78 hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-white/35 hover:decoration-white/70 focus-visible:outline-none focus-visible:text-white focus-visible:underline"
              >
                Integritetspolicy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
