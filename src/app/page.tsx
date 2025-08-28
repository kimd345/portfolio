import VideoBackground from '@/components/ui/video-background';
import ScrollIndicator from '@/components/ui/scroll-indicator';

export default function Home() {
  return (
    <div className='w-full'>
      {/* Global Video Background - Fixed throughout the page */}
      <VideoBackground videoSrc='/videos/bottle-1.mp4' />

      {/* Hero Section */}
      <section className='relative h-screen w-full overflow-hidden'>
        {/* Hero Content */}
        <div
          className='absolute inset-0 flex h-full w-full items-center justify-center'
          style={{ zIndex: 5 }}
        >
          <div className='bg-opacity-40 rounded-lg bg-transparent p-8 text-center text-white backdrop-blur-sm'>
            <h1 className='mb-4 text-6xl font-bold'>Portfolio</h1>
            <p className='text-2xl'>Creative Developer & Designer</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-0 left-0 w-full' style={{ zIndex: 6 }}>
          <ScrollIndicator />
        </div>
      </section>

      {/* About Section - Now with transparent background */}
      <section className='relative min-h-screen w-full' style={{ zIndex: 3 }}>
        {/* Semi-transparent background that allows video to show through */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70'></div>

        <div className='relative container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24'>
          <div className='mx-auto max-w-4xl'>
            <h2 className='mb-8 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl'>
              About
            </h2>

            <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16'>
              <div className='space-y-6'>
                <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                  <p className='text-lg leading-relaxed text-white sm:text-xl'>
                    This demonstrates scroll-controlled video background. The
                    video plays automatically when you're at the top of the
                    page.
                  </p>
                </div>

                <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                  <p className='text-lg leading-relaxed text-white sm:text-xl'>
                    As you scroll, the video responds to your scroll direction
                    and speed, creating an immersive experience throughout the
                    entire page.
                  </p>
                </div>

                <div className='pt-6'>
                  <h3 className='mb-4 text-2xl font-semibold text-white'>
                    Video Features
                  </h3>
                  <ul className='space-y-3 text-white'>
                    <li className='flex items-start rounded bg-white/5 p-3'>
                      <span className='mr-3 text-blue-400'>•</span>
                      Fixed background throughout entire page
                    </li>
                    <li className='flex items-start rounded bg-white/5 p-3'>
                      <span className='mr-3 text-blue-400'>•</span>
                      Autoplay when in hero section
                    </li>
                    <li className='flex items-start rounded bg-white/5 p-3'>
                      <span className='mr-3 text-blue-400'>•</span>
                      Manual control based on scroll speed outside hero
                    </li>
                    <li className='flex items-start rounded bg-white/5 p-3'>
                      <span className='mr-3 text-blue-400'>•</span>
                      Forward/backward based on scroll direction
                    </li>
                  </ul>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                  <h4 className='mb-4 text-xl font-semibold text-white'>
                    Scroll Behavior
                  </h4>
                  <p className='leading-relaxed text-white'>
                    <strong>Hero Section:</strong> Video plays automatically at
                    normal speed.
                  </p>
                  <p className='mt-2 leading-relaxed text-white'>
                    <strong>Outside Hero:</strong> Video is controlled by your
                    scroll - scroll down to play forward, scroll up to play
                    backward.
                  </p>
                </div>

                <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                  <h4 className='mb-4 text-xl font-semibold text-white'>
                    Technical Notes
                  </h4>
                  <p className='leading-relaxed text-white'>
                    The video uses{' '}
                    <code className='rounded bg-black/30 px-2 py-1'>
                      position: fixed
                    </code>
                    with{' '}
                    <code className='rounded bg-black/30 px-2 py-1'>
                      z-index: -1
                    </code>{' '}
                    to stay behind all content while remaining visible
                    throughout the page.
                  </p>
                </div>
              </div>
            </div>

            {/* Test scrolling sections */}
            <div className='mt-16 border-t border-white/20 pt-16'>
              <h3 className='mb-8 text-center text-2xl font-bold text-white sm:text-3xl'>
                Test Scroll Control
              </h3>
              <div className='rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-md'>
                <p className='text-center text-lg leading-relaxed text-white'>
                  Try different scroll speeds and directions. The video should
                  respond immediately to your scrolling behavior. Scroll slowly
                  for precise control, or quickly for faster video playback.
                </p>
              </div>
            </div>

            {/* Additional scrollable content */}
            <div className='mt-20 space-y-8'>
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className='rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-sm'
                >
                  <h4 className='mb-4 text-xl font-semibold text-white'>
                    Scroll Test Section {item}
                  </h4>
                  <p className='leading-relaxed text-white'>
                    Continue scrolling to test the video control functionality.
                    The background video should remain visible and respond to
                    your scrolling. Notice how the video time changes based on
                    your scroll direction and speed.
                  </p>
                  {item === 3 && (
                    <div className='mt-4 rounded border border-blue-400/30 bg-blue-500/20 p-4'>
                      <p className='text-blue-200'>
                        <strong>Tip:</strong> Try scrolling up from here to see
                        the video play backward!
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
