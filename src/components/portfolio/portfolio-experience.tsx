// src/components/portfolio/portfolio-experience.tsx
'use client';

import dynamic from 'next/dynamic';
import { Locale } from '@/lib/i18n';
import LoadingSection from '@/components/ui/loading-section';

// Dynamic imports for 3D sections
const HeroSection3D = dynamic(
  () => import('@/components/sections/hero'),
  {
    ssr: false,
    loading: () => (
      <LoadingSection
        gradient='from-purple-900 via-blue-900 to-indigo-900'
        message='Loading 3D Experience...'
      />
    ),
  },
);

const ProjectsGallery3D = dynamic(
  () => import('@/components/sections/projects'),
  {
    ssr: false,
    loading: () => (
      <LoadingSection
        gradient='from-slate-900 via-purple-900 to-slate-900'
        message='Loading Project Gallery...'
        accentColor='border-blue-400'
      />
    ),
  },
);

const JourneyTimeline3D = dynamic(
  () => import('@/components/sections/journey'),
  {
    ssr: false,
    loading: () => (
      <LoadingSection
        gradient='from-indigo-900 via-purple-900 to-slate-900'
        message='Loading Journey Timeline...'
        accentColor='border-purple-400'
      />
    ),
  },
);

interface PortfolioExperienceProps {
  locale: Locale;
}

export default function PortfolioExperience({
  locale,
}: PortfolioExperienceProps) {
  return (
    <div className='relative'>
      {/* 3D Hero Section */}
      <HeroSection3D locale={locale} />

      {/* 3D Projects Gallery */}
      <ProjectsGallery3D locale={locale} />

      {/* 3D Journey Timeline */}
      <JourneyTimeline3D locale={locale} />
    </div>
  );
}
