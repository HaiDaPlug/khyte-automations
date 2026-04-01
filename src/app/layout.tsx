import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  weight: ["700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  display: "swap",
  adjustFontFallback: false,
});
import Nav from "@/components/Nav";
import PreFooterCTA from "@/components/PreFooterCTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://khyteautomations.com"),

  title: {
    default: "Khyte Automations",
    template: "%s | Khyte Automations",
  },

  description:
    "Vi bygger AI-automationer som tar bort manuellt arbete, minskar fel och frigör tid - utan hype, bara fungerande workflows.",

  // Icons configuration (complements file-based detection)
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },

  // OpenGraph for social media previews
  openGraph: {
    title: "Khyte Automations | Inget onödigt skit, bara automationer som håller",
    description:
      "Vi bygger AI-automationer som tar bort manuellt arbete, minskar fel och frigör tid — utan hype, bara fungerande workflows.",
    siteName: "Khyte Automations",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "Khyte Automations",
      },
    ],
    locale: "sv_SE",
    type: "website",
  },

  // Twitter card configuration
  twitter: {
    card: "summary_large_image",
    title: "KHYTE AUTOMATIONS | No Hype, Just Workflows",
    description:
      "Vi bygger AI-automationer som tar bort manuellt arbete, minskar fel och frigör tid — utan hype, bara fungerande workflows.",
    images: ["/opengraph-image.svg"],
  },
};

// Structured Data (JSON-LD) for SEO
const SITE_URL = "https://khyteautomations.com";
const CONTACT_EMAIL = "hai@khyteteam.com";
const LINKEDIN_PERSONAL = "https://www.linkedin.com/in/hai-pham-bui-8a9893395";
const LINKEDIN_COMPANY = "https://www.linkedin.com/company/khyte-automations";
const COLOR_CONCEPT = "espresso";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Khyte Automations",
    url: SITE_URL,
    email: CONTACT_EMAIL,
    sameAs: [LINKEDIN_COMPANY],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#local`,
    name: "Khyte Automations",
    image: `${SITE_URL}/opengraph-image.svg`,
    url: SITE_URL,
    telephone: "+46700996838",
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Borås",
      addressRegion: "Västra Götaland",
      addressCountry: "SE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 57.721,
      longitude: 12.9401,
    },
    areaServed: [
      { "@type": "City", name: "Borås" },
      { "@type": "City", name: "Göteborg" },
      { "@type": "AdministrativeArea", name: "Västra Götaland" },
      { "@type": "Country", name: "Sverige" },
    ],
    priceRange: "25000-120000 SEK",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Khyte Automations",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "sv-SE",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#hai`,
    name: "Hai Pham Bui",
    url: SITE_URL,
    sameAs: [LINKEDIN_PERSONAL],
    worksFor: { "@id": `${SITE_URL}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vad kostar det?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fast pris, 25 000–120 000 kr beroende på scope. Exakt pris bestäms i en förstudie — ni vet vad det kostar innan ni bestämmer er.",
        },
      },
      {
        "@type": "Question",
        name: "Hur lång tid tar det?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Små automationer 2–3 veckor, större projekt 4–6. Tidsplan bestäms i förstudie.",
        },
      },
      {
        "@type": "Question",
        name: "Vilka system kan ni integrera?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De flesta med API — CRM, bokföring, e-post, databaser. Om det har ett API kan vi troligen koppla det.",
        },
      },
      {
        "@type": "Question",
        name: "Vem äger lösningen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ni gör. All kod, dokumentation, inloggningar. Ingen vendor lock-in.",
        },
      },
      {
        "@type": "Question",
        name: "Vad händer efter leverans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dokumentation, utbildning och en supportperiod. Ni kan drifta allt själva.",
        },
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${GeistSans.variable} ${barlow.variable}`} data-theme={COLOR_CONCEPT}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Calendly widget */}
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        />
      </head>
      <body className="main-wrapper">
        {/* Hidden SVG grain filter — referenced by body::after in globals.css */}
        <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>
        <Nav />
        <PageTransition>{children}</PageTransition>
        <div className="base-band">
          <PreFooterCTA />
          <Footer />
        </div>
      </body>
    </html>
  );
}
