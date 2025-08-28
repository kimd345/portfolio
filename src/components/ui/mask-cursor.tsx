'use client';

import { useEffect, useRef, useState } from 'react';

interface MaskCursorProps {
  children: React.ReactNode;
  maskSize?: number;
  className?: string;
}

export default function MaskCursor({
  children,
  maskSize = 120,
  className = '',
}: MaskCursorProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      style={{ cursor: 'none' }}
    >
      {/* Sharp background layer - only visible through circular mask */}
      <div
        className='relative z-10'
        style={{
          maskImage: isHovering
            ? `radial-gradient(circle ${maskSize}px at ${mousePos.x}px ${mousePos.y}px, black 100%, transparent 100%)`
            : 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)', // No reveal when not hovering
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle ${maskSize}px at ${mousePos.x}px ${mousePos.y}px, black 100%, transparent 100%)`
            : 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)',
        }}
      >
        {children}
      </div>

      {/* Blurred background layer - always visible */}
      <div className='absolute inset-0 z-0' style={{ filter: 'blur(4px)' }}>
        {children}
      </div>

      {/* Cursor */}
      {isHovering && (
        <div
          className='pointer-events-none absolute z-50 rounded-full border-2 border-white/50'
          style={{
            left: mousePos.x,
            top: mousePos.y,
            width: maskSize * 2,
            height: maskSize * 2,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
}
