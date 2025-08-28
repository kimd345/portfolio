'use client';

import { useEffect, useRef, useState } from 'react';

interface MaskCursorProps {
  children: React.ReactNode;
  maskSize?: number;
  className?: string;
}

export default function MaskCursor({
  children,
  maskSize = 100,
  className = '',
}: MaskCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  // Check if device supports touch (mobile/tablet)
  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;

      // Get position relative to the container
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => {
      setIsInside(true);
    };

    const handleMouseLeave = () => {
      setIsInside(false);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: isTouchDevice ? 'default' : 'none' }}
    >
      {/* Content container with both mask and cursor bubble */}
      <div className='relative z-10'>
        {/* Text content - revealed through mask */}
        <div
          style={{
            maskImage: isTouchDevice
              ? 'none' // Show content normally on mobile
              : isInside
                ? `radial-gradient(circle ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`
                : 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)',
            WebkitMaskImage: isTouchDevice
              ? 'none'
              : isInside
                ? `radial-gradient(circle ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`
                : 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)',
          }}
        >
          {children}
        </div>

        {/* HiloWave-style cursor bubble - positioned within same container */}
        {!isTouchDevice && isInside && (
          <div
            className='pointer-events-none absolute rounded-full border border-white/10 bg-white/5 shadow-lg backdrop-blur-md'
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              width: maskSize * 2,
              height: maskSize * 2,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Subtle inner glow */}
            <div className='absolute inset-1 rounded-full bg-gradient-to-br from-white/5 to-transparent' />

            {/* Glass highlight */}
            <div className='absolute top-3 left-3 h-4 w-4 rounded-full bg-white/20 blur-sm' />

            {/* Outer subtle glow */}
            <div className='absolute -inset-2 -z-10 rounded-full bg-white/5 blur-md' />
          </div>
        )}
      </div>
    </div>
  );
}
