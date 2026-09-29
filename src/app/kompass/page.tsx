import { KompassSida, kompassMetadata } from "@/kompass";

// Automationskompassen. All kod ligger i src/kompass/ — se dess index.ts.
// Flyttad hit med scripts/flytta-till-sajt.mjs från khyte-kompass.
export const metadata = kompassMetadata({ bas: "https://khyte.se", sokvag: "/kompass" });

export default function KompassSidan() {
  // avstandTopp: sajtens meny ligger fast ovanpå sidan, precis som på
  // sajtens egna sidor (pt-32).
  return <KompassSida visaLogga={false} avstandTopp="8rem" />;
}
