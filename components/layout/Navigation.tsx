'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import LanguageToggle from '@/components/ui/LanguageToggle';
import UserDropdown from '@/components/ui/UserDropdown';
import UserMobileMenu from '@/components/ui/UserMobileMenu';
import { chaletName } from '@/lib/data/chalet';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: { en: 'Home', fr: 'Accueil' } },
    { href: '/chalet', label: { en: 'The Chalet', fr: 'Le Chalet' } },
    { href: '/location', label: { en: 'Location', fr: 'Localisation' } },
    { href: '/booking', label: { en: 'Booking', fr: 'Réservation' } },
    { href: '/gallery', label: { en: 'Gallery', fr: 'Galerie' } },
    { href: '/guide', label: { en: 'Guest Guide', fr: 'Guide' } },
    { href: '/contact', label: { en: 'Contact', fr: 'Contact' } },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-forest-100/20'
        : 'bg-white/95 backdrop-blur-md shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group text-sm font-medium transition-all duration-300 relative text-gray-700 hover:text-forest-700 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white/95">
            <div className="text-2xl transform group-hover:scale-110 transition-transform duration-300">🏔️</div>
            <div>
              <div className="text-lg font-bold">
                {chaletName}
              </div>
              <div className="text-xs text-wood-600">{t({ en: 'French Alps', fr: 'Alpes Françaises' })}</div>
            </div>
            <span className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-forest-600 to-forest-800 transition-all duration-300 w-0 group-hover:w-full" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  pathname === link.href
                    ? 'text-forest-700'
                    : 'text-gray-700 hover:text-forest-700'
                }`}
              >
                {t(link.label)}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-forest-600 to-forest-800 transition-all duration-300 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <UserDropdown />
            <LanguageToggle />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-forest-50 transition-colors"
          >
            <svg className="w-6 h-6 text-forest-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 opacity-100 transform translate-y-0 transition-all duration-300">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-forest-50 to-forest-100 text-forest-700 shadow-sm'
                      : 'text-gray-700 hover:bg-forest-50'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
              <UserMobileMenu onLinkClick={() => setMobileMenuOpen(false)} />
              <div className="px-4 py-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
