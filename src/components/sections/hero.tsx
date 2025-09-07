'use client';

import { useRef, Suspense, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/use-translation';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// MacBook Model Component
function MacBookModel() {
  const macbookRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/macbook_pro_2021.glb');

  useEffect(() => {
    // Set up scroll-driven rotation using GSAP
    if (macbookRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // Rotate the MacBook as user scrolls
      tl.to(macbookRef.current.rotation, {
        y: Math.PI * 2, // Full rotation
        x: Math.PI * 0.3, // Slight tilt
        z: Math.PI * 0.1, // Slight roll
        duration: 1,
        ease: 'none',
      });
    }
  }, []);

  useEffect(() => {
    if (!macbookRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Rotate MacBook
    tl.to(macbookRef.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI * 0.3,
      z: Math.PI * 0.1,
      ease: 'none',
    });

    // Move MacBook down and scale up (instead of moving the container)
    tl.to(
      macbookRef.current.position,
      {
        y: -2, // moves downward in viewport space
        ease: 'none',
      },
      0,
    ); // align with same timeline

    tl.to(
      macbookRef.current.scale,
      {
        x: 5,
        y: 5,
        z: 5, // scale up proportionally
        ease: 'none',
      },
      0,
    );
  }, []);

  return (
    <group ref={macbookRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={[3.5, 3.5, 3.5]} rotation={[0, 0, 0]} />
    </group>
  );
}

// 3D Scene Component
function Scene() {
  return (
    <>
      <Suspense fallback={null}>
        <MacBookModel />
      </Suspense>

      {/* Clean lighting setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, 0, -10]} intensity={0.3} />

      {/* Environment for realistic reflections */}
      <Environment preset='studio' />
    </>
  );
}

interface HeroSectionProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { hero: t } = useTranslation(locale);

  useGSAP(() => {
    if (!sectionRef.current || !canvasContainerRef.current) return;

    const section = sectionRef.current;
    const canvasContainer = canvasContainerRef.current;
    const title = section.querySelector('.hero-title');
    const subtitle = section.querySelector('.hero-subtitle');
    const description = section.querySelector('.hero-description');

    // Initial setup - hide text elements
    gsap.set([title, subtitle, description], {
      opacity: 0,
      y: 60,
    });

    // Entrance animation for text
    const tl = gsap.timeline({ delay: 1 });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    })
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6',
      )
      .to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6',
      );

    // Scroll-triggered text animations
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Fade out and move text as user scrolls
        gsap.to(title, {
          opacity: 1 - progress * 1.5,
          y: -100 * progress,
          duration: 0.1,
        });

        gsap.to([subtitle, description], {
          opacity: 1 - progress * 1.2,
          y: -80 * progress,
          duration: 0.1,
        });
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative h-[200vh] overflow-hidden bg-white'
    >
      {/* Fixed positioned 3D Canvas - starts centered */}
      <div
        ref={canvasContainerRef}
        className='fixed top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'
        style={{ zIndex: 20 }}
      >
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 50,
          }}
          gl={{
            antialias: true,
            alpha: true,
            shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap },
          }}
          dpr={[1, 2]}
          shadows
          className='h-full w-full'
        >
          <Scene />
        </Canvas>
      </div>

      {/* Text Content - Positioned like Chipsa */}
      <div
        className='pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-16 lg:p-20'
        style={{ zIndex: 30 }}
      >
        {/* Top section - Main headline */}
        <div className='flex flex-1 items-start pt-20'>
          <div className='max-w-2xl'>
            <h1 className='hero-title text-4xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl xl:text-7xl'>
              WE HELP COMPANIES
              <br />
              <span className='text-gray-600'>SHAPE THE FUTURE</span>
            </h1>

            <p className='hero-subtitle mt-6 max-w-lg text-lg leading-relaxed text-gray-700 md:text-xl'>
              breaking down stereotypes,
              <br />
              patterns and boundaries
              <br />
              of what is allowed
            </p>
          </div>
        </div>

        {/* Bottom section - Description */}
        <div className='flex justify-end'>
          <div className='max-w-lg text-right'>
            <p className='hero-description text-base leading-relaxed text-gray-600 md:text-lg'>
              Synthesis of aesthetic design and advanced technologies.
              <br />
              <br />
              Websites, interfaces, identity, CGI and other tasks that require
              artistic latitude, passion and burning desire for improvement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Preload the MacBook model
useGLTF.preload('/models/macbook_pro_2021.glb');
