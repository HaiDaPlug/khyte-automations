export default function Manifesto() {
  return (
    <section className="py-10 md:py-14">
      <blockquote
        className="font-sans font-bold text-[var(--color-text)] leading-[1.1] tracking-[-0.03em]"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
      >
        "Målet är alltid detsamma:{" "}
        <span style={{ color: "var(--color-accent)" }}>mindre friktion,</span>{" "}
        färre fel och mer tid för det som faktiskt{" "}
        <span style={{ color: "var(--color-accent)" }}>betyder något."</span>
      </blockquote>
    </section>
  );
}
