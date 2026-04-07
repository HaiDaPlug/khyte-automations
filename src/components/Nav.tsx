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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[96%] md:max-w-[1280px] xl:max-w-[1400px]">
      <div className="relative flex items-center justify-between px-4 sm:px-8 py-3 rounded-full bg-[#0A0A0A]/72 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30">
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
            className="h-16 w-auto -my-2 ml-3"
            priority
          />
        </Link>

        {/* Nav Links - Center (hidden mobile) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-base font-semibold tracking-[-0.02em]">
          {[
            { href: "/case", label: "Case", active: pathname === "/case" },
            { href: "/om-oss", label: "Om oss", active: pathname === "/om-oss" },
            { href: "/tjanster", label: "Tjänster", active: pathname.startsWith("/tjanster") },
            { href: "/kontakt", label: "Kontakt", active: pathname === "/kontakt" },
          ].map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              className={`relative transition-colors duration-200 hover:text-white ${active ? "text-white" : "text-white/65"}`}
            >
              {label}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D4622B]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA Button - Right (desktop only) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleCalendlyClick}
            className="btn-cta text-sm font-bold px-6 py-2.5 rounded-full shrink-0 cursor-pointer whitespace-nowrap"
          >
            Boka kostnadsfritt samtal
          </button>
        </div>

        {/* Hamburger - Mobile only (JS-gated for bulletproof behavior) */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition w-10 h-10"
            aria-label="Öppna meny"
            aria-expanded={open}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
        {/* Panel - glass blur matching pill aesthetic */}
        <div className="nav-drawer fixed top-0 right-0 h-full w-72 bg-[#0A0A0A]/95 backdrop-blur-md border-l border-white/10 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-white font-semibold">Meny</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 text-white/65 hover:text-white"
              aria-label="Stäng meny"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Links */}
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link href="/case" className="text-white/70 hover:text-white text-lg" onClick={() => setOpen(false)}>Case</Link>
            <Link href="/om-oss" className="text-white/70 hover:text-white text-lg" onClick={() => setOpen(false)}>Om oss</Link>

            <Link href="/tjanster" className="text-white/70 hover:text-white text-lg" onClick={() => setOpen(false)}>Tjänster</Link>

            <Link href="/kontakt" className="text-white/70 hover:text-white text-lg" onClick={() => setOpen(false)}>Kontakt</Link>
          </nav>
          {/* CTA */}
          <div className="mt-auto px-6 py-6 border-t border-white/10">
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              className="block w-full text-center btn-cta font-bold py-3 rounded-full"
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
