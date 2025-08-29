'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  useMotionValue,
  useSpring,
  motion,
  AnimatePresence,
  type Variants,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

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
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [maskPos, setMaskPos] = useState({ x: 0, y: 0 });
  const [floatingOffset, setFloatingOffset] = useState({ x: 0, y: 0 });
  const [dynamicMaskSize, setDynamicMaskSize] = useState(maskSize);
  const [currentBubbleSize, setCurrentBubbleSize] = useState(maskSize * 2.35);
  const [isStationary, setIsStationary] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const stationaryTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check user's motion preferences
  const shouldReduceMotion = useReducedMotion();

  // Motion values for mouse position (raw input)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations following mouse with physics
  // Adjust spring config based on motion preferences
  const springConfig = shouldReduceMotion
    ? { type: 'tween' as const, duration: 0.2 }
    : {
        stiffness: 150,
        damping: 25,
        mass: 0.8,
      };

  const maskX = useSpring(mouseX, springConfig);
  const maskY = useSpring(mouseY, springConfig);

  // Advanced mask effects with transforms
  const maskVelocity = useMotionValue(0);
  const maskRadius = useTransform(
    maskVelocity,
    [0, 10],
    shouldReduceMotion ? [maskSize, maskSize] : [maskSize, maskSize * 1.4],
  );
  const maskOpacity = useTransform(maskVelocity, [0, 8, 15], [1, 0.9, 0.7]);

  // Smooth bubble size with spring animation
  const bubbleBaseSize = maskSize * 2.35;
  const targetBubbleSize = useTransform(
    maskRadius,
    (radius) => (radius / maskSize) * bubbleBaseSize,
  );
  const smoothBubbleSize = useSpring(targetBubbleSize, {
    stiffness: shouldReduceMotion ? 400 : 200,
    damping: shouldReduceMotion ? 40 : 30,
    mass: 0.8,
  });

  // Floating animation motion values
  const floatingX = useMotionValue(0);
  const floatingY = useMotionValue(0);

  // Spring-animated floating offset
  const smoothFloatingX = useSpring(floatingX, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });
  const smoothFloatingY = useSpring(floatingY, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // Subscribe to spring values and update mask position
  useEffect(() => {
    const unsubscribeX = maskX.on('change', (x) => {
      setMaskPos((prev) => {
        // Calculate velocity for advanced mask effects (throttled)
        const now = Date.now();
        if (now - lastUpdateTime.current > 16) {
          // ~60fps throttling
          const dx = x - prev.x;
          const dy = maskY.get() - prev.y;
          const velocity = Math.sqrt(dx * dx + dy * dy);
          velocityRef.current = { x: dx, y: dy };
          maskVelocity.set(Math.min(velocity * 2, 15));
          lastUpdateTime.current = now;

          // Detect stationary state for floating animation
          if (velocity < 0.1) {
            if (!stationaryTimeout.current) {
              stationaryTimeout.current = setTimeout(() => {
                setIsStationary(true);
              }, 1000); // Start floating after 1 second of being stationary
            }
          } else {
            if (stationaryTimeout.current) {
              clearTimeout(stationaryTimeout.current);
              stationaryTimeout.current = null;
            }
            setIsStationary(false);
          }
        }
        return { ...prev, x };
      });
    });

    const unsubscribeY = maskY.on('change', (y) => {
      setMaskPos((prev) => ({ ...prev, y }));
    });

    // Subscribe to dynamic mask radius and smooth bubble size changes
    const unsubscribeRadius = maskRadius.on('change', (radius) => {
      setDynamicMaskSize(radius);
    });

    const unsubscribeBubbleSize = smoothBubbleSize.on('change', (size) => {
      setCurrentBubbleSize(size);
    });

    const unsubscribeFloatingX = smoothFloatingX.on('change', (x) => {
      setFloatingOffset((prev) => ({ ...prev, x }));
    });

    const unsubscribeFloatingY = smoothFloatingY.on('change', (y) => {
      setFloatingOffset((prev) => ({ ...prev, y }));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeRadius();
      unsubscribeBubbleSize();
      unsubscribeFloatingX();
      unsubscribeFloatingY();
      // Clean up timeout
      if (stationaryTimeout.current) {
        clearTimeout(stationaryTimeout.current);
      }
    };
  }, [
    maskX,
    maskY,
    maskRadius,
    maskVelocity,
    smoothBubbleSize,
    smoothFloatingX,
    smoothFloatingY,
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update motion values - spring will handle the smooth following
        mouseX.set(x);
        mouseY.set(y);
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
  }, [mouseX, mouseY]);

  // Animation variants for bubble entrance/exit with advanced visual effects
  const bubbleVariants: Variants = {
    hidden: {
      scale: 0,
      rotate: shouldReduceMotion ? 0 : -180,
      opacity: 0,
      x: '-50%',
      y: '-50%',
      filter: 'brightness(1) saturate(1) blur(0px)',
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 0.7,
      x: '-50%',
      y: '-50%',
      filter: 'brightness(1.1) saturate(1.2) blur(0px)',
      transition: shouldReduceMotion
        ? { type: 'tween' as const, duration: 0.2, ease: 'easeOut' }
        : {
            type: 'spring' as const,
            stiffness: 300,
            damping: 20,
            duration: 0.6,
          },
    },
    floating: {
      scale: 1,
      rotate: shouldReduceMotion ? 0 : [0, 1, -1, 0],
      opacity: [0.7, 0.8, 0.7],
      x: '-50%',
      y: '-50%', // Remove y animation from here since we handle it separately
      filter: 'brightness(1.15) saturate(1.3) blur(0px)',
      transition: shouldReduceMotion
        ? { type: 'tween' as const, duration: 0.3 }
        : {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          },
    },
    exit: {
      scale: 0,
      rotate: shouldReduceMotion ? 0 : 180,
      opacity: 0,
      x: '-50%',
      y: '-50%',
      filter: 'brightness(1.3) saturate(1.5) blur(2px)',
      transition: shouldReduceMotion
        ? { type: 'tween' as const, duration: 0.15, ease: 'easeIn' }
        : {
            type: 'spring' as const,
            stiffness: 400,
            damping: 25,
            duration: 0.4,
          },
    },
  };

  // Handle floating animation
  useEffect(() => {
    if (isStationary && !shouldReduceMotion) {
      // Start floating animation
      const animateFloat = () => {
        floatingY.set(Math.sin(Date.now() / 1000) * 3); // 3px amplitude
        floatingX.set(Math.sin(Date.now() / 1500) * 1); // 1px amplitude, different frequency
      };

      const interval = setInterval(animateFloat, 16); // ~60fps

      return () => clearInterval(interval);
    } else {
      // Reset to center when not floating
      floatingX.set(0);
      floatingY.set(0);
    }
  }, [isStationary, shouldReduceMotion, floatingX, floatingY]);

  const bubbleSize = maskSize * 2.35;

  // Determine animation state based on cursor behavior
  const getCurrentVariant = () => {
    if (isStationary && !shouldReduceMotion) return 'floating';
    return 'visible';
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden select-none ${className}`}
      style={{
        cursor: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {/* Clear background layer - always visible and sharp */}
      <div
        className='absolute inset-0 z-0 select-none'
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {children}
      </div>

      {/* Blurred layer - only visible through circular mask */}
      <div
        className='relative z-10 select-none'
        style={{
          maskImage: isHovering
            ? `radial-gradient(circle ${dynamicMaskSize}px at ${maskPos.x + floatingOffset.x}px ${maskPos.y + floatingOffset.y}px, black 100%, transparent 100%)`
            : 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)',
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle ${dynamicMaskSize}px at ${maskPos.x + floatingOffset.x}px ${maskPos.y + floatingOffset.y}px, black 100%, transparent 100%)`
            : 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          opacity: maskOpacity.get(),
          filter: 'blur(4px)',
        }}
      >
        {children}
      </div>

      {/* Animated bubble cursor for visibility */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className='pointer-events-none absolute z-50'
            style={{
              left: maskPos.x + floatingOffset.x,
              top: maskPos.y + floatingOffset.y,
              width: currentBubbleSize,
              height: currentBubbleSize,
            }}
            variants={bubbleVariants}
            initial='hidden'
            animate={getCurrentVariant()}
            exit='exit'
          >
            <Image
              src='/images/bubble.png'
              alt='Cursor bubble'
              width={currentBubbleSize}
              height={currentBubbleSize}
              className={`transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              priority
              style={{
                filter:
                  'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.2))',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
