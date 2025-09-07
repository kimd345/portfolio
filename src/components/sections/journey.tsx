// src/components/sections/r3f-journey-section.tsx
'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Text,
  Environment,
  Float,
  Sphere,
  Cylinder,
  Html,
  PerspectiveCamera,
  Trail,
  Line,
} from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale } from '@/lib/i18n';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface JourneyItem {
  id: number;
  year: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  type: 'education' | 'work' | 'project' | 'achievement';
  color: string;
  position: [number, number, number];
}

// 3D Timeline Node Component
function TimelineNode({
  item,
  isActive,
  locale,
  onHover,
  onUnhover,
}: {
  item: JourneyItem;
  isActive: boolean;
  locale: Locale;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const nodeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (nodeRef.current) {
      // Floating animation
      nodeRef.current.position.y =
        item.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;

      // Scale based on state
      const targetScale = isActive ? 1.3 : hovered ? 1.1 : 1;
      nodeRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );

      // Glow effect for active node
      if (isActive) {
        nodeRef.current.rotation.y = state.clock.elapsedTime;
      }
    }
  });

  const getNodeGeometry = () => {
    switch (item.type) {
      case 'education':
        return <Sphere args={[0.2, 16, 16]} />;
      case 'work':
        return <Cylinder args={[0.15, 0.15, 0.3, 8]} />;
      case 'project':
        return <Sphere args={[0.18, 12, 12]} />;
      case 'achievement':
        return <Sphere args={[0.25, 20, 20]} />;
      default:
        return <Sphere args={[0.2, 16, 16]} />;
    }
  };

  return (
    <group
      ref={nodeRef}
      position={item.position}
      onPointerEnter={() => {
        setHovered(true);
        onHover();
      }}
      onPointerLeave={() => {
        setHovered(false);
        onUnhover();
      }}
    >
      {/* Main node */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
        {getNodeGeometry()}
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={isActive ? 0.3 : hovered ? 0.1 : 0}
        />
      </Float>

      {/* Year label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color='#ffffff'
        anchorX='center'
        anchorY='bottom'
        font='/fonts/Inter-Bold.woff'
      >
        {item.year}
      </Text>

      {/* Info panel */}
      {(isActive || hovered) && (
        <Html
          position={[0.5, 0, 0]}
          center
          distanceFactor={6}
          transform
          occlude
        >
          <div className='w-64 rounded-lg border border-white/20 bg-black/90 p-4 text-white backdrop-blur-sm'>
            <div className='mb-2 flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-full'
                style={{ backgroundColor: item.color }}
              />
              <span className='text-xs tracking-wider uppercase opacity-60'>
                {item.type}
              </span>
            </div>

            <h3 className='mb-2 text-lg leading-tight font-bold'>
              {item.title[locale]}
            </h3>

            <p className='text-sm leading-relaxed opacity-80'>
              {item.description[locale]}
            </p>

            <div className='mt-3 border-t border-white/20 pt-3'>
              <span className='text-sm font-semibold text-blue-300'>
                {item.year}
              </span>
            </div>
          </div>
        </Html>
      )}

      {/* Particle effect for active node */}
      {isActive && (
        <group>
          {[...Array(12)].map((_, i) => (
            <Float key={i} speed={2} rotationIntensity={0} floatIntensity={2}>
              <mesh
                position={[
                  Math.cos((i / 12) * Math.PI * 2) * 0.8,
                  Math.sin((i / 12) * Math.PI * 2) * 0.8,
                  0,
                ]}
              >
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color={item.color} />
              </mesh>
            </Float>
          ))}
        </group>
      )}
    </group>
  );
}

// Timeline Path Component
function TimelinePath({ items }: { items: JourneyItem[] }) {
  const pathPoints = useMemo(() => {
    return items.map((item) => new THREE.Vector3(...item.position));
  }, [items]);

  return (
    <Line points={pathPoints} color='#4f46e5' lineWidth={3} dashed={false} />
  );
}

// Main 3D Journey Scene
function JourneyScene3D({
  items,
  locale,
  scrollProgress,
  activeIndex,
  setActiveIndex,
}: {
  items: JourneyItem[];
  locale: Locale;
  scrollProgress: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (groupRef.current && cameraRef.current) {
      // Move camera along the timeline based on scroll
      const progress = scrollProgress;
      const totalLength = items.length - 1;
      const currentPosition = progress * totalLength;

      // Interpolate camera position along the timeline
      if (items.length > 1) {
        const index = Math.floor(currentPosition);
        const t = currentPosition - index;

        const currentItem = items[Math.min(index, items.length - 1)];
        const nextItem = items[Math.min(index + 1, items.length - 1)];

        const targetX = THREE.MathUtils.lerp(
          currentItem.position[0],
          nextItem.position[0],
          t,
        );
        const targetZ =
          THREE.MathUtils.lerp(
            currentItem.position[2],
            nextItem.position[2],
            t,
          ) + 3;

        cameraRef.current.position.x = THREE.MathUtils.lerp(
          cameraRef.current.position.x,
          targetX,
          0.05,
        );
        cameraRef.current.position.z = THREE.MathUtils.lerp(
          cameraRef.current.position.z,
          targetZ,
          0.05,
        );
        cameraRef.current.position.y = 2;

        // Look at the current timeline section
        cameraRef.current.lookAt(targetX, 0, currentItem.position[2]);
      }
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, 3]}
        fov={75}
      />

      <group ref={groupRef}>
        {/* Timeline path */}
        <TimelinePath items={items} />

        {/* Timeline nodes */}
        {items.map((item, index) => (
          <TimelineNode
            key={item.id}
            item={item}
            isActive={activeIndex === index}
            locale={locale}
            onHover={() => setActiveIndex(index)}
            onUnhover={() => setActiveIndex(-1)}
          />
        ))}

        {/* Environment and lighting */}
        <Environment preset='night' />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, 5, -10]} intensity={0.4} color='#4f46e5' />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color='#1e1b4b'
            transparent
            opacity={0.3}
            roughness={0.8}
          />
        </mesh>
      </group>
    </>
  );
}

interface JourneySectionProps {
  locale: Locale;
}

export default function JourneySection({ locale }: JourneySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollProgressRef = useRef(0);

  const content = {
    ko: {
      title: 'Journey',
      subtitle: '나의 여정',
      description: '시간을 따라 흘러온 나의 성장과 경험들',
    },
    en: {
      title: 'Journey',
      subtitle: 'My Journey',
      description: 'Growth and experiences flowing through time',
    },
  };

  const journeyItems: JourneyItem[] = [
    {
      id: 1,
      year: '2018',
      title: {
        ko: '컴퓨터과학 학사',
        en: 'B.S. Computer Science',
      },
      description: {
        ko: '알고리즘과 데이터 구조, 소프트웨어 엔지니어링의 기초를 학습했습니다.',
        en: 'Learned fundamentals of algorithms, data structures, and software engineering.',
      },
      type: 'education',
      color: '#3b82f6',
      position: [0, 0, 0],
    },
    {
      id: 2,
      year: '2019',
      title: {
        ko: '첫 번째 인턴십',
        en: 'First Internship',
      },
      description: {
        ko: '스타트업에서 풀스택 개발자로 실무 경험을 쌓았습니다.',
        en: 'Gained hands-on experience as a full-stack developer at a startup.',
      },
      type: 'work',
      color: '#10b981',
      position: [2, 0.2, -2],
    },
    {
      id: 3,
      year: '2020',
      title: {
        ko: '첫 번째 프로젝트',
        en: 'First Major Project',
      },
      description: {
        ko: 'React와 Node.js로 완성한 첫 번째 풀스택 웹 애플리케이션입니다.',
        en: 'First full-stack web application built with React and Node.js.',
      },
      type: 'project',
      color: '#f59e0b',
      position: [1, -0.1, -4],
    },
    {
      id: 4,
      year: '2021',
      title: {
        ko: '프론트엔드 개발자',
        en: 'Frontend Developer',
      },
      description: {
        ko: '테크 회사에서 사용자 경험과 인터페이스 디자인에 집중했습니다.',
        en: 'Focused on user experience and interface design at a tech company.',
      },
      type: 'work',
      color: '#8b5cf6',
      position: [-1, 0.3, -6],
    },
    {
      id: 5,
      year: '2022',
      title: {
        ko: '3D 개발 시작',
        en: 'Started 3D Development',
      },
      description: {
        ko: 'Three.js와 WebGL을 학습하며 3D 웹 개발에 입문했습니다.',
        en: 'Began learning Three.js and WebGL for 3D web development.',
      },
      type: 'achievement',
      color: '#ef4444',
      position: [3, 0, -8],
    },
    {
      id: 6,
      year: '2023',
      title: {
        ko: '크리에이티브 개발자',
        en: 'Creative Developer',
      },
      description: {
        ko: '인터랙티브 경험과 창의적인 웹 솔루션을 개발하고 있습니다.',
        en: 'Developing interactive experiences and creative web solutions.',
      },
      type: 'work',
      color: '#06b6d4',
      position: [0, 0.2, -10],
    },
    {
      id: 7,
      year: '2024',
      title: {
        ko: '현재',
        en: 'Present',
      },
      description: {
        ko: 'R3F, GSAP, 그리고 최신 웹 기술로 몰입형 경험을 창조합니다.',
        en: 'Creating immersive experiences with R3F, GSAP, and cutting-edge web technologies.',
      },
      type: 'achievement',
      color: '#ffffff',
      position: [-2, 0.1, -12],
    },
  ];

  const t = content[locale];

  useGSAP(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // Main scroll-driven timeline
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          // Update active index based on scroll progress
          const newIndex = Math.round(
            self.progress * (journeyItems.length - 1),
          );
          setActiveIndex(newIndex);
        },
      },
    });

    // Text animations
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    const description = section.querySelector('.section-description');

    if (title) {
      gsap.fromTo(
        title.children,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
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
  }, [locale]);

  // Split text for animation
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
      className='relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900'
    >
      {/* 3D Canvas */}
      <div className='absolute inset-0'>
        <Canvas
          camera={{ position: [0, 2, 3], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <JourneyScene3D
              items={journeyItems}
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
        <div className='flex flex-1 items-start justify-center pt-16'>
          <div className='mx-auto max-w-4xl px-8 text-center text-white'>
            <p className='section-subtitle mb-4 text-sm tracking-widest text-purple-300 uppercase'>
              {t.subtitle}
            </p>

            <h2 className='section-title mb-6 text-5xl leading-none font-black md:text-7xl'>
              {splitText(t.title)}
            </h2>

            <p className='section-description mx-auto max-w-2xl text-lg opacity-80 md:text-xl'>
              {t.description}
            </p>
          </div>
        </div>

        {/* Current Item Details */}
        <div className='absolute top-4 left-4 max-w-sm rounded-lg bg-black/80 p-4 text-white backdrop-blur-sm'>
          <div className='mb-3 flex items-center gap-3'>
            <div
              className='h-4 w-4 rounded-full'
              style={{ backgroundColor: journeyItems[activeIndex]?.color }}
            />
            <span className='text-2xl font-bold'>
              {journeyItems[activeIndex]?.year}
            </span>
            <span className='rounded bg-white/20 px-2 py-1 text-xs tracking-wider uppercase opacity-60'>
              {journeyItems[activeIndex]?.type}
            </span>
          </div>

          <h3 className='mb-2 text-lg leading-tight font-bold'>
            {journeyItems[activeIndex]?.title[locale]}
          </h3>

          <p className='text-sm leading-relaxed opacity-80'>
            {journeyItems[activeIndex]?.description[locale]}
          </p>
        </div>

        {/* Progress Timeline */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/60 px-6 py-3 backdrop-blur-sm'>
          <div className='flex items-center gap-3'>
            {journeyItems.map((item, index) => (
              <div
                key={item.id}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'scale-125 opacity-100'
                    : index < activeIndex
                      ? 'opacity-60'
                      : 'opacity-30'
                }`}
                style={{
                  backgroundColor:
                    index <= activeIndex ? item.color : '#ffffff40',
                }}
              />
            ))}
          </div>
        </div>

        {/* Navigation Hint */}
        <div className='absolute right-4 bottom-4 text-right text-sm text-white/60'>
          <div className='mb-1 flex items-center gap-2'>
            <span>Scroll to travel through time</span>
            <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
          </div>
          <div className='flex items-center gap-2'>
            <span>Hover nodes for details</span>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400'></div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className='absolute top-1/2 right-4 -translate-y-1/2 transform'>
          <div className='h-64 w-1 overflow-hidden rounded-full bg-white/20'>
            <div
              className='w-full rounded-full bg-gradient-to-t from-purple-400 to-blue-400 transition-all duration-300'
              style={{
                height: `${(activeIndex / (journeyItems.length - 1)) * 100}%`,
                minHeight: '8px',
              }}
            />
          </div>
          <div className='mt-2 text-center text-xs text-white/60'>
            {activeIndex + 1}/{journeyItems.length}
          </div>
        </div>
      </div>

      {/* Loading Fallback */}
      <Suspense
        fallback={
          <div className='absolute inset-0 flex items-center justify-center bg-indigo-900'>
            <div className='text-center text-white'>
              <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-purple-400'></div>
              <p>Loading Journey Timeline...</p>
            </div>
          </div>
        }
      />
    </section>
  );
}
