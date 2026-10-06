/**
 * Automationskompassen — modulens publika yta.
 *
 * En app använder bara tre ingångar:
 *
 *   @/kompass          KompassSida (hela kompassen) och kompassMetadata
 *   @/kompass/og       delningsbilden — egen fil, drar in next/og
 *   @/kompass/server   API:t för rutterna i app/api/kompass/
 *
 * Allt annat i src/kompass/ är internt och kan ändras fritt. Ett test vaktar
 * att appen inte börjar importera något annat härifrån.
 */

export { default as KompassSida } from "@/kompass/KompassSida";
export { kompassMetadata } from "@/kompass/metadata";
export { KOMPASS_API } from "@/kompass/konfig";
