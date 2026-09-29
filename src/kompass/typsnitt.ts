import { Bebas_Neue } from "next/font/google";

/**
 * Rubrikfonten, laddad av kompassen själv — så följer den med vid en flytt.
 * Satoshi (brödtexten) laddas däremot av värdappen: khyte.se gör det redan,
 * och den fristående appen gör det i sin layout.
 *
 * Variabeln heter --k-font-bebas för att inte krocka med sajtens fonter.
 */
export const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--k-font-bebas",
  display: "swap",
});
