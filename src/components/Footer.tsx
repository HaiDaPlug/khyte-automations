import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent mt-auto">
      <Container>
        <div className="pt-16 md:pt-20 pb-6 border-t border-white/[0.18]">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
            {/* Brand Column */}
            <div className="lg:w-1/3 flex flex-col items-start">
              <Link href="/" className="mb-6 block">
                <Image
                  src="/khyte-logo-text.svg"
                  alt="Khyte Automations"
                  width={270}
                  height={72}
                  className="h-18 w-auto"
                />
              </Link>

              <a
                href="https://www.linkedin.com/company/khyte-automations"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Khyte Automations på LinkedIn"
                className="opacity-85 hover:opacity-100 transition-opacity"
              >
                <img
                  src="/icons/linkedin.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8"
                />
              </a>
            </div>

            {/* Links Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
              {/* Utforska */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label text-white/80">Utforska</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/cases"
                      className="text-[14px] font-medium text-white/85 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                    >
                      Case
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Företag */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label text-white/80">Företag</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/about"
                      className="text-[14px] font-medium text-white/85 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                    >
                      Om oss
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-[14px] font-medium text-white/85 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                    >
                      Kontakt
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Juridik */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label text-white/80">Juridik</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <span className="text-[14px] font-medium text-white/60">
                      Integritetspolicy{" "}
                      <span className="text-white/45">(kommer snart)</span>
                    </span>
                  </li>
                  <li>
                    <span className="text-[14px] font-medium text-white/60">
                      Villkor{" "}
                      <span className="text-white/45">(kommer snart)</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-white/[0.12] pt-6 text-center">
            <p className="text-[13px] text-white/60 font-medium">
              © {currentYear} Khyte Automations. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
