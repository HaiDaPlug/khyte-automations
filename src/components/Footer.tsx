import Link from "next/link";
import Container from "./Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.08] mt-auto">
      <Container>
        <div className="pt-16 md:pt-20 pb-10">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
            {/* Brand Column */}
            <div className="lg:w-1/3 flex flex-col items-start">
              <Link href="/" className="mb-6 block">
                {/* TODO: Replace with <Image src="/khyte-logo.svg" ... /> */}
                <div className="h-8 w-auto text-white font-bold text-xl">[LOGO]</div>
              </Link>

              <p className="text-white/65 text-[15px] leading-relaxed font-medium max-w-[38ch]">
                AI-assistans för företag. På svenska.
                <br />
                Vi bygger automationer som frigör tid.
              </p>

              <div className="mt-6">
                <a
                  href="https://www.linkedin.com/company/khyte-automations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
              {/* Utforska */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label text-white/70">Utforska</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/cases"
                      className="text-[14px] text-white/55 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                    >
                      Case
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-[14px] text-white/55 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                    >
                      Om oss
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-[14px] text-white/55 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                    >
                      Kontakt
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Kontakt */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label text-white/70">Kontakt</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <a
                      href="mailto:hai@khyteteam.com"
                      className="text-[14px] text-white/55 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                    >
                      hai@khyteteam.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+46700996838"
                      className="text-[14px] text-white/55 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                    >
                      070-099 68 38
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-[14px] text-white/55 hover:text-white transition-colors hover:underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
                    >
                      Boka ett samtal
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Juridik */}
              <div className="flex flex-col gap-5">
                <h4 className="text-label text-white/70">Juridik</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <span className="text-[14px] text-white/40">
                      Integritetspolicy{" "}
                      <span className="text-white/25">(kommer snart)</span>
                    </span>
                  </li>
                  <li>
                    <span className="text-[14px] text-white/40">
                      Villkor{" "}
                      <span className="text-white/25">(kommer snart)</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-white/[0.08] pt-6 text-center">
            <p className="text-[13px] text-white/35 font-medium">
              © {currentYear} Khyte Automations. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
