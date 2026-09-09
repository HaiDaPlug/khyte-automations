import Container from "@/components/Container";
import Manifesto from "@/components/sections/Manifesto";
import PageHeader from "@/components/PageHeader";

export default function AboutContent() {
  return (
    <div>
      {/* ── Hero ── */}
      <Container>
        <header className="pt-32">
          <PageHeader
            divider
            oneLine
            line1="VÅR"
            line2="STORY."
            intro="Vilka vi är, vad vi står för och varför."
          />
        </header>
      </Container>

      {/* ── Section 1: Origin ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <h2
            className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Vart allt började.
          </h2>
          <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]">
            Allt tog sin början i november 2025, när Hai insåg kraften i AI och automation. Hai insåg snabbt att alla pratar om att de sysslar med AI-automatiseringar, men att själva ordet är diffust.<br />
            Med den tanken drev det honom till att starta Khyte Automations, för att hjälpa företag att implementera och använda sig av den kraften.<br />
            <span className="relative inline-block">
              Simpelt och utan onödigt strul.
              <svg
                aria-hidden="true"
                className="absolute left-0 w-full overflow-visible pointer-events-none"
                style={{ bottom: "-6px", height: "8px" }}
                preserveAspectRatio="none"
                viewBox="0 0 200 8"
              >
                <path
                  d="M0,4 C30,2 60,6 100,4 C140,2 170,5 200,4"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </p>
        </section>
      </Container>

      {/* ── Section 2: Who we are ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
            <div>
              <h2
                className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
              >
                Och vilka är vi egentligen?
              </h2>
              <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]">
               Vi är två likasinnade killar som ser samma behov. Hai hann tjuvstarta innan Abdi men fick med han på resan en månad efter. Detta var däremot inte första gången Hai och Abdi träffades. De har spelat basket ihop sen 2022, och 2024 var året de växte ihop mycket närmare. Att slå ihop våra hjärnor var något självklart och oundvikligt. Idag har vi förmånen att driva ett företag och lösa problem tillsammans.
              </p>
            </div>

            {/* Photo */}
            <div className="w-full">
              <div className="relative w-full aspect-[4/5] rounded-[4px] overflow-hidden bg-[var(--color-card-bg)] border border-[rgba(58,51,48,0.10)]">
                <img
                  src="/pics/Hai%20%26%20Abdi.jpeg"
                  className="w-full h-full object-cover"
                  alt="Hai och Abdi"
                />
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* ── Section 3: What we do ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <h2
            className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Vad vi gör.
          </h2>
          <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]">
            Vi hoppar in i företagets vardag och automatiserar återkommande arbete.<br className="hidden md:block" />
            Det kan vara en integration, rådgivning eller koda mjukvara från scratch.<br />
            Detta gör vi för att skapa mer rum för det viktiga, slippa ha allt i huvudet och kunna göra mer på mindre tid.<br className="hidden md:block" />
            Ni äger sedan lösningen efter överlämning.
          </p>
        </section>
      </Container>

      {/* ── Section 4: What we stand for ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <h2
            className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Vad står vi för och varför?
          </h2>
          <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]">
            I denna snabbt rörliga värld ska övergången vara så smidig, simpel och bra som möjligt. Vi kommer alltid vara transparenta och aldrig sälja er något som inte passar. Vårt mål är att våra lösningar ska ge tillbaka lika mycket "hårda" värden som "mjuka" — och ge tillbaka en eftermiddag i taget.
          </p>
        </section>
      </Container>

      {/* ── Manifesto close ── */}
      <Container>
        <Manifesto />
      </Container>
    </div>
  );
}
