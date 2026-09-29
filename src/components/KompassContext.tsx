"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

/**
 * Automationskompassen som ruta ovanpå sajten.
 *
 * Kompassen själv (src/kompass/) scrollar fönstret och har fasta knappar mot
 * skärmens underkant, så den körs i en iframe mot KOMPASS_INBADDAD — där har
 * den ett eget fönster och beter sig exakt som på /kompass.
 */

/** Kompassen utan sajtens meny och sidfot. SiteChrome döljer ramen här. */
export const KOMPASS_INBADDAD = "/kompass/inbaddad";

/** Den fristående sidan — öppnar menyknappen här scrollar den bara upp. */
const KOMPASS_SIDA = "/kompass";

/** Följer med in i kompassen, så att partnerkredit och kampanjer hamnar i svaren. */
const VIDAREBEFORDRA = ["ref", "utm_source", "utm_medium", "utm_campaign"];

/** Delas med teaser-rutan: har besökaren redan öppnat kompassen visas den inte igen. */
export const KOMPASS_SETT_NYCKEL = "khyte-kompass-ruta";

export function markeraKompassSett() {
  try {
    localStorage.setItem(KOMPASS_SETT_NYCKEL, String(Date.now()));
  } catch {
    // Privat läge eller blockerad lagring — rutan kan då visas igen, inget mer.
  }
}

function kompassAdress() {
  const inne = new URLSearchParams(window.location.search);
  const ut = new URLSearchParams();
  for (const namn of VIDAREBEFORDRA) {
    const varde = inne.get(namn);
    if (varde) ut.set(namn, varde);
  }
  const fraga = ut.toString();
  return fraga ? `${KOMPASS_INBADDAD}?${fraga}` : KOMPASS_INBADDAD;
}

interface KompassContextType {
  open: boolean;
  /** Iframens adress. null tills kompassen öppnats första gången. */
  src: string | null;
  openKompass: () => void;
  closeKompass: () => void;
}

const KompassContext = createContext<KompassContextType>({
  open: false,
  src: null,
  openKompass: () => {},
  closeKompass: () => {},
});

export function KompassProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  const openKompass = useCallback(() => {
    // På den fristående sidan finns kompassen redan — en ruta ovanpå skulle
    // köra en andra kopia mot samma sparade svar.
    if (window.location.pathname === KOMPASS_SIDA) {
      window.scrollTo({ top: 0 });
      return;
    }
    markeraKompassSett();
    // Adressen sätts en gång. Iframen ligger sedan kvar när rutan stängs, så
    // ett andra öppnande fortsätter där besökaren var.
    setSrc((nu) => nu ?? kompassAdress());
    setOpen(true);
  }, []);

  const closeKompass = useCallback(() => setOpen(false), []);

  return (
    <KompassContext.Provider value={{ open, src, openKompass, closeKompass }}>
      {children}
    </KompassContext.Provider>
  );
}

export function useKompass() {
  return useContext(KompassContext);
}

/** Kompassnål — samma ikon i menyn och i teaser-rutan. */
export function KompassIkon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M15.5 8.5l-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1z" fill="currentColor" />
    </svg>
  );
}
