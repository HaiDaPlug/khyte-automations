import { kompassOgBild, OG_ALT, OG_STORLEK } from "@/kompass/og";

// Next läser size, contentType och alt ur just den här filen — därför står de
// här och inte bara i modulen.
export const size = OG_STORLEK;
export const contentType = "image/png";
export const alt = OG_ALT;

export default function OgBild() {
  return kompassOgBild();
}
