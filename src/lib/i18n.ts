export const defaultLocale = 'en' as const;
export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const getStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
};

export const getOtherLocale = (currentLocale: Locale): Locale => {
  return currentLocale === 'ko' ? 'en' : 'ko';
};
