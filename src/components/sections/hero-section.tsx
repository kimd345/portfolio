import VideoBackground from '@/components/ui/video-background';
import ScrollIndicator from '@/components/ui/scroll-indicator';
import MaskCursor from '@/components/ui/mask-cursor';

export default function HeroSection() {
  return (
    <section className='relative h-screen w-full overflow-hidden'>
      {/* Video Background */}
      <VideoBackground videoSrc='/videos/bottle-1.mp4' />

      {/* Hero Content with Mask Cursor Effect */}
      <div className='absolute inset-0 z-10 flex h-full w-full items-center justify-center'>
        <MaskCursor
          maskSize={120}
          className='flex h-full w-full items-center justify-center'
        >
          {/* Content that's revealed by the cursor */}
          <div className='max-w-4xl px-8 text-center text-white'>
            <h1 className='mb-6 text-7xl leading-tight font-bold tracking-tight'>
              Creative
              <br />
              <span className='bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Portfolio
              </span>
            </h1>
            <p className='mb-8 text-2xl leading-relaxed font-light opacity-90'>
              Developer & Designer crafting digital experiences
              <br />
              Move your cursor to reveal the magic
            </p>

            {/* Call to action buttons */}
            <div className='flex flex-wrap justify-center gap-6'>
              <button className='rounded-full border border-white/20 bg-white/20 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-xl'>
                View Projects
              </button>
              <button className='rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'>
                Get in Touch
              </button>
            </div>

            {/* Additional interactive elements */}
            <div className='mt-12 flex justify-center gap-8 text-sm font-medium'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-green-400'></div>
                Available for work
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-blue-400'></div>
                Based in Seoul
              </div>
            </div>
          </div>
        </MaskCursor>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-0 left-0 z-20 w-full'>
        <ScrollIndicator />
      </div>

      {/* Optional: Instructions hint (only on desktop) */}
      <div className='absolute top-8 left-8 z-20 hidden md:block'>
        <div className='rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70 backdrop-blur-sm'>
          <span className='mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white/50'></span>
          Move cursor to reveal content
        </div>
      </div>
    </section>
  );
}
