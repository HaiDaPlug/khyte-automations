"use client";

import { useEffect, useRef } from "react";
import { useCalendly } from "./CalendlyContext";

const CALENDLY_URL = "https://calendly.com/hai-khyteteam/30min";

export default function CalendlyDrawer() {
  const { open, closeCalendly } = useCalendly();
  const didInit = useRef(false);
  const scriptInjected = useRef(false);

  // Inject Calendly script on first open, then init widget once it loads
  useEffect(() => {
    if (!open) return;
    if (didInit.current) return;

    const init = () => {
      const el = document.getElementById("calendly-inline-container");
      if (!el) return;
      // @ts-expect-error — Calendly is a global injected by their script
      if (typeof window.Calendly === "undefined") return;
      // @ts-expect-error
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: el,
      });
      didInit.current = true;
    };

    // If script already loaded (e.g. drawer opened again), init directly
    if (typeof window !== "undefined" && (window as any).Calendly) {
      init();
      return;
    }

    // Inject script tag on first drawer open
    if (!scriptInjected.current) {
      scriptInjected.current = true;
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    } else {
      // Script is injecting but not ready yet — wait
      const t = setTimeout(init, 800);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Scroll lock when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCalendly(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeCalendly]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCalendly}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Boka samtal"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          background: "#FAFAF8",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(58,51,48,0.10)",
            flexShrink: 0,
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1A120E", lineHeight: 1 }}>
              Boka samtal
            </p>
            <p style={{ fontSize: "0.8rem", color: "#8A7D78", marginTop: "4px" }}>
              30 min · Utan bindningstid
            </p>
          </div>
          <button
            onClick={closeCalendly}
            aria-label="Stäng"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(58,51,48,0.15)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5A4F4A",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Calendly inline container */}
        <div
          id="calendly-inline-container"
          style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
        />
      </div>
    </>
  );
}
