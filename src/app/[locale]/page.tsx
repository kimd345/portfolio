// src/app/[locale]/page.tsx
import HeroSection from '@/components/sections/hero-section';
import ProjectsSection from '@/components/sections/projects-section';
import { Locale } from '@/lib/i18n';

interface HomeProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  return (
    <div className='w-full'>
      <HeroSection locale={locale} />
      <ProjectsSection locale={locale} />
      {/* Add sections for projects, journey, gallery */}
    </div>
  );
}

// Generate static params for all locales
export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko'];
  return locales.map((locale) => ({ locale }));
}
