import HeroSection from '@/components/sections/hero-section';
import AboutSection from '@/components/sections/about-section';

export default function Home() {
  return (
    <div className='w-full'>
      <HeroSection />
      <AboutSection />
    </div>
  );
}
