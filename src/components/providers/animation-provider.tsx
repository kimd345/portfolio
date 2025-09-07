'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimationProviderProps {
  children: React.ReactNode;
}

export default function AnimationProvider({
  children,
}: AnimationProviderProps) {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      normalizeWheel: true,
      autoResize: true,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Set up GSAP defaults
    gsap.defaults({
      duration: 1,
      ease: 'power2.out',
    });

    // ScrollTrigger configuration
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      syncInterval: 50,
    });

    // Cleanup function
    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
