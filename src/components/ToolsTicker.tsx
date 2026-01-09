"use client";

const LOGO_TOOLS = [
  { src: "/N8n-logo-new.svg", alt: "n8n" },
  { src: "/OpenAI_Logo.svg", alt: "OpenAI" },
  { src: "/Claude_AI_logo.svg", alt: "Claude AI" },
  { src: "/Microsoft_Office_Excel_(2025–present).svg", alt: "Microsoft Excel" },
  { src: "/Microsoft_Outlook_logo_(2024–2025).svg", alt: "Microsoft Outlook" },
  { src: "/Google_Gemini_logo_2025.svg", alt: "Google Gemini" },
  { src: "/Google_Docs_2020_Logo.svg", alt: "Google Docs" },
  { src: "/Google_Sheets_2020_Logo.svg", alt: "Google Sheets" },
  { src: "/Gmail_icon_(2020).svg", alt: "Gmail" },
];

export default function ToolsTicker() {
  // Make one row long enough that the animation never "runs out" on wide screens
  const repeats = 10;
  const row = Array.from({ length: repeats }, () => LOGO_TOOLS).flat();

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
            className="h-9 md:h-12 w-auto block ticker-logo"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="
        w-full overflow-hidden border-t border-white/10 bg-white/5 py-8
        relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen
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
