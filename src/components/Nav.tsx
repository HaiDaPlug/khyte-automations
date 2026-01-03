"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-8 bg-[var(--color-bg)] z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center text-sm font-medium">
        <Link
          href="/"
          className="transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/khyte-logo.png"
            alt="Khyte"
            width={252}
            height={67}
            className="h-14 w-auto"
            priority
          />
        </Link>
        <div className="flex gap-8 tracking-[-0.02em]">
          <Link
            href="/cases"
            className={`transition-colors duration-200 hover:text-[var(--color-text)] ${
              pathname === "/cases"
                ? "text-[var(--color-text)]"
                : "text-[var(--color-muted)]"
            }`}
          >
            Case
          </Link>
          <Link
            href="/about"
            className={`transition-colors duration-200 hover:text-[var(--color-text)] ${
              pathname === "/about"
                ? "text-[var(--color-text)]"
                : "text-[var(--color-muted)]"
            }`}
          >
            Om oss
          </Link>
          <Link
            href="/contact"
            className={`transition-colors duration-200 hover:text-[var(--color-text)] ${
              pathname === "/contact"
                ? "text-[var(--color-text)]"
                : "text-[var(--color-muted)]"
            }`}
          >
            Kontakt
          </Link>
        </div>
      </div>
    </nav>
  );
}
