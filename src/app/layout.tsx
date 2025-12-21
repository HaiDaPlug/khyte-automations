import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KHYTE AUTOMATIONS | No Hype, Just Workflows",
  description:
    "Jag bygger automationer som tar bort friktion i vardagen — utan hype, bara fungerande workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className={`main-wrapper ${inter.className}`}>{children}</body>
    </html>
  );
}
