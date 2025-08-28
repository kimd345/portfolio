'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
}

export default function VideoBackground({
  videoSrc,
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);
  const animationId = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateVideoPlayback();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateVideoPlayback = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      const currentTime = performance.now();
      const timeDelta = currentTime - lastTimestamp.current;

      // Calculate scroll speed (pixels per millisecond)
      const scrollSpeed = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0;

      // Check if we're in the hero section (top of page)
      const heroHeight = window.innerHeight;
      const inHeroSection = currentScrollY < heroHeight * 0.8; // 80% of viewport height

      setIsInHeroSection(inHeroSection);

      if (inHeroSection) {
        // In hero section - autoplay at normal speed
        video.playbackRate = 1;
        if (video.paused && video.readyState >= 2) {
          video.play().catch((error) => {
            console.log('Autoplay failed:', error);
          });
        }
      } else {
        // Outside hero section - control playback based on scroll
        // Video is now paused and controlled manually
        video.pause();

        // Only proceed if video has loaded enough data
        if (video.readyState < 2) return;

        // Calculate scroll-based video progression
        if (scrollDelta !== 0) {
          // Base time increment/decrement on scroll speed
          const timeIncrement = scrollSpeed * 0.05; // Adjust sensitivity here

          if (scrollDelta > 0) {
            // Scrolling down - play forward
            video.currentTime = Math.min(
              video.currentTime + timeIncrement,
              video.duration,
            );
          } else {
            // Scrolling up - play backward
            video.currentTime = Math.max(video.currentTime - timeIncrement, 0);
          }
        }

        // Adjust playback rate based on scroll speed when manually playing
        const minRate = 0.1;
        const maxRate = 3;
        const speedMultiplier = Math.min(scrollSpeed * 100, maxRate - minRate);
        const playbackRate = Math.max(minRate, minRate + speedMultiplier);
        video.playbackRate = playbackRate;
      }

      lastScrollY.current = currentScrollY;
      lastTimestamp.current = currentTime;
    };

    // Initialize
    lastScrollY.current = window.scrollY;
    lastTimestamp.current = performance.now();

    // Set up scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial setup
    updateVideoPlayback();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={`object-cover ${className}`}
      muted
      loop
      playsInline
      preload='auto'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Behind all content
        objectFit: 'cover',
      }}
    >
      <source src={videoSrc} type='video/mp4' />
      Your browser does not support the video tag.
    </video>
  );
}
