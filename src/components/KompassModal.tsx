"use client";

import { useEffect, useRef, useState } from "react";
import { useKompass } from "./KompassContext";

/**
 * Automationskompassen i en ruta ovanpå sajten — öppnas från menyn och från
 * teaser-rutan på startsidan. Samma mönster som CalendlyDrawer: bakgrund,
 * scroll-lås och Escape.
 *
 * Mobil: hela skärmen. Dator: centrerad panel. Iframen skapas vid första
 * öppnandet och ligger kvar, så att besökaren kan stänga och fortsätta.
 */
export default function KompassModal() {
  const { open, src, closeKompass } = useKompass();
  const [laddad, setLaddad] = useState(false);
  const stangRef = useRef<HTMLButtonElement>(null);

  // Scroll-lås medan rutan är öppen
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Fokus in i rutan, och tillbaka till knappen som öppnade den
  useEffect(() => {
    if (!open) return;
    const tidigare = document.activeElement as HTMLElement | null;
    stangRef.current?.focus({ preventScroll: true });
    return () => tidigare?.focus({ preventScroll: true });
  }, [open]);

  // Escape — även när fokus ligger inne i kompassen (iframen har egna tangenthändelser)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeKompass();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeKompass]);

  const iframeLaddad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setLaddad(true);
    // Samma ursprung, så vi når iframens fönster. Kompassen är en enda sida —
    // lyssnaren följer med så länge iframen finns.
    e.currentTarget.contentWindow?.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") closeKompass();
    });
  };

  if (!src) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeKompass}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 210,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Panel — mobil: hela skärmen, dator: centrerad */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Automationskompassen"
        inert={!open}
        className="fixed inset-0 sm:inset-x-0 sm:top-6 sm:bottom-6 sm:mx-auto sm:w-[min(760px,calc(100vw-48px))] sm:rounded-[20px] flex flex-col overflow-hidden bg-[#F8F6F3] pb-[env(safe-area-inset-bottom,0px)] sm:pb-0"
        style={{
          zIndex: 211,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(16px)",
          visibility: open ? "visible" : "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          transition: open
            ? "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)"
            : "opacity 0.25s ease, transform 0.25s ease, visibility 0s linear 0.25s",
        }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[rgba(58,51,48,0.10)] px-5 pb-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] sm:px-6 sm:py-4">
          <div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1A120E", lineHeight: 1 }}>
              Automationskompassen
            </p>
            <p style={{ fontSize: "0.8rem", color: "#8A7D78", marginTop: "4px" }}>
              Ett par minuter · Resultatet direkt
            </p>
          </div>
          <button
            ref={stangRef}
            type="button"
            onClick={closeKompass}
            aria-label="Stäng kompassen"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(58,51,48,0.15)] text-[#5A4F4A] transition-colors hover:bg-[rgba(58,51,48,0.06)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Kompassen */}
        <div className="relative min-h-0 flex-1">
          {!laddad && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[#9C8E82]" aria-hidden="true">
              Laddar kompassen…
            </div>
          )}
          <iframe
            src={src}
            title="Automationskompassen"
            onLoad={iframeLaddad}
            className="absolute inset-0 h-full w-full border-0"
            style={{ opacity: laddad ? 1 : 0, transition: "opacity 0.3s ease" }}
          />
        </div>
      </div>
    </>
  );
}
