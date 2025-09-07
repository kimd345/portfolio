import { useMemo } from 'react';
import { Locale } from '@/lib/i18n';

const translations = {
  en: {
    header: {
      navigation: {
        projects: 'Projects',
        journey: 'Journey',
        gallery: 'Gallery',
        contact: 'Contact',
      },
    },
    hero: {
      title: 'Creative Developer',
      subtitle: 'Crafting Digital Experiences with Code & Art',
      description:
        'Bridging the gap between design and technology to create immersive, scroll-driven experiences that captivate and inspire.',
      cta: 'Explore My Work',
    },
  },
  ko: {
    header: {
      navigation: {
        projects: '프로젝트',
        journey: '여정',
        gallery: '갤러리',
        contact: '연락처',
      },
    },
    hero: {
      title: '크리에이티브 개발자',
      subtitle: '코드와 아트로 디지털 경험을 만들어가다',
      description:
        '디자인과 기술의 경계를 넘나들며 몰입감 있고 감동적인 스크롤 기반 경험을 창조합니다.',
      cta: '작품 둘러보기',
    },
  },
} as const;

export function useTranslation(locale: Locale) {
  return useMemo(() => {
    return translations[locale];
  }, [locale]);
}
