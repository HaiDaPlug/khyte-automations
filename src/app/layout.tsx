import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khyte Automations – AI som tar hand om jobbet du inte vill göra",
  description:
    "Khyte Automations hjälper företag att hitta tids­tjuvar i vardagen och bygga smarta automationer som frigör tid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="main-wrapper">
        {children}
      </body>
    </html>
  );
}
