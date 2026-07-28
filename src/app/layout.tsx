import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astro-Seva | વૈદિક કુંડળી સેવા",
  description: "Get your detailed Vedic Kundli from Guruji — Astro-Seva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
