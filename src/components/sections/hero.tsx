'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/use-translation';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { hero: t } = useTranslation(locale);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const title = section.querySelector('.hero-title');
    const subtitle = section.querySelector('.hero-subtitle');
    const description = section.querySelector('.hero-description');
    const cta = section.querySelector('.hero-cta');

    // Initial setup
    gsap.set([title, subtitle, description, cta], {
      opacity: 0,
      y: 50,
    });

    // Animation timeline
    const tl = gsap.timeline({
      delay: 0.5,
    });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    })
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6',
      )
      .to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6',
      )
      .to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4',
      );

    // Scroll-triggered animation
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to([title, subtitle], {
          y: -100 * progress,
          opacity: 1 - progress * 2,
          duration: 0.3,
        });
      },
    });
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id='hero'
      className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'
    >
      <div className='mx-auto max-w-4xl px-4 text-center'>
        <h1 className='hero-title mb-6 text-5xl font-bold text-gray-900 md:text-7xl'>
          {t.title}
        </h1>

        <h2 className='hero-subtitle mb-8 text-xl text-gray-600 md:text-2xl'>
          {t.subtitle}
        </h2>

        <p className='hero-description mx-auto mb-12 max-w-2xl text-lg text-gray-700 md:text-xl'>
          {t.description}
        </p>

        <div className='hero-cta'>
          <button className='rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700'>
            {t.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
