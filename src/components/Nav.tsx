"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[92%] md:max-w-[900px]">
      <div className="flex items-center justify-between px-8 py-4 rounded-full bg-[#0A0A0A]/60 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20">
        {/* Logo - Left */}
        <Link
          href="/"
          className="transition-opacity duration-200 hover:opacity-80 shrink-0"
        >
          <Image
            src="/khyte-logo.svg"
            alt="Khyte"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Nav Links - Center (hidden mobile) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-[-0.02em]">
          <Link
            href="/cases"
            className={`transition-colors duration-200 hover:text-white ${
              pathname === "/cases" ? "text-white" : "text-white/70"
            }`}
          >
            Case
          </Link>
          <Link
            href="/about"
            className={`transition-colors duration-200 hover:text-white ${
              pathname === "/about" ? "text-white" : "text-white/70"
            }`}
          >
            Om oss
          </Link>
          <Link
            href="/contact"
            className={`transition-colors duration-200 hover:text-white ${
              pathname === "/contact" ? "text-white" : "text-white/70"
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
