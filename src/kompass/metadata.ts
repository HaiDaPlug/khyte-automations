import type { Metadata } from "next";

type Alternativ = {
  /** Appens adress, t.ex. "https://kompass.khyte.se" eller "https://khyte.se". */
  bas: string;
  /** Var kompassen ligger i appen, t.ex. "/" eller "/kompass". */
  sokvag?: string;
};

const TITEL = "Var tappar du mest tid? | Khyte Automations";
const BESKRIVNING =
  "Ett par minuters snabba frågor om ert företag. Du ser direkt var tiden går — och tre konkreta sätt att få tillbaka den.";

/**
 * Metadata för sidan kompassen ligger på. Används av page.tsx i både den
 * fristående appen och på khyte.se, så att titel och delningstext alltid är
 * desamma.
 */
export function kompassMetadata({ bas, sokvag = "/" }: Alternativ): Metadata {
  return {
    metadataBase: new URL(bas),
    title: TITEL,
    description: BESKRIVNING,
    alternates: { canonical: sokvag },
    openGraph: {
      title: "Var tappar du mest tid?",
      description: BESKRIVNING,
      siteName: "Khyte Automations",
      locale: "sv_SE",
      type: "website",
      url: sokvag,
    },
    twitter: {
      card: "summary_large_image",
      title: "Var tappar du mest tid?",
      description: BESKRIVNING,
    },
    robots: { index: true, follow: true },
  };
}
