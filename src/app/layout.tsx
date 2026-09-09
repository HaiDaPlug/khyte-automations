import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  weight: ["700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  display: "swap",
  adjustFontFallback: false,
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  adjustFontFallback: false,
});

const jakartaSans = Plus_Jakarta_Sans({
  weight: ["700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
  adjustFontFallback: false,
});


import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import SiteChrome from "@/components/SiteChrome";
import PreFooterCTA from "@/components/PreFooterCTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { CalendlyProvider } from "@/components/CalendlyContext";
import CalendlyDrawer from "@/components/CalendlyDrawer";

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://khyte.se"),

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
    // og:image comes from the file-based opengraph-image.tsx convention —
    // setting `images` here would override it with a stale URL.
    locale: "sv_SE",
    type: "website",
  },

  // Twitter card configuration
  twitter: {
    card: "summary_large_image",
    title: "KHYTE AUTOMATIONS | No Hype, Just Workflows",
    description:
      "Vi bygger AI-automationer som tar bort manuellt arbete, minskar fel och frigör tid — utan hype, bara fungerande workflows.",
  },
};

// Structured Data (JSON-LD) for SEO
const SITE_URL = "https://khyte.se";
const CONTACT_EMAIL = "hai@khyte.se";
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
    image: `${SITE_URL}/opengraph-image`,
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
    priceRange: "Från 15 000 SEK",
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
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${barlow.variable} ${bebasNeue.variable} ${jakartaSans.variable}`} data-theme={COLOR_CONCEPT}>
      <head>
        {/* Logo — preload so LCP element starts fetching immediately */}
        <link rel="preload" as="image" href="/khyte-logo-text.svg" fetchPriority="high" />
        {/* Hero background — preload so browser fetches before CSS paint */}
        <link rel="preload" as="image" href="/gradients/hero-gradient-v1.webp" />
        {/* Satoshi is the primary above-fold font — load synchronously to prevent FOUT */}
        {/* preconnect api (CSS request) + cdn (font file request) so both legs of the chain are warm */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
        />
        {/* Bold italic — requested separately on purpose. Appending "700i" to the
            request above makes Fontshare return a narrower set that drops 600/800,
            and weight 800 is used by the case card titles. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700i&display=swap"
        />
        <JsonLd data={structuredData} />
        {/* Calendly script is injected on-demand in CalendlyDrawer — not loaded here */}
        {/* Ensure top-of-page on hard refresh — no scroll listener, no sessionStorage */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{history.scrollRestoration='manual';window.scrollTo(0,0);}catch(e){}})();` }} />
      </head>
      <body className="main-wrapper">
        <CalendlyProvider>
          <SiteChrome>
            <Nav />
          </SiteChrome>
          <PageTransition>{children}</PageTransition>
          <SiteChrome>
            <div className="base-band">
              <PreFooterCTA />
              <Footer />
            </div>
            <CalendlyDrawer />
          </SiteChrome>
          <Analytics />
        </CalendlyProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-F91HE9L5LS" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F91HE9L5LS');
        `}</Script>
      </body>
    </html>
  );
}
