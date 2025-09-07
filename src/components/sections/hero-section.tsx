'use client';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { getLocaleFontClass } from '@/fonts';

import VideoBackground from '@/components/ui/video-background';
import ScrollIndicator from '@/components/ui/scroll-indicator';
import MaskCursor from '@/components/ui/mask-cursor';

interface HeroProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
  const heroFontClass = locale === 'ko' ? 'font-hero-ko' : 'font-hero-en';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.8,
        staggerChildren: shouldReduceMotion ? 0.1 : 0.2,
        delayChildren: shouldReduceMotion ? 0.1 : 0.3,
      },
    },
  };

  const nameVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 60,
      scale: shouldReduceMotion ? 1 : 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const titlesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.15,
        delayChildren: shouldReduceMotion ? 0.2 : 0.5,
      },
    },
  };

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
          <motion.div
            className='relative z-10 flex h-full w-full'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {/* Desktop Layout */}
            <div className='hidden h-full w-full lg:flex'>
              {/* Left side - Name */}
              <div className='flex flex-1 items-center justify-center pl-8 xl:pl-16'></div>

              {/* Right side - Name and Titles */}
              <div className='flex flex-1 flex-col items-end justify-center gap-24 pr-8 xl:pr-16'>
                {/* Name */}
                <motion.div variants={nameVariants}>
                  <h1
                    className={`text-6xl leading-none font-normal text-gray-900 ${heroFontClass}`}
                    style={{
                      writingMode: 'vertical-lr',
                      textOrientation: 'upright',
                      letterSpacing: locale === 'ko' ? '0.5em' : '-0.6em',
                    }}
                  >
                    {t.name}
                  </h1>
                </motion.div>

                {/* Titles */}
                <motion.div
                  className='space-y-4 text-right'
                  variants={titlesContainerVariants}
                >
                  {t.titles.map((title, index) => (
                    <motion.div
                      key={title}
                      className='text-2xl leading-tight font-medium text-gray-900 xl:text-3xl 2xl:text-4xl'
                      variants={titleVariants}
                    >
                      {title}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className='flex h-full w-full flex-col items-center justify-center space-y-16 text-center lg:hidden'>
              {/* Name */}
              <motion.div variants={nameVariants}>
                <h1
                  className={`text-3xl leading-none font-normal text-gray-900 sm:text-4xl ${heroFontClass}`}
                  style={{
                    writingMode: 'vertical-lr',
                    textOrientation: 'upright',
                    letterSpacing: locale === 'ko' ? '0.5em' : '-0.6em',
                  }}
                >
                  {t.name}
                </h1>
              </motion.div>

              {/* Titles */}
              <motion.div
                className='space-y-4'
                variants={titlesContainerVariants}
              >
                {t.titles.map((title, index) => (
                  <motion.div
                    key={title}
                    className='text-right text-xl leading-tight font-medium text-gray-900 sm:text-2xl'
                    variants={titleVariants}
                  >
                    {title}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>
      </MaskCursor>

      <div className='absolute bottom-0 left-0 z-30 w-full'>
        <ScrollIndicator />
      </div>
    </>
  );
}
