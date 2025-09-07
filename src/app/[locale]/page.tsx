// src/app/[locale]/page.tsx
import { Locale } from '@/lib/i18n';
import PortfolioExperience from '@/components/portfolio/portfolio-experience';

interface HomeProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  return <PortfolioExperience locale={locale} />;
}

// Generate static params for all locales
export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko'];
  return locales.map((locale) => ({ locale }));
}
