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
  title: 'Shree Ganeshambika Jyotish | શ્રી ગણેશામ્બિકા જ્યોતિષ',
  description: 'Authentic Vedic Astrology Consultation & Upasana Guidance by Narendragiri Goswami Ji — Shaakta Upasak, Hanuman Upasak, Bhairava Upasak, Karna Pishachini Upasak.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu" className={`${inter.variable} ${gujarati.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FDFBF7] text-[#1C1817] antialiased">
        {children}
      </body>
    </html>
  );
}
