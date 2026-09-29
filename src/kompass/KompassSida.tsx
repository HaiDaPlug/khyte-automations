import { Suspense } from "react";
import Kompass from "@/kompass/komponenter/Kompass";
import { bebas } from "@/kompass/typsnitt";
import "@/kompass/kompass.css";

type Props = {
  /** Khytes logga överst. Stäng av när sajten redan har en egen meny. */
  visaLogga?: boolean;
  /**
   * Fyll hela skärmens höjd. Fristående ja; inbäddad bland andra sektioner
   * på en sida nej.
   */
  helSkarm?: boolean;
  /**
   * Avstånd överst, t.ex. "8rem". För sajter med en meny som ligger fast
   * ovanpå sidan (khyte.se) — annars täcker menyn kompassens rubrik.
   */
  avstandTopp?: string;
  /**
   * Sökvägen som delningslänken i resultatet pekar på, t.ex. "/kompass".
   * Utan den används sidans egen adress. Behövs när kompassen visas på en
   * annan sida än den som ska delas — t.ex. i en ruta på khyte.se.
   */
  delningsSokvag?: string;
};

/**
 * Hela Automationskompassen i en komponent.
 *
 * Det här är det enda en app behöver rendera. Typsnitt, CSS och
 * Suspense-gränsen (kompassen läser ?ref= ur adressen) följer med härifrån.
 * All styling ligger under .kompass och kan inte krocka med värdappen.
 */
export default function KompassSida({
  visaLogga = true,
  helSkarm = true,
  avstandTopp,
  delningsSokvag,
}: Props) {
  return (
    <div
      className={`kompass ${bebas.variable} ${helSkarm ? "min-h-dvh" : ""}`}
      style={avstandTopp ? { paddingTop: avstandTopp } : undefined}
    >
      <Suspense fallback={null}>
        <Kompass visaLogga={visaLogga} delningsSokvag={delningsSokvag} />
      </Suspense>
    </div>
  );
}
