// src/components/sections/r3f-hero-section.tsx
'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Text,
  Environment,
  Float,
  MeshTransmissionMaterial,
  ContactShadows,
  PresentationControls,
  useTexture,
  Sphere,
  Torus,
  Box,
} from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale } from '@/lib/i18n';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// 3D Scene Components
function FloatingGeometry({
  position,
  geometry,
}: {
  position: [number, number, number];
  geometry: 'sphere' | 'torus' | 'box';
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const GeometryComponent = {
    sphere: () => (
      <Sphere ref={meshRef} args={[0.4, 64, 64]} position={position} />
    ),
    torus: () => (
      <Torus ref={meshRef} args={[0.3, 0.1, 32, 100]} position={position} />
    ),
    box: () => <Box ref={meshRef} args={[0.5, 0.5, 0.5]} position={position} />,
  }[geometry];

  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={2}>
      <GeometryComponent />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={3}
        chromaticAberration={0.025}
        anisotropy={0.1}
        distortion={0.1}
        distortionScale={0.1}
        temporalDistortion={0.2}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
      />
    </Float>
  );
}

function Scene3D({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      // Rotate entire scene based on scroll
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
      groupRef.current.position.y = -scrollProgress * 2;
    }

    // Camera movement based on scroll
    camera.position.z = 5 - scrollProgress * 3;
    camera.position.y = scrollProgress * 2;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Main Hero Text */}
      <Text
        position={[0, 0, 0]}
        fontSize={1.5}
        color='#ffffff'
        anchorX='center'
        anchorY='middle'
        font='/fonts/Inter-Bold.woff'
      >
        Dan Kim
      </Text>

      {/* Floating Geometries */}
      <FloatingGeometry position={[-3, 1, -2]} geometry='sphere' />
      <FloatingGeometry position={[3, -1, -1]} geometry='torus' />
      <FloatingGeometry position={[0, 2, -3]} geometry='box' />
      <FloatingGeometry position={[-2, -2, 1]} geometry='sphere' />
      <FloatingGeometry position={[2, 1.5, 0]} geometry='torus' />

      {/* Environment and Lighting */}
      <Environment preset='city' />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

// Loading fallback
function CanvasLoader() {
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-white'></div>
    </div>
  );
}

interface HeroSectionProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  const content = {
    en: {
      name: 'Dan Kim',
      subtitle: 'Creative Developer',
      description:
        'Crafting immersive digital experiences through code, design, and 3D artistry',
      roles: ['Web Developer', '3D Artist', 'Creative Technologist'],
    },
    ko: {
      name: '김동혁',
      subtitle: '크리에이티브 개발자',
      description:
        '코드, 디자인, 3D 아트를 통해 몰입형 디지털 경험을 만들어갑니다',
      roles: ['웹 개발자', '3D 아티스트', '크리에이티브 테크놀로지스트'],
    },
  };

  const t = content[locale];

  useGSAP(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // Main scroll-driven timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      },
    });

    // Text animations
    const titleChars = section.querySelectorAll('.hero-title .char');
    const subtitleWords = section.querySelectorAll('.hero-subtitle .word');
    const descriptionLines = section.querySelectorAll(
      '.hero-description .line',
    );
    const roleItems = section.querySelectorAll('.hero-roles .role');

    // Initial setup - hide elements
    gsap.set([titleChars, subtitleWords, descriptionLines, roleItems], {
      opacity: 0,
      y: 100,
    });

    // Animate in sequence
    tl.to(titleChars, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    })
      .to(
        subtitleWords,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=1',
      )
      .to(
        descriptionLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.5',
      )
      .to(
        roleItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.3',
      );

    // Scroll-out animations
    tl.to(
      [titleChars, subtitleWords],
      {
        opacity: 0.3,
        y: -50,
        scale: 0.8,
        duration: 1,
        ease: 'power2.inOut',
      },
      '+=0.5',
    ).to(
      [descriptionLines, roleItems],
      {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.8',
    );
  }, [locale]);

  // Split text into animated characters/words
  const splitText = (text: string, className: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className={`char inline-block ${className}`}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const splitWords = (text: string, className: string) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className={`word mr-2 inline-block ${className}`}>
        {word}
      </span>
    ));
  };

  const splitLines = (text: string, className: string) => {
    const words = text.split(' ');
    const midpoint = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, midpoint).join(' ');
    const secondLine = words.slice(midpoint).join(' ');

    return [
      <span key='line1' className={`line block ${className}`}>
        {firstLine}
      </span>,
      <span key='line2' className={`line block ${className}`}>
        {secondLine}
      </span>,
    ];
  };

  return (
    <section
      ref={sectionRef}
      className='relative h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    >
      {/* 3D Canvas Background */}
      <div ref={canvasRef} className='absolute inset-0'>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene3D scrollProgress={scrollProgressRef.current} />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2.5}
              far={4}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay Content */}
      <div className='relative z-10 flex h-full items-center justify-center'>
        <div className='mx-auto max-w-4xl px-8 text-center text-white'>
          {/* Main Title */}
          <h1 className='hero-title mb-6 text-6xl leading-none font-black md:text-8xl lg:text-9xl'>
            {splitText(t.name, '')}
          </h1>

          {/* Subtitle */}
          <h2 className='hero-subtitle mb-8 text-2xl font-light tracking-wide md:text-3xl lg:text-4xl'>
            {splitWords(t.subtitle, '')}
          </h2>

          {/* Description */}
          <p className='hero-description mx-auto mb-12 max-w-2xl text-lg leading-relaxed opacity-90 md:text-xl'>
            {splitLines(t.description, '')}
          </p>

          {/* Role Tags */}
          <div className='hero-roles flex flex-wrap justify-center gap-4'>
            {t.roles.map((role, index) => (
              <span
                key={role}
                className='role rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 md:text-base'
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform text-white opacity-80'>
        <div className='flex animate-bounce flex-col items-center space-y-2'>
          <span className='text-sm tracking-widest uppercase'>Explore</span>
          <div className='h-8 w-px bg-white/60' />
          <svg
            className='h-4 w-4'
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

      {/* Loading Fallback */}
      <Suspense fallback={<CanvasLoader />} />
    </section>
  );
}
