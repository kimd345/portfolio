import { useMemo } from 'react';
import { Locale } from '@/lib/i18n';

const translations = {
  en: {
    header: {
      navigation: {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        contact: 'Contact',
      },
    },
    hero: {
      title: 'Welcome to Our App',
      subtitle: 'Building amazing experiences with scroll animations',
      description:
        'This is a clean boilerplate for creating scroll-driven animations with Next.js, GSAP, and Lenis.',
      cta: 'Get Started',
    },
  },
  ko: {
    header: {
      navigation: {
        home: '홈',
        about: '소개',
        projects: '프로젝트',
        contact: '연락처',
      },
    },
    hero: {
      title: '우리 앱에 오신 것을 환영합니다',
      subtitle: '스크롤 애니메이션으로 놀라운 경험을 만들어보세요',
      description:
        'Next.js, GSAP, Lenis를 사용한 스크롤 기반 애니메이션을 위한 깔끔한 보일러플레이트입니다.',
      cta: '시작하기',
    },
  },
} as const;

export function useTranslation(locale: Locale) {
  return useMemo(() => {
    return translations[locale];
  }, [locale]);
}
