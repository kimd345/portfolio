import { Locale } from '@/lib/i18n';
import HeroSection from '@/components/sections/hero';

interface HomeProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  return (
    <div className='relative'>
      <HeroSection locale={locale} />
      {/* Add more sections here */}
    </div>
  );
}

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko'];
  return locales.map((locale) => ({ locale }));
}
