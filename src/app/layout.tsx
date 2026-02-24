import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Nav from "@/components/Nav";
import PreFooterCTA from "@/components/PreFooterCTA";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
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
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={GeistSans.variable} data-theme={COLOR_CONCEPT}>
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
        <SmoothScroll />
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
