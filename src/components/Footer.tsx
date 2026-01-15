import Link from "next/link";

const links = [
  { href: "/", label: "Hem" },
  { href: "/cases", label: "Case" },
  { href: "/about", label: "Om" },
  { href: "/contact", label: "Kontakt" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/70">
            <div className="font-semibold tracking-tight text-white">
              Khyte Automations
            </div>
            <div className="mt-1">No hype. Bara workflows som fungerar.</div>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/70 hover:text-white transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Khyte Automations</div>

          <div className="flex items-center gap-4">
            <a
              className="hover:text-white transition"
              href="mailto:hai@khyteteam.com"
            >
              hai@khyteteam.com
            </a>
            <a
              className="hover:text-white transition"
              href="https://www.linkedin.com/in/hai-pham-bui-8a9893395"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
