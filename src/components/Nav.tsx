"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[94%] md:max-w-[1150px]">
      <div className="flex items-center justify-between px-8 py-3 rounded-full bg-[#0A0A0A]/60 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20">
        {/* Logo - Left (h-14, natural fit in taller container) */}
        <Link
          href="/"
          className="shrink-0 relative z-20 transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/khyte-logo-text.svg"
            alt="Khyte"
            width={240}
            height={64}
            className="h-16 w-auto -my-2 brightness-110 contrast-125 saturate-110"
            priority
          />
        </Link>

        {/* Nav Links - Center (hidden mobile) */}
        <div className="hidden md:flex items-center gap-8 text-base font-semibold tracking-[-0.02em]">
          <Link
            href="/cases"
            className={`transition-colors duration-200 hover:text-white ${
              pathname === "/cases" ? "text-white" : "text-white/80"
            }`}
          >
            Case
          </Link>
          <Link
            href="/about"
            className={`transition-colors duration-200 hover:text-white ${
              pathname === "/about" ? "text-white" : "text-white/80"
            }`}
          >
            Om oss
          </Link>
          <Link
            href="/contact"
            className={`transition-colors duration-200 hover:text-white ${
              pathname === "/contact" ? "text-white" : "text-white/80"
            }`}
          >
            Kontakt
          </Link>
        </div>

        {/* CTA Button - Right */}
        <Link
          href="/contact"
          className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all shadow-sm hover:shadow-md shrink-0"
        >
          Boka samtal
        </Link>
      </div>
    </nav>
  );
}
