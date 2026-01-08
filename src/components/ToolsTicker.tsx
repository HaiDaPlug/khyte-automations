"use client";

const TOOLS = ["n8n", "OpenAI", "Anthropic", "Microsoft", "Google"];

export default function ToolsTicker() {
  // Make one row long enough that the animation never "runs out" on wide screens
  const repeats = 10;
  const row = Array.from({ length: repeats }, () => TOOLS).flat();

  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div
      className="flex items-center whitespace-nowrap shrink-0"
      aria-hidden={ariaHidden}
    >
      {row.map((tool, idx) => (
        <span key={`${tool}-${idx}`} className="flex items-center">
          <span className="text-2xl font-bold tracking-widest uppercase text-white/30 hover:text-white/80 transition-colors duration-200 cursor-default">
            {tool}
          </span>
          {/* Always render a separator to avoid "join" weirdness */}
          <span className="mx-6 text-white/15 select-none">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="
        w-full overflow-hidden border-t border-white/5 bg-white/[0.02] py-8
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
