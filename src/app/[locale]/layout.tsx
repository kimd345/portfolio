// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Locale } from '@/lib/i18n';
import Header from '@/components/layout/header';
import GSAPProvider from '@/components/providers/gsap-provider';
import { sekaiwoFont, shillaCultureFont, getLocaleFontVariable } from '@/fonts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dan Kim | 김동혁 - Portfolio',
  description:
    'Creative portfolio showcasing scroll-driven animations and innovative web experiences',
  keywords:
    'web developer, producer, artist, portfolio, GSAP, scroll animations',
  authors: [{ name: 'Dan Kim', url: 'https://dankim.dev' }],
  openGraph: {
    title: 'Dan Kim | 김동혁 - Portfolio',
    description:
      'Creative portfolio showcasing scroll-driven animations and innovative web experiences',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ko_KR',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const localeFontVariable = getLocaleFontVariable(locale);

  return (
    <html lang={locale} className='scroll-smooth'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sekaiwoFont.variable} ${shillaCultureFont.variable} ${localeFontVariable} overflow-x-hidden antialiased`}
      >
        <GSAPProvider>
          <Header locale={locale} />
          <main className='relative'>{children}</main>
        </GSAPProvider>
      </body>
    </html>
  );
}

// Generate static params for all locales
export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko'];
  return locales.map((locale) => ({ locale }));
}
