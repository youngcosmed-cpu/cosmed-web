import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query/query-provider';
import { LangProvider } from '@/lib/i18n/lang-provider';
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

export const metadata: Metadata = {
  title: 'Young Cosmed — Medical Aesthetic Products B2B',
  description:
    'K-Beauty B2B wholesale platform for medical aesthetic products. Fillers, skin boosters, and more from trusted Korean manufacturers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <QueryProvider>
          <LangProvider>{children}</LangProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
