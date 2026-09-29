"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCalendly } from "./CalendlyContext";
import { KOMPASS_SETT_NYCKEL, KompassIkon, markeraKompassSett, useKompass } from "./KompassContext";

/** Visas inte igen på så här många dagar efter att den stängts eller kompassen öppnats. */
const VILA_DAGAR = 7;

/** Visas när besökaren scrollat förbi heron, eller efter så här lång tid på sidan. */
const VISA_EFTER_MS = 20_000;

function nyligenSett() {
  try {
    const sett = Number(localStorage.getItem(KOMPASS_SETT_NYCKEL));
    return sett > 0 && Date.now() - sett < VILA_DAGAR * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Liten ruta i hörnet på startsidan som bjuder in till Automationskompassen.
 * Öppnar KompassModal. Stängs den hålls den borta i VILA_DAGAR.
 */
export default function KompassTeaser() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { open: kompassOppen, src, openKompass } = useKompass();
  const { open: calendlyOppen } = useCalendly();
  const [synlig, setSynlig] = useState(false);
  const [stangd, setStangd] = useState(false);

  useEffect(() => {
    if (!isHome || nyligenSett()) return;

    const visa = () => {
      stada();
      setSynlig(true);
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) visa();
    };
    const timer = window.setTimeout(visa, VISA_EFTER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    function stada() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return stada;
  }, [isHome]);

  // src sätts när kompassen öppnats — då har rutan gjort sitt, oavsett varifrån.
  if (!isHome || !synlig || stangd || src || kompassOppen || calendlyOppen) return null;

  const stang = () => {
    markeraKompassSett();
    setStangd(true);
  };

  return (
    <aside
      aria-label="Automationskompassen"
      className="kompass-teaser fixed z-30 left-4 right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] rounded-[20px] border border-white/10 p-5 sm:p-6 text-white"
      style={{
        background: "rgba(27,8,3,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      <button
        type="button"
        onClick={stang}
        aria-label="Stäng"
        className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/65 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <p className="flex items-center gap-2 pr-10 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#E8833A]">
        <KompassIkon className="w-3.5 h-3.5" />
        Automationskompassen
      </p>
      <p className="font-display mt-2 pr-10 text-[1.5rem] sm:text-[1.75rem] uppercase leading-[1.1] tracking-wide">
        Var tappar du mest tid?
      </p>
      <p className="mt-2 hidden text-sm leading-relaxed text-white/70 sm:block">
        Svara på några snabba frågor så visar vi var tiden går — och tre konkreta sätt att få tillbaka den.
      </p>
      <div className="mt-4 flex items-center gap-4 sm:mt-5">
        <button
          type="button"
          onClick={openKompass}
          className="btn-cta shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap"
        >
          <span>Starta kompassen</span>
        </button>
        <span className="text-xs text-white/50 whitespace-nowrap">Ett par minuter</span>
      </div>
    </aside>
  );
}
