import type { Metadata } from 'next';
import { Inter, Noto_Sans_Gujarati } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const gujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-gujarati',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Astro-Seva | વૈદિક કુંડળી સેવા',
  description: 'Get your detailed Vedic Kundli from Guruji — Astro-Seva',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu" className={`${inter.variable} ${gujarati.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F6] text-[#1F1E1B] antialiased">
        {children}
      </body>
    </html>
  );
}
