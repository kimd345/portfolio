import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Locale } from '@/lib/i18n';
import Header from '@/components/layout/header';
import AnimationProvider from '@/components/providers/animation-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Scroll Animation App',
  description: 'Next.js app with scroll-driven animations',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale} className='scroll-smooth'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
      >
        <AnimationProvider>
          <Header locale={locale} />
          <main className='relative'>{children}</main>
        </AnimationProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko'];
  return locales.map((locale) => ({ locale }));
}
