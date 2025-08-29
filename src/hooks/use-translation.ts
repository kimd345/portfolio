// src/hooks/useTranslation.ts
import { useMemo } from 'react';
import { Locale } from '@/lib/i18n';

// Define translation types
interface HeaderTranslations {
  navigation: {
    projects: string;
    journey: string;
    gallery: string;
  };
}

// Translation data
const translations: Record<Locale, { header: HeaderTranslations }> = {
  en: {
    header: {
      navigation: {
        projects: 'Projects',
        journey: 'Journey',
        gallery: 'Gallery',
      },
    },
  },
  ko: {
    header: {
      navigation: {
        projects: '프로젝트',
        journey: '여정',
        gallery: '갤러리',
      },
    },
  },
};

export function useTranslation(locale: Locale) {
  return useMemo(() => {
    const t = translations[locale];
    return {
      header: t.header,
    };
  }, [locale]);
}
