import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query/query-provider';
import { ToastContainer } from '@/components/ui/ToastContainer';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = process.env.SITE_URL || 'https://youngcosmed.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Young Cosmed — Medical Aesthetic Products B2B',
    template: '%s | Young Cosmed',
  },
  description:
    'K-Beauty platform for medical aesthetic products. Fillers, skin boosters, and more from trusted Korean manufacturers.',
  keywords: [
    'K-Beauty',
    'medical aesthetics',
    'fillers',
    'skin boosters',
    'Korean cosmetics',
    'Young Cosmed',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Young Cosmed',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
