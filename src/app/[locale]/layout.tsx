// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Locale } from '@/lib/i18n';
import Header from '@/components/layout/header';
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
  title: 'Portfolio',
  description: 'Creative portfolio showcasing projects and journey',
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
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sekaiwoFont.variable} ${shillaCultureFont.variable} ${localeFontVariable} antialiased`}
      >
        <Header locale={locale} />
        <main>{children}</main>
      </body>
    </html>
  );
}

// Generate static params for all locales
export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko'];
  return locales.map((locale) => ({ locale }));
}
