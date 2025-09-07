// src/components/sections/projects-section.tsx
'use client';
import { useEffect, useRef } from 'react';
import { Locale } from '@/lib/i18n';
import InfiniteCarousel from '@/components/ui/infinite-carousel';

interface ProjectsSectionProps {
  locale: Locale;
}

interface Project {
  id: number;
  name: string;
  description: string;
  tags: Array<{
    name: string;
    color: string;
  }>;
  platform: 'web' | 'mobile';
  image: string | string[];
  source_code_link: string;
  live_link?: string;
}

export default function ProjectsSection({ locale }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const content = {
    ko: {
      title: 'Projects',
      subtitle: '창작물',
      viewCode: '코드 보기',
      viewLive: '라이브 보기',
    },
    en: {
      title: 'Projects',
      subtitle: 'Creative outlet',
      viewCode: 'View Code',
      viewLive: 'View Live',
    },
  };

  // Transform your existing projects data to match the carousel format
  const projects: Project[] = [
    {
      id: 1,
      name: 'GPVC',
      description:
        'A comprehensive web application designed to streamline business processes and enhance user productivity. Built with modern technologies and best practices to deliver a seamless user experience across all devices.',
      tags: [
        { name: 'react', color: 'text-blue-400' },
        { name: 'typescript', color: 'text-green-400' },
        { name: 'tailwindcss', color: 'text-pink-400' },
        { name: 'nextjs', color: 'text-purple-400' },
      ],
      platform: 'web',
      image: '/images/projects/gpvc.jpg', // You'll need to add this image
      source_code_link: 'https://github.com/kimd345/gpvc-website/',
      live_link: 'https://gp-vc.com', // Add if available
    },
    {
      id: 2,
      name: 'Shiboh',
      description:
        'An Android/iOS cross-platform mobile app built with React Native and Flask maintained in one code base. Shibal offers a one-stop tool for training your shiba inu through detailed modules in the form of online education and socializing with other owners on a social media platform.',
      tags: [
        { name: 'react-native', color: 'text-blue-400' },
        { name: 'javascript', color: 'text-yellow-400' },
        { name: 'postgres', color: 'text-green-400' },
        { name: 'flask', color: 'text-pink-400' },
        { name: 'python', color: 'text-purple-400' },
      ],
      platform: 'mobile',
      image: '/images/projects/shibal1.gif', // You'll need to add this image
      source_code_link:
        'https://github.com/kimd345/shibal#a-mobile-app-for-shiba-inu-owners-to-train-and-bond-with-their-companion',
    },
  ];

  // Transform projects for the carousel format
  const carouselProjects = projects.map((project) => ({
    id: project.id,
    title: { ko: project.name, en: project.name },
    description: { ko: project.description, en: project.description },
    imagePath: project.image as string,
    year: { ko: '', en: '' }, // Add years if needed
    category: {
      ko: project.platform === 'web' ? '웹 애플리케이션' : '모바일 앱',
      en: project.platform === 'web' ? 'Web Application' : 'Mobile App',
    },
    platforms: {
      ko: project.tags.map((tag) => tag.name).join(', '),
      en: project.tags.map((tag) => tag.name).join(', '),
    },
    type: project.platform,
    sourceCodeLink: project.source_code_link,
    liveLink: project.live_link,
  }));

  const t = content[locale];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id='projects' className='relative overflow-hidden py-16 lg:py-24'>
      <div className='relative z-10'>
        {/* Section Header */}
        <div
          ref={sectionRef}
          className='mx-auto mb-12 max-w-7xl px-4 text-center sm:px-6 lg:mb-16 lg:px-8'
        >
          <p className='mb-4 text-sm tracking-wider text-gray-600 uppercase'>
            {t.subtitle}
          </p>
          <h2 className='mb-6 text-3xl font-black text-gray-900 lg:text-5xl'>
            {t.title}
          </h2>
        </div>

        {/* Infinite Carousel */}
        <div className='relative'>
          <InfiniteCarousel
            items={carouselProjects}
            speed={40}
            pauseOnHover={true}
            itemWidth={320}
            itemHeight={400}
            gap={24}
            locale={locale}
            className='py-8'
          />
        </div>
      </div>
    </section>
  );
}
