export default function AboutSection() {
  return (
    <section className='min-h-screen w-full bg-gray-900'>
      <div className='container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24'>
        <div className='mx-auto max-w-4xl'>
          <h2 className='mb-8 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl'>
            About
          </h2>

          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16'>
            <div className='space-y-6'>
              <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <p className='text-lg leading-relaxed text-white sm:text-xl'>
                  This demonstrates a clean video background that autoplays in
                  the hero section only.
                </p>
              </div>

              <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <p className='text-lg leading-relaxed text-white sm:text-xl'>
                  The video background is contained within the hero section and
                  doesn&apos;t interfere with the rest of the page content.
                </p>
              </div>

              <div className='pt-6'>
                <h3 className='mb-4 text-2xl font-semibold text-white'>
                  Video Features
                </h3>
                <ul className='space-y-3 text-white'>
                  <li className='flex items-start rounded bg-white/5 p-3'>
                    <span className='mr-3 text-blue-400'>•</span>
                    Autoplay in hero section only
                  </li>
                  <li className='flex items-start rounded bg-white/5 p-3'>
                    <span className='mr-3 text-blue-400'>•</span>
                    Clean, simple implementation
                  </li>
                  <li className='flex items-start rounded bg-white/5 p-3'>
                    <span className='mr-3 text-blue-400'>•</span>
                    No scroll interactions or complications
                  </li>
                  <li className='flex items-start rounded bg-white/5 p-3'>
                    <span className='mr-3 text-blue-400'>•</span>
                    Solid background for rest of page
                  </li>
                </ul>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <h4 className='mb-4 text-xl font-semibold text-white'>
                  Simple & Clean
                </h4>
                <p className='leading-relaxed text-white'>
                  The video background now only appears in the hero section and
                  autoplays without any complex scroll interactions.
                </p>
              </div>

              <div className='rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md'>
                <h4 className='mb-4 text-xl font-semibold text-white'>
                  Better Performance
                </h4>
                <p className='leading-relaxed text-white'>
                  By removing scroll listeners and complex playback rate
                  manipulations, the page now performs better and is more
                  reliable across browsers.
                </p>
              </div>
            </div>
          </div>

          {/* Additional content sections */}
          <div className='mt-20 space-y-8'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className='rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-sm'
              >
                <h4 className='mb-4 text-xl font-semibold text-white'>
                  Content Section {item}
                </h4>
                <p className='leading-relaxed text-white'>
                  This content now sits on a solid background, making it easier
                  to read and ensuring consistent performance across all devices
                  and browsers.
                </p>
                {item === 3 && (
                  <div className='mt-4 rounded border border-green-400/30 bg-green-500/20 p-4'>
                    <p className='text-green-200'>
                      <strong>Note:</strong> The video background is now
                      contained only in the hero section above!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
