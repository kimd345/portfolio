// src/lib/i18n.ts
export const defaultLocale = 'en' as const;
export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export const getStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

// Locale display names
export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

// Helper function to get other locale
export const getOtherLocale = (currentLocale: Locale): Locale => {
  return currentLocale === 'ko' ? 'en' : 'ko';
};
