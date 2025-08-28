'use client';

import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
}

export default function VideoBackground({
  videoSrc,
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoad = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Autoplay failed:', error);
      }
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('canplay', handleVideoLoad);

    // Try to start playing immediately
    handleVideoLoad();

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('canplay', handleVideoLoad);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      muted
      loop
      playsInline
      autoPlay
      preload='auto'
    >
      <source src={videoSrc} type='video/mp4' />
      Your browser does not support the video tag.
    </video>
  );
}
