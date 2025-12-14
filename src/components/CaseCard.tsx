interface CaseCardProps {
  problem: string;
  title: string;
  description: string;
}

export default function CaseCard({
  problem,
  title,
  description,
}: CaseCardProps) {
  return (
    <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-10 rounded-[4px] transition-colors duration-300 hover:border-[var(--color-muted)]">
      <div className="font-mono text-[13px] text-[var(--color-muted)] mb-4 bg-[rgba(255,255,255,0.05)] inline-block px-2 py-1 rounded-[4px]">
        {problem}
      </div>
      <h3 className="text-xl font-medium mb-3 text-[var(--color-text)]">
        {title}
      </h3>
      <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
        {description}
      </p>
    </div>
  );
}
