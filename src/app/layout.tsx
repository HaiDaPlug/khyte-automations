import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://khyteautomations.com"),

  title: {
    default: "Khyte Automations",
    template: "%s | Khyte Automations",
  },

  description:
    "Vi bygger AI-automationer som tar bort manuellt arbete, minskar fel och frigör tid — utan hype, bara fungerande workflows.",

  // Icons configuration (complements file-based detection)
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  // OpenGraph for social media previews
  openGraph: {
    title: "KHYTE AUTOMATIONS | No Hype, Just Workflows",
    description:
      "Vi bygger AI-automationer som tar bort manuellt arbete, minskar fel och frigör tid — utan hype, bara fungerande workflows.",
    siteName: "Khyte Automations",
    images: [
      {
        url: "/opengraph-image.jpg",
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
    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={GeistSans.variable}>
      <body className="main-wrapper">{children}</body>
    </html>
  );
}
