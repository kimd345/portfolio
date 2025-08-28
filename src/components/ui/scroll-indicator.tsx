'use client';

import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroHeight = window.innerHeight;

      // Hide indicator when scrolled past 20% of hero section
      setIsVisible(scrolled < heroHeight * 0.2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-8 left-1/2 z-10 -translate-x-1/2 transform'>
      <div className='flex animate-bounce flex-col items-center space-y-2'>
        <span className='text-sm font-medium tracking-wide text-white opacity-80'>
          SCROLL
        </span>
        <div className='h-8 w-px bg-white opacity-60'></div>
        <svg
          className='h-4 w-4 text-white opacity-80'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 14l-7 7m0 0l-7-7m7 7V3'
          />
        </svg>
      </div>
    </div>
  );
}
