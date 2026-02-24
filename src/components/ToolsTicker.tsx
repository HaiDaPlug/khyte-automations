"use client";

const LOGO_TOOLS = [
  { src: "/N8n-logo-new.svg", alt: "n8n", invert: true },
  { src: "/OpenAI_Logo.svg", alt: "OpenAI", invert: true },
  { src: "/Claude_AI_logo.svg", alt: "Claude AI", invert: true },
  { src: "/Microsoft_Office_Excel_(2025–present).svg", alt: "Microsoft Excel", invert: false },
  { src: "/Microsoft_Outlook_logo_(2024–2025).svg", alt: "Microsoft Outlook", invert: false },
  { src: "/Google_Gemini_logo_2025.svg", alt: "Google Gemini", invert: true },
  { src: "/Google_Docs_2020_Logo.svg", alt: "Google Docs", invert: false },
  { src: "/Google_Sheets_2020_Logo.svg", alt: "Google Sheets", invert: false },
  { src: "/Gmail_icon_(2020).svg", alt: "Gmail", invert: false },
];

// Computed once at module load — never recreated on re-render
const TICKER_ROW = Array.from({ length: 10 }, () => LOGO_TOOLS).flat();

export default function ToolsTicker() {
  const row = TICKER_ROW;

  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div
      className="flex items-center gap-10 md:gap-12 shrink-0"
      aria-hidden={ariaHidden}
    >
      {row.map((logo, idx) => (
        <div
          key={`${logo.alt}-${idx}`}
          className="flex items-center justify-center min-w-[72px]"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className={`h-9 md:h-12 w-auto block ${
              logo.invert
                ? "brightness-0 invert opacity-40"
                : "grayscale brightness-125 opacity-40"
            }`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="
        w-full overflow-hidden py-8
        relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen
        [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]
      "
    >
      <div
        className="
          flex w-max animate-ticker
          will-change-transform
        "
      >
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}
