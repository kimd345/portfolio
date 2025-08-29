'use client';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/use-translation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { header: t } = useTranslation(locale);

  // Check if we're on the main page
  const isMainPage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'projects' as const, href: '#projects' },
    { key: 'journey' as const, href: '#journey' },
    { key: 'gallery' as const, href: '#gallery' },
  ];

  const toggleLanguage = () => {
    if (!mounted) return;
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    const currentPath = window.location.pathname.replace(`/${locale}`, '');
    window.location.href = `/${newLocale}${currentPath}`;
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (typeof window !== 'undefined') {
      // If we're not on the main page, navigate to main page first
      if (!isMainPage) {
        window.location.href = `/${locale}${href}`;
        return;
      }

      // If we're on the main page, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <header className='fixed top-0 right-0 left-0 z-50 bg-transparent'>
        <nav className='px-2 sm:px-4'>
          <div className='flex h-16 items-center justify-between lg:h-20'>
            <div className='flex-shrink-0'>
              <div className='relative h-12 w-20 lg:h-14 lg:w-24'>
                <Image
                  src='/images/logos/kanoe-medium.png'
                  alt='Kanoe Logo'
                  fill
                  className='object-contain drop-shadow-lg'
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                  }}
                  sizes='96px'
                />
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className='fixed top-0 right-0 left-0 z-50 bg-transparent'>
      <nav className='px-2 sm:px-4'>
        <div className='flex h-16 items-center justify-between lg:h-20'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <a href={`/${locale}`} className='group flex items-center'>
              <div className='relative h-12 w-20 transition-all duration-500 hover:scale-105 lg:h-14 lg:w-24'>
                {/* Logo for initial state (black filter) */}
                <Image
                  src='/images/logos/kanoe-medium.png'
                  priority
                  alt='Kanoe Logo'
                  fill
                  className={`object-contain drop-shadow-2xl transition-all duration-500 ${
                    isScrolled ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                  }}
                  sizes='96px'
                />
                {/* Logo for scrolled state (original color) */}
                <Image
                  src='/images/logos/kanoe-medium.png'
                  alt='Kanoe Logo'
                  fill
                  className={`absolute inset-0 object-contain drop-shadow-lg transition-opacity duration-500 ${
                    isScrolled ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes='96px'
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation - slides out when scrolled OR not on main page */}
          {isMainPage && (
            <div
              className={`hidden transition-all duration-500 ease-in-out lg:block ${
                isScrolled
                  ? 'pointer-events-none translate-x-full opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              <div className='ml-6 flex items-baseline space-x-8'>
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.href)}
                    className='group relative px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-300 hover:scale-105 hover:text-gray-600'
                  >
                    {t.navigation[item.key]}
                    <span className='absolute bottom-0 left-1/2 h-0.5 w-0 bg-gray-600 transition-all duration-300 group-hover:left-0 group-hover:w-full'></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language Toggle & Menu Button */}
          <div className='flex items-center space-x-2'>
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 rounded-full border-2 px-3 py-2 transition-all duration-500 hover:scale-105 ${
                isScrolled
                  ? 'border-gray-600/30 text-gray-600 hover:border-gray-600 hover:bg-gray-600/5 hover:text-gray-800'
                  : 'border-gray-900/30 text-gray-900 hover:border-gray-600 hover:bg-gray-900/10 hover:text-gray-600'
              }`}
            >
              <Globe size={16} />
              <span className='text-sm font-semibold'>
                {locale.toUpperCase()}
              </span>
            </button>

            {/* Menu button - shows when scrolled on desktop OR always on mobile OR not on main page */}
            <div
              className={`${
                isMainPage
                  ? `lg:transition-all lg:duration-500 lg:ease-in-out ${
                      isScrolled
                        ? 'lg:translate-x-0 lg:opacity-100'
                        : 'lg:pointer-events-none lg:translate-x-full lg:opacity-0'
                    }`
                  : '' // Always show menu button when not on main page
              }`}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`rounded-lg p-2 transition-all duration-500 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-600 hover:bg-gray-600/5 hover:text-gray-800'
                    : 'text-gray-900 hover:bg-gray-900/10 hover:text-gray-600'
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Hamburger Navigation Menu - only show navigation items if on main page */}
        {isMenuOpen && (
          <div className='fixed inset-0 z-40 flex items-start justify-end pt-20 pr-2 sm:pr-4'>
            {/* Lighter Backdrop */}
            <div
              className='absolute inset-0 bg-black/40'
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Menu Content - Heavy Backdrop Blur */}
            <div className='animate-slide-up relative w-64 rounded-2xl border border-gray-200/50 bg-white/90 shadow-2xl backdrop-blur-2xl'>
              {/* Navigation Items - only show if on main page */}
              <div className='space-y-1 p-6'>
                {isMainPage && (
                  <>
                    {navItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleNavClick(item.href)}
                        className='block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-gray-900 drop-shadow transition-all duration-200 hover:translate-x-1 hover:bg-gray-100 hover:text-gray-600'
                      >
                        {t.navigation[item.key]}
                      </button>
                    ))}

                    {/* Separator when navigation items are present */}
                    <div className='mt-3 border-t border-gray-200 pt-3'>
                      <button
                        onClick={toggleLanguage}
                        className='flex w-full items-center space-x-2 rounded-xl px-4 py-3 text-gray-900 drop-shadow transition-all duration-200 hover:bg-gray-100 hover:text-gray-600'
                      >
                        <Globe size={16} />
                        <span className='text-sm font-medium'>
                          {locale === 'ko' ? 'English' : '한국어'}
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {/* Language toggle only (when not on main page) */}
                {!isMainPage && (
                  <button
                    onClick={toggleLanguage}
                    className='flex w-full items-center space-x-2 rounded-xl px-4 py-3 text-gray-900 drop-shadow transition-all duration-200 hover:bg-gray-100 hover:text-gray-600'
                  >
                    <Globe size={16} />
                    <span className='text-sm font-medium'>
                      {locale === 'ko' ? 'English' : '한국어'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
