import VideoBackground from '@/components/ui/video-background';
import ScrollIndicator from '@/components/ui/scroll-indicator';
import MaskCursor from '@/components/ui/mask-cursor';

export default function HeroSection() {
  return (
    <>
      <MaskCursor className='h-full w-full'>
        <section className='relative h-screen w-full overflow-hidden'>
          {/* Video Background */}
          <VideoBackground videoSrc='/videos/bottle-1.mp4' />

          {/* Hero Content */}
          <div className='absolute inset-0 z-10 flex h-full w-full items-center justify-center'>
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
              {/* buttons and other content */}
            </div>
          </div>

          {/* Instructions hint - will be blurred with content */}
          <div className='absolute top-8 left-8 z-20 hidden md:block'>
            <div className='rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70 backdrop-blur-sm'>
              <span className='mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white/50'></span>
              Move cursor to reveal content
            </div>
          </div>
        </section>
      </MaskCursor>

      {/* Scroll Indicator - OUTSIDE MaskCursor so it's always clear */}
      <div className='absolute bottom-0 left-0 z-30 w-full'>
        <ScrollIndicator />
      </div>
    </>
  );
}
