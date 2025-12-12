import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <div className="flex items-center justify-end gap-6 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">
          Hem
        </Link>
        <Link href="/cases" className="hover:text-accent transition-colors">
          Case
        </Link>
        <Link href="/contact" className="hover:text-accent transition-colors">
          Kontakt
        </Link>
      </div>
    </nav>
  );
}
