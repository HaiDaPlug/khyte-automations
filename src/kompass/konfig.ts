/**
 * Allt som beror på var kompassen bor — på ett ställe.
 *
 * Kompassen är en fristående modul: hela src/kompass/ kan flyttas till en
 * annan Next.js-app (t.ex. khyte.se) utan att en rad ändras. Det enda som
 * skiljer mellan apparna är de tunna filerna i src/app/ som pekar hit.
 *
 * Ändra bara här om API:t eller bilderna måste ligga någon annanstans.
 */

/** Alla API-rutter ligger under den här vägen, t.ex. /api/kompass/svar. */
export const KOMPASS_API = "/api/kompass";

/** Kompassens egna bilder ligger i public/kompass/. */
export const KOMPASS_TILLGANGAR = "/kompass";

/** Sökväg till en API-rutt: api("svar") → "/api/kompass/svar". */
export const api = (rutt: string) => `${KOMPASS_API}/${rutt}`;

/** Sökväg till en bild: tillgang("logga.png") → "/kompass/logga.png". */
export const tillgang = (fil: string) => `${KOMPASS_TILLGANGAR}/${fil}`;
