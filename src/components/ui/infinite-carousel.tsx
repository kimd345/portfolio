/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/infinite-carousel.tsx
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

interface InfiniteCarouselProps {
  items: any[];
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  className?: string;
  locale?: 'en' | 'ko';
}

// Momentum scrolling configuration
const MOMENTUM_CONFIG = {
  friction: 0.95, // Deceleration factor (higher = less friction)
  minVelocity: 0.5, // Minimum velocity to continue momentum
  velocityMultiplier: 2.5, // How much to amplify the final velocity
  maxVelocity: 3000, // Maximum pixels/second
};

export default function InfiniteCarousel({
  items,
  speed = 50,
  pauseOnHover = true,
  itemWidth = 320,
  itemHeight = 400,
  gap = 24,
  className = '',
  locale = 'en',
}: InfiniteCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0, time: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasItemActive, setHasItemActive] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isMomentumScrolling, setIsMomentumScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const momentumAnimationRef = useRef<number | null>(null);
  const velocityTrackingRef = useRef<{
    positions: { x: number; time: number }[];
    velocity: number;
  }>({ positions: [], velocity: 0 });

  useEffect(() => {
    setMounted(true);
    lastTimeRef.current = Date.now();
  }, []);

  // Calculate the exact width needed for seamless loop
  const itemTotalWidth = itemWidth + gap;
  const totalWidth = items.length * itemTotalWidth;

  // Determine if animation should be paused
  const shouldPauseAnimation =
    isDragging ||
    isMomentumScrolling ||
    (isHovered && pauseOnHover) ||
    (hasItemActive && hasUserInteracted);

  // Clear resume timeout
  const clearResumeTimeout = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  // Stop momentum animation
  const stopMomentumAnimation = useCallback(() => {
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
      momentumAnimationRef.current = null;
    }
    setIsMomentumScrolling(false);
  }, []);

  // Calculate velocity from recent positions
  const calculateVelocity = useCallback(() => {
    const positions = velocityTrackingRef.current.positions;
    if (positions.length < 2) return 0;

    // Use the last few positions to calculate velocity
    const recent = positions.slice(-3);
    const firstPos = recent[0];
    const lastPos = recent[recent.length - 1];

    const deltaX = lastPos.x - firstPos.x;
    const deltaTime = lastPos.time - firstPos.time;

    if (deltaTime === 0) return 0;

    return (deltaX / deltaTime) * 1000; // Convert to pixels per second
  }, []);

  // Momentum scrolling animation
  const animateMomentum = useCallback(
    (initialVelocity: number, startOffset: number) => {
      let velocity =
        Math.sign(initialVelocity) *
        Math.min(Math.abs(initialVelocity), MOMENTUM_CONFIG.maxVelocity);
      let currentPos = startOffset;
      let lastTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;

        // Apply friction
        velocity *= MOMENTUM_CONFIG.friction;

        // Update position
        currentPos += velocity * deltaTime;

        // Normalize position to keep it within bounds for seamless loop
        if (currentPos >= totalWidth) {
          currentPos -= totalWidth;
        } else if (currentPos < 0) {
          currentPos += totalWidth;
        }

        setCurrentOffset(currentPos);

        // Continue if velocity is above threshold
        if (Math.abs(velocity) > MOMENTUM_CONFIG.minVelocity) {
          momentumAnimationRef.current = requestAnimationFrame(animate);
        } else {
          // Momentum finished, resume normal animation
          setIsMomentumScrolling(false);
          lastTimeRef.current = Date.now();
        }
      };

      setIsMomentumScrolling(true);
      momentumAnimationRef.current = requestAnimationFrame(animate);
    },
    [totalWidth],
  );

  // Track positions for velocity calculation
  const trackPosition = useCallback((x: number) => {
    const now = Date.now();
    const positions = velocityTrackingRef.current.positions;

    // Keep only recent positions (last 100ms)
    const recentPositions = positions.filter((pos) => now - pos.time < 100);
    recentPositions.push({ x, time: now });

    // Keep max 10 positions
    if (recentPositions.length > 10) {
      recentPositions.shift();
    }

    velocityTrackingRef.current.positions = recentPositions;
  }, []);

  // Set resume timeout for mobile after item interaction
  const setResumeTimeout = useCallback(() => {
    clearResumeTimeout();
    resumeTimeoutRef.current = setTimeout(() => {
      setHasItemActive(false);
      lastTimeRef.current = Date.now();
    }, 3000);
  }, [clearResumeTimeout]);

  // Main animation loop
  useEffect(() => {
    if (shouldPauseAnimation || !mounted) return;

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentOffset((prevOffset) => {
        let newOffset = prevOffset + speed * deltaTime;

        // Create seamless infinite loop
        if (newOffset >= totalWidth) {
          newOffset = newOffset - totalWidth;
        }

        return newOffset;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldPauseAnimation, mounted, speed, totalWidth]);

  // Mouse and touch event handlers (similar to the original implementation)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;

      stopMomentumAnimation();
      setIsDragging(true);
      setHasUserInteracted(true);
      clearResumeTimeout();

      const startTime = Date.now();
      setDragStart({
        x: e.clientX,
        scrollLeft: currentOffset,
        time: startTime,
      });

      velocityTrackingRef.current = {
        positions: [{ x: e.clientX, time: startTime }],
        velocity: 0,
      };

      e.preventDefault();
    },
    [currentOffset, clearResumeTimeout, stopMomentumAnimation],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault();
      const deltaX = e.clientX - dragStart.x;
      let newOffset = dragStart.scrollLeft - deltaX;

      // Handle infinite loop during drag
      if (newOffset >= totalWidth) {
        newOffset = newOffset - totalWidth;
        setDragStart((prev) => ({
          ...prev,
          scrollLeft: prev.scrollLeft - totalWidth,
        }));
      } else if (newOffset < 0) {
        newOffset = newOffset + totalWidth;
        setDragStart((prev) => ({
          ...prev,
          scrollLeft: prev.scrollLeft + totalWidth,
        }));
      }

      setCurrentOffset(newOffset);
      trackPosition(e.clientX);
    },
    [isDragging, dragStart, totalWidth, trackPosition],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      const velocity = calculateVelocity() * MOMENTUM_CONFIG.velocityMultiplier;

      if (Math.abs(velocity) > MOMENTUM_CONFIG.minVelocity * 10) {
        animateMomentum(-velocity, currentOffset);
      } else {
        lastTimeRef.current = Date.now();
      }
    }
    setIsDragging(false);
  }, [isDragging, currentOffset, calculateVelocity, animateMomentum]);

  const handleItemClick = useCallback(
    (e: React.MouseEvent, item: any) => {
      if (Math.abs(velocityTrackingRef.current.velocity) > 50) {
        e.preventDefault();
        return;
      }

      if ('ontouchstart' in window) {
        setHasUserInteracted(true);
        setHasItemActive(true);
        setResumeTimeout();
      }
    },
    [setResumeTimeout],
  );

  // Render project card
  const renderProjectCard = (
    item: any,
    index: number,
    setIndex: number = 0,
  ) => (
    <div
      key={`${item.id}-${setIndex}-${index}`}
      className='group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl'
      style={{
        width: itemWidth,
        height: itemHeight,
        marginRight: gap,
      }}
      onDragStart={(e) => e.preventDefault()}
      onClick={(e) => handleItemClick(e, item)}
    >
      {/* Project Image */}
      {item.imagePath && (
        <div className='relative h-48 w-full overflow-hidden'>
          <Image
            src={item.imagePath}
            alt={item.title?.[locale] || item.title || 'Project'}
            fill
            className='object-cover transition-all duration-500 select-none group-hover:scale-105'
            sizes={`${itemWidth}px`}
            draggable={false}
          />
        </div>
      )}

      {/* Content */}
      <div className='flex h-52 flex-col p-6'>
        <h3 className='mb-2 line-clamp-1 text-lg font-bold text-gray-900'>
          {item.title?.[locale] || item.title || 'Project'}
        </h3>

        {item.category && (
          <p className='mb-3 text-sm font-medium text-blue-600'>
            {item.category[locale] || item.category}
          </p>
        )}

        <p className='mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600'>
          {item.description?.[locale] || item.description}
        </p>

        {/* Action Buttons */}
        <div className='mt-auto flex space-x-2'>
          {item.sourceCodeLink && (
            <a
              href={item.sourceCodeLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-1 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white transition-colors duration-200 hover:bg-gray-800'
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={14} />
              <span>Code</span>
            </a>
          )}
          {item.liveLink && (
            <a
              href={item.liveLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-1 rounded-lg bg-blue-600 px-3 py-2 text-xs text-white transition-colors duration-200 hover:bg-blue-700'
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              <span>Live</span>
            </a>
          )}
        </div>

        {/* Tags */}
        {item.platforms && (
          <div className='mt-3 border-t border-gray-100 pt-3'>
            <p className='text-xs text-gray-500'>
              {item.platforms[locale] || item.platforms}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className='flex'>
          {items
            .slice(0, 4)
            .map((item, index) => renderProjectCard(item, index))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Gradient overlays */}
      <div className='pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/80 to-transparent' />
      <div className='pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-gradient-to-l from-white via-white/80 to-transparent' />

      <div
        ref={containerRef}
        className={`cursor-grab overflow-hidden active:cursor-grabbing ${
          isDragging ? 'select-none' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        <div
          ref={trackRef}
          className='flex transition-none'
          style={{
            transform: `translateX(-${currentOffset}px)`,
            willChange: 'transform',
          }}
        >
          {/* First set */}
          {items.map((item, index) => renderProjectCard(item, index, 0))}
          {/* Second set for seamless loop */}
          {items.map((item, index) => renderProjectCard(item, index, 1))}
          {/* Third set for extra buffer during fast scrolling */}
          {items.map((item, index) => renderProjectCard(item, index, 2))}
        </div>
      </div>
    </div>
  );
}
