// src/components/sections/r3f-projects-section.tsx
'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  Text,
  Environment,
  Float,
  useTexture,
  Plane,
  RoundedBox,
  Html,
  PerspectiveCamera,
  OrbitControls,
} from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale } from '@/lib/i18n';
import { ExternalLink, Github } from 'lucide-react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  name: string;
  description: { ko: string; en: string };
  tags: string[];
  image: string;
  sourceCodeLink: string;
  liveLink?: string;
  year: string;
  category: { ko: string; en: string };
  color: string;
}

// 3D Project Card Component
function ProjectCard3D({
  project,
  position,
  index,
  locale,
  isActive,
  onHover,
  onUnhover,
}: {
  project: Project;
  position: [number, number, number];
  index: number;
  locale: Locale;
  isActive: boolean;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load project image as texture
  const texture = useTexture(project.image);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;

      // Scale based on active state
      const targetScale = isActive ? 1.1 : hovered ? 1.05 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );

      // Rotation on hover
      if (hovered) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHover();
      }}
      onPointerLeave={() => {
        setHovered(false);
        onUnhover();
      }}
    >
      {/* Main card container */}
      <RoundedBox args={[2, 2.8, 0.1]} radius={0.1}>
        <meshStandardMaterial color={project.color} />
      </RoundedBox>

      {/* Project image */}
      <Plane args={[1.8, 1.2]} position={[0, 0.5, 0.06]}>
        <meshBasicMaterial map={texture} />
      </Plane>

      {/* Project info overlay */}
      <Html
        position={[0, -0.8, 0.06]}
        center
        distanceFactor={10}
        transform
        occlude
      >
        <div className='w-48 rounded-lg bg-black/80 p-4 text-center text-white backdrop-blur-sm'>
          <h3 className='mb-2 text-lg font-bold'>{project.name}</h3>
          <p className='mb-3 line-clamp-2 text-xs opacity-80'>
            {project.description[locale]}
          </p>

          {/* Tags */}
          <div className='mb-3 flex flex-wrap justify-center gap-1'>
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className='rounded bg-white/20 px-2 py-1 text-xs'>
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className='flex justify-center gap-2'>
            <a
              href={project.sourceCodeLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 rounded bg-gray-700 px-3 py-1 text-xs transition-colors hover:bg-gray-600'
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={12} />
              Code
            </a>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-xs transition-colors hover:bg-blue-700'
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} />
                Live
              </a>
            )}
          </div>
        </div>
      </Html>

      {/* Floating particles around active card */}
      {isActive && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group>
            {[...Array(8)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i / 8) * Math.PI * 2) * 2.5,
                  Math.sin((i / 8) * Math.PI * 2) * 2.5,
                  0.5,
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color={project.color} />
              </mesh>
            ))}
          </group>
        </Float>
      )}
    </group>
  );
}

// Main 3D Scene
function ProjectsScene3D({
  projects,
  locale,
  scrollProgress,
  activeIndex,
  setActiveIndex,
}: {
  projects: Project[];
  locale: Locale;
  scrollProgress: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Rotate the entire gallery based on scroll
      groupRef.current.rotation.y = scrollProgress * Math.PI * 0.5;
    }

    if (cameraRef.current) {
      // Camera movement based on scroll
      cameraRef.current.position.z = 8 - scrollProgress * 2;
      cameraRef.current.position.y = scrollProgress * 3;
    }
  });

  // Position projects in a circle
  const projectPositions = useMemo(() => {
    return projects.map((_, index) => {
      const angle = (index / projects.length) * Math.PI * 2;
      const radius = 5;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
        number,
        number,
        number,
      ];
    });
  }, [projects.length]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 8]}
        fov={75}
      />

      <group ref={groupRef}>
        {/* Center title */}
        <Text
          position={[0, 3, 0]}
          fontSize={1}
          color='#ffffff'
          anchorX='center'
          anchorY='middle'
          font='/fonts/Inter-Bold.woff'
        >
          Projects
        </Text>

        {/* Project cards in circle */}
        {projects.map((project, index) => (
          <ProjectCard3D
            key={project.id}
            project={project}
            position={projectPositions[index]}
            index={index}
            locale={locale}
            isActive={activeIndex === index}
            onHover={() => setActiveIndex(index)}
            onUnhover={() => setActiveIndex(-1)}
          />
        ))}

        {/* Environment lighting */}
        <Environment preset='studio' />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.4}
          color='#4f46e5'
        />
      </group>

      {/* Orbit controls for interaction */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate={activeIndex === -1}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

interface ProjectsSectionProps {
  locale: Locale;
}

export default function ProjectsSection({
  locale,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollProgressRef = useRef(0);

  const content = {
    ko: {
      title: 'Projects',
      subtitle: '프로젝트 갤러리',
      description: '인터랙티브 3D 환경에서 내 작품들을 살펴보세요',
    },
    en: {
      title: 'Projects',
      subtitle: 'Project Gallery',
      description: 'Explore my work in an interactive 3D environment',
    },
  };

  const projects: Project[] = [
    {
      id: 1,
      name: 'GPVC',
      description: {
        ko: '현대적인 기술과 모범 사례로 구축된 종합적인 웹 애플리케이션',
        en: 'A comprehensive web application built with modern technologies and best practices',
      },
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      image: '/images/projects/gpvc.jpg',
      sourceCodeLink: 'https://github.com/kimd345/gpvc-website/',
      liveLink: 'https://gp-vc.com',
      year: '2024',
      category: { ko: '웹 애플리케이션', en: 'Web Application' },
      color: '#4f46e5',
    },
    {
      id: 2,
      name: 'Shiboh',
      description: {
        ko: 'React Native와 Flask로 구축된 크로스 플랫폼 모바일 앱',
        en: 'A cross-platform mobile app built with React Native and Flask',
      },
      tags: ['React Native', 'Flask', 'Python', 'PostgreSQL'],
      image: '/images/projects/shibal1.gif',
      sourceCodeLink: 'https://github.com/kimd345/shibal',
      year: '2023',
      category: { ko: '모바일 앱', en: 'Mobile App' },
      color: '#059669',
    },
    // {
    //   id: 3,
    //   name: 'Portfolio v3',
    //   description: {
    //     ko: 'R3F, GSAP, Lenis를 사용한 3D 인터랙티브 포트폴리오',
    //     en: 'Interactive 3D portfolio with R3F, GSAP, and Lenis',
    //   },
    //   tags: ['R3F', 'Three.js', 'GSAP', 'Next.js'],
    //   image: '/images/projects/portfolio-3d.jpg',
    //   sourceCodeLink: 'https://github.com/kimd345/portfolio-v3',
    //   liveLink: 'https://dankim.dev',
    //   year: '2025',
    //   category: { ko: '3D 포트폴리오', en: '3D Portfolio' },
    //   color: '#dc2626',
    // },
    // {
    //   id: 4,
    //   name: 'Neural Network Viz',
    //   description: {
    //     ko: '머신러닝 모델을 3D로 시각화하는 인터랙티브 도구',
    //     en: 'Interactive tool for visualizing machine learning models in 3D',
    //   },
    //   tags: ['Three.js', 'TensorFlow.js', 'WebGL', 'D3.js'],
    //   image: '/images/projects/neural-viz.jpg',
    //   sourceCodeLink: 'https://github.com/kimd345/neural-viz',
    //   year: '2024',
    //   category: { ko: 'ML 시각화', en: 'ML Visualization' },
    //   color: '#7c3aed',
    // },
    // {
    //   id: 5,
    //   name: 'VR Gallery',
    //   description: {
    //     ko: 'WebXR을 활용한 가상현실 아트 갤러리',
    //     en: 'Virtual reality art gallery built with WebXR',
    //   },
    //   tags: ['WebXR', 'A-Frame', 'Three.js', 'VR'],
    //   image: '/images/projects/vr-gallery.jpg',
    //   sourceCodeLink: 'https://github.com/kimd345/vr-gallery',
    //   liveLink: 'https://vr-gallery.dankim.dev',
    //   year: '2024',
    //   category: { ko: 'VR 경험', en: 'VR Experience' },
    //   color: '#ea580c',
    // },
  ];

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
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    const description = section.querySelector('.section-description');
    const instructions = section.querySelector('.interaction-instructions');

    if (title) {
      gsap.fromTo(
        title.children,
        {
          opacity: 0,
          y: 100,
          rotationX: 90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
          },
        },
      );
    }

    // Fade out text as user scrolls
    tl.to(
      [title, subtitle, description],
      {
        opacity: 0.3,
        y: -50,
        duration: 1,
        ease: 'power2.inOut',
      },
      0.5,
    );

    // Instructions fade in
    if (instructions) {
      gsap.fromTo(
        instructions,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5,
          ease: 'power2.out',
        },
      );
    }
  }, [locale]);

  // Split text for character animation
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className='inline-block'>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className='relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    >
      {/* 3D Canvas */}
      <div ref={canvasRef} className='absolute inset-0'>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ProjectsScene3D
              projects={projects}
              locale={locale}
              scrollProgress={scrollProgressRef.current}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className='relative z-10 flex h-full flex-col'>
        {/* Header */}
        <div className='flex flex-1 items-center justify-center'>
          <div className='mx-auto max-w-4xl px-8 text-center text-white'>
            <p className='section-subtitle mb-4 text-sm tracking-widest text-blue-300 uppercase'>
              {t.subtitle}
            </p>

            <h2 className='section-title mb-6 text-5xl leading-none font-black md:text-7xl'>
              {splitText(t.title)}
            </h2>

            <p className='section-description mx-auto mb-8 max-w-2xl text-lg opacity-80 md:text-xl'>
              {t.description}
            </p>
          </div>
        </div>

        {/* Active Project Info */}
        {activeIndex >= 0 && (
          <div className='absolute top-4 right-4 max-w-xs rounded-lg bg-black/80 p-4 text-white backdrop-blur-sm'>
            <h3 className='mb-2 text-lg font-bold'>
              {projects[activeIndex].name}
            </h3>
            <p className='mb-3 line-clamp-3 text-sm opacity-80'>
              {projects[activeIndex].description[locale]}
            </p>
            <div className='flex gap-2'>
              <span className='rounded bg-white/20 px-2 py-1 text-xs'>
                {projects[activeIndex].year}
              </span>
              <span className='rounded bg-white/20 px-2 py-1 text-xs'>
                {projects[activeIndex].category[locale]}
              </span>
            </div>
          </div>
        )}

        {/* Interaction Instructions */}
        <div className='interaction-instructions absolute bottom-4 left-4 text-sm text-white/60'>
          <div className='mb-1 flex items-center gap-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400'></div>
            <span>Drag to rotate • Hover to explore</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
            <span>Scroll to navigate timeline</span>
          </div>
        </div>

        {/* Project Counter */}
        <div className='absolute right-4 bottom-4 text-sm text-white/60'>
          <div className='flex items-center gap-2'>
            <span>{activeIndex >= 0 ? activeIndex + 1 : '—'}</span>
            <div className='h-px w-8 bg-white/40'></div>
            <span>{projects.length}</span>
          </div>
        </div>
      </div>

      {/* Loading Fallback */}
      <Suspense
        fallback={
          <div className='absolute inset-0 flex items-center justify-center bg-slate-900'>
            <div className='text-center text-white'>
              <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-400'></div>
              <p>Loading 3D Gallery...</p>
            </div>
          </div>
        }
      />
    </section>
  );
}
