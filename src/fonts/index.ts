// src/fonts/index.ts
import localFont from 'next/font/local';

// Sekaiwo font for English locale
export const sekaiwoFont = localFont({
  src: './sekaiwo.ttf',
  variable: '--font-sekaiwo',
  display: 'swap',
  weight: '400',
  style: 'normal',
  preload: true,
});

// Shilla Culture font for Korean locale
export const shillaCultureFont = localFont({
  src: './shilla-culture.ttf',
  variable: '--font-shilla-culture',
  display: 'swap',
  weight: '400',
  style: 'normal',
  preload: true,
});

// Helper function to get the appropriate font based on locale
export const getLocaleFont = (locale: 'en' | 'ko') => {
  return locale === 'ko' ? shillaCultureFont : sekaiwoFont;
};

// Helper function to get font class name based on locale
export const getLocaleFontClass = (locale: 'en' | 'ko') => {
  return locale === 'ko' ? shillaCultureFont.className : sekaiwoFont.className;
};

// Helper function to get font variable based on locale
export const getLocaleFontVariable = (locale: 'en' | 'ko') => {
  return locale === 'ko' ? shillaCultureFont.variable : sekaiwoFont.variable;
};
