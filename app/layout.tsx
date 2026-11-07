import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { assetPath } from '@/lib/paths';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Publixa | Official Website & Application Directory',
  description:
    'Publixa develops and operates mobile applications and digital services. Legal Entity: Prince Kumar Singh. Access verified developer information, app directory, privacy policies, and data deletion requests.',
  keywords: [
    'Publixa',
    'Prince Kumar Singh',
    'Android Developer',
    'Mobile Applications',
    'Privacy Policy',
    'Excel Reader',
    'PDF Converter',
    'publixa.store'
  ],
  authors: [{ name: 'Prince Kumar Singh (Publixa)' }],
  openGraph: {
    title: 'Publixa - Apps. Privacy. Trust.',
    description: 'Official verified developer site for Publixa applications, privacy compliance, and user trust.',
    url: 'https://publixa.store',
    siteName: 'Publixa',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: assetPath('/favicon.ico'), sizes: 'any' },
      { url: assetPath('/logo.png'), type: 'image/png' },
    ],
    shortcut: assetPath('/logo.png'),
    apple: assetPath('/logo.png'),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FFFAF6] text-[#1A0F0A] font-sans antialiased selection:bg-[#D94F1D] selection:text-white">
        <Navbar />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
