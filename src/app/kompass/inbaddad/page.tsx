import type { Metadata } from "next";
import { KompassSida } from "@/kompass";
import LankarUtUrRutan from "./LankarUtUrRutan";

// Kompassen utan sajtens meny och sidfot — laddas i en iframe av
// KompassModal (src/components/). SiteChrome döljer ramen på den här vägen.
// Delningslänken i resultatet pekar på den riktiga sidan, /kompass.
export const metadata: Metadata = {
  title: "Automationskompassen",
  robots: { index: false, follow: false },
};

export default function KompassInbaddad() {
  return (
    <>
      {/* Sajtens html-bakgrund är mörk (iOS överscroll i heron). I rutan ska
          det som syns vid överscroll vara kompassens egen bakgrund. */}
      <style>{`html{background-color:#f8f6f3}`}</style>
      <KompassSida visaLogga={false} delningsSokvag="/kompass" />
      <LankarUtUrRutan />
    </>
  );
}
