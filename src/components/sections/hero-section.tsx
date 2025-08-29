'use client';
import { useEffect, useRef, useState } from 'react';
import { Locale } from '@/lib/i18n';
import { getLocaleFontClass } from '@/fonts';

import VideoBackground from '@/components/ui/video-background';
import ScrollIndicator from '@/components/ui/scroll-indicator';
import MaskCursor from '@/components/ui/mask-cursor';

interface HeroProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const content = {
    en: {
      name: 'Dan Kim',
      titles: ['Web Developer', 'Producer', 'Artist'],
    },
    ko: {
      name: '김동혁',
      titles: ['Web Developer', 'Producer', 'Artist'],
    },
  };

  const t = content[locale];
  const heroFontClass = getLocaleFontClass(locale);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1 },
    );

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <section className='relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100'>
        <div className='absolute inset-0 bg-white/50'></div>
      </section>
    );
  }

  return (
    <>
      <MaskCursor className='h-full w-full' maskSize={120}>
        <section className='relative h-screen w-full overflow-hidden'>
          {/* Video Background */}
          <VideoBackground videoSrc='/videos/bottle-1.mp4' />

          {/* Hero Content */}
          {/* Content */}
          <div className='relative z-10 flex h-full w-full'>
            {/* Desktop Layout */}
            <div className='hidden h-full w-full lg:flex'>
              {/* Left side - Name */}
              <div className='flex flex-1 items-center justify-start pl-8 xl:pl-16'>
                <div className='animate-on-scroll'>
                  <h1
                    className={`text-6xl leading-none font-normal text-gray-900 xl:text-7xl 2xl:text-8xl ${heroFontClass}`}
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {t.name}
                  </h1>
                </div>
              </div>

              {/* Right side - Titles */}
              <div className='flex flex-1 items-center justify-end pr-8 xl:pr-16'>
                <div className='animate-on-scroll space-y-4 text-right'>
                  {t.titles.map((title, index) => (
                    <div
                      key={title}
                      className='text-2xl leading-tight font-medium text-gray-900 xl:text-3xl 2xl:text-4xl'
                      style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                    >
                      {title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className='flex h-full w-full flex-col items-center justify-center space-y-16 px-8 text-center lg:hidden'>
              {/* Name */}
              <div className='animate-on-scroll'>
                <h1
                  className={`text-5xl leading-none font-normal text-gray-900 sm:text-6xl ${heroFontClass}`}
                  style={{ letterSpacing: '0.1em' }}
                >
                  {t.name}
                </h1>
              </div>

              {/* Titles */}
              <div className='animate-on-scroll space-y-4'>
                {t.titles.map((title, index) => (
                  <div
                    key={title}
                    className='text-xl leading-tight font-medium text-gray-900 sm:text-2xl'
                    style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                  >
                    {title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </MaskCursor>

      <div className='absolute bottom-0 left-0 z-30 w-full'>
        <ScrollIndicator />
      </div>
    </>
  );
}
