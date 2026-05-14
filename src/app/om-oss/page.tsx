import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "Om oss – teamet bakom Khyte Automations",
  description:
    "Möt Hai och Abdi – teamet som bygger automationer för svenska företag. Transparent process, snabb leverans, långsiktigt samarbete.",
  alternates: {
    canonical: "/om-oss",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
