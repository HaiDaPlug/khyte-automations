"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpointPx]);

  return isMobile;
}

const CALENDLY_URL = "https://calendly.com/hai-khyteteam/30min";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile(768);


  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock - only on mobile
  useEffect(() => {
    if (!open || !isMobile) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  // Escape key handler (for mobile drawer)
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);


  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  };

  return (
    <>
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[94%] md:max-w-[1150px]">
      <div className="relative flex items-center justify-between px-4 sm:px-8 py-3 rounded-full bg-[#f4f1ef]/80 backdrop-blur-md border border-[rgba(58,51,48,0.12)] shadow-lg shadow-black/10">
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
            className="h-16 w-auto -my-2 ml-3 brightness-110 contrast-125 saturate-110"
            priority
          />
        </Link>

        {/* Nav Links - Center (hidden mobile) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-base font-semibold tracking-[-0.02em]">
          <Link
            href="/cases"
            className={`transition-colors duration-200 hover:text-[#3A3330] ${
              pathname === "/cases" ? "text-[#3A3330]" : "text-[#9C8E82]"
            }`}
          >
            Case
          </Link>
          <Link
            href="/about"
            className={`transition-colors duration-200 hover:text-[#3A3330] ${
              pathname === "/about" ? "text-[#3A3330]" : "text-[#9C8E82]"
            }`}
          >
            Om oss
          </Link>

          <Link
            href="/services"
            className={`transition-colors duration-200 hover:text-[#3A3330] ${
              pathname.startsWith("/services") ? "text-[#3A3330]" : "text-[#9C8E82]"
            }`}
          >
            Tjänster
          </Link>

          <Link
            href="/contact"
            className={`transition-colors duration-200 hover:text-[#3A3330] ${
              pathname === "/contact" ? "text-[#3A3330]" : "text-[#9C8E82]"
            }`}
          >
            Kontakt
          </Link>
        </div>

        {/* CTA Button - Right (desktop only) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleCalendlyClick}
            className="bg-[#D4622B] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#C0541F] transition-all shadow-sm hover:shadow-md shrink-0 cursor-pointer whitespace-nowrap"
          >
            Boka kostnadsfritt samtal
          </button>
        </div>

        {/* Hamburger - Mobile only (JS-gated for bulletproof behavior) */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(58,51,48,0.12)] bg-[rgba(58,51,48,0.05)] hover:bg-[rgba(58,51,48,0.08)] transition w-10 h-10"
            aria-label="Öppna meny"
            aria-expanded={open}
          >
            <svg className="w-5 h-5 text-[#3A3330]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>
    </nav>

    {/* Mobile Drawer (JS-gated) */}
    {isMobile && open && (
      <>
        {/* Backdrop - button for accessibility */}
        <button
          type="button"
          aria-label="Stäng meny"
          className="fixed inset-0 bg-[rgba(58,51,48,0.40)] z-40"
          onClick={() => setOpen(false)}
        />
        {/* Panel - glass blur matching pill aesthetic */}
        <div className="fixed top-0 right-0 h-full w-72 bg-[#f4f1ef]/95 backdrop-blur-md border-l border-[rgba(58,51,48,0.12)] z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(58,51,48,0.12)]">
            <span className="text-[#3A3330] font-semibold">Meny</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 text-[#9C8E82] hover:text-[#3A3330]"
              aria-label="Stäng meny"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Links */}
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link href="/cases" className="text-[#9C8E82] hover:text-[#3A3330] text-lg" onClick={() => setOpen(false)}>Case</Link>
            <Link href="/about" className="text-[#9C8E82] hover:text-[#3A3330] text-lg" onClick={() => setOpen(false)}>Om oss</Link>

            <Link href="/services" className="text-[#9C8E82] hover:text-[#3A3330] text-lg" onClick={() => setOpen(false)}>Tjänster</Link>

            <Link href="/contact" className="text-[#9C8E82] hover:text-[#3A3330] text-lg" onClick={() => setOpen(false)}>Kontakt</Link>
          </nav>
          {/* CTA */}
          <div className="mt-auto px-6 py-6 border-t border-[rgba(58,51,48,0.12)]">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-[#D4622B] text-white font-bold py-3 rounded-full hover:bg-[#C0541F]"
            >
              Kontakta oss
            </Link>
          </div>
        </div>
      </>
    )}
    </>
  );
}
