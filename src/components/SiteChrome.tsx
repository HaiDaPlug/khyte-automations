"use client";

import { usePathname } from "next/navigation";
import { KOMPASS_INBADDAD } from "./KompassContext";

/**
 * Hides the marketing chrome (nav, pre-footer CTA, footer, Calendly drawer) on
 * /internal routes. Those are standalone tools, not pages of the public site —
 * a nav that links out to Case/Tjänster and a "boka samtal" CTA make no sense
 * behind basic auth.
 *
 * Also hidden on KOMPASS_INBADDAD: the compass page loaded inside the
 * KompassModal iframe, where the surrounding site already has its chrome.
 *
 * Chrome is passed in as children from the server layout rather than imported
 * here on purpose: that keeps Footer and PreFooterCTA server components instead
 * of pulling them into the client bundle.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/internal") || pathname === KOMPASS_INBADDAD) return null;
  return <>{children}</>;
}
