import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-8 bg-[var(--color-bg)] z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center text-sm font-medium">
        <Link
          href="/"
          className="font-bold tracking-[0.05em] uppercase text-sm transition-opacity duration-200 hover:opacity-80"
        >
          Khyte
        </Link>
        <div className="flex gap-8 tracking-[-0.02em]">
          <Link
            href="/cases"
            className="text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
          >
            Case
          </Link>
          <Link
            href="/contact"
            className="text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </nav>
  );
}
