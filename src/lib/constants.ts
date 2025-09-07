export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
} as const;

export const EASE = {
  power1: 'power1.out',
  power2: 'power2.out',
  power3: 'power3.out',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
