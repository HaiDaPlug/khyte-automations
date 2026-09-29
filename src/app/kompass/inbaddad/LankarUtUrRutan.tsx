"use client";

import { useEffect } from "react";

/**
 * Kompassen länkar till integritetspolicyn och case-sidor. I rutan ska de
 * öppnas i sajtens fönster, inte inne i iframen. Ankare på samma sida
 * (#kontakt), mejl och telefon stannar kvar. Cmd/Ctrl-klick fungerar som vanligt.
 */
export default function LankarUtUrRutan() {
  useEffect(() => {
    if (window.top === window) return;

    const klick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target) return;
      const url = new URL(a.href, window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin === window.location.origin && url.pathname === window.location.pathname) return;
      e.preventDefault();
      window.top!.location.href = url.href;
    };

    document.addEventListener("click", klick);
    return () => document.removeEventListener("click", klick);
  }, []);

  return null;
}
