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
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Navigation complète pour desktop
  const navLinks = [
    { href: '/', label: { en: 'Home', fr: 'Accueil' } },
    { href: '/gallery', label: { en: 'Gallery', fr: 'Galerie' } },
    { href: '/location', label: { en: 'Location & Info', fr: 'Localisation & Infos' } },
    { href: '/booking', label: { en: 'Booking', fr: 'Réservation' } },
    { href: '/contact', label: { en: 'Contact', fr: 'Contact' } },
  ];

  // Navigation simplifiée pour mobile
  const mobileNavLinks = [
    { href: '/', label: { en: 'Home', fr: 'Accueil' }, icon: '🏠' },
    { href: '/gallery', label: { en: 'Gallery', fr: 'Galerie' }, icon: '📸' },
    { href: '/location', label: { en: 'Info', fr: 'Infos' }, icon: '📍' },
    { href: '/booking', label: { en: 'Book', fr: 'Réserver' }, icon: '📅', highlight: true },
    { href: '/contact', label: { en: 'Contact', fr: 'Contact' }, icon: '✉️' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Menu mobile toujours visible maintenant
      setVisible(true);

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Navigation Desktop - Style actuel */}
      <nav className={`hidden md:block sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/20'
          : 'bg-white/95 backdrop-blur-md shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 lg:gap-3 group text-sm font-medium transition-all duration-300 relative text-gray-700 hover:text-slate-700 px-2 lg:px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white/95 outline-none focus:outline-none">
              <div className="text-xl lg:text-2xl transform group-hover:scale-110 transition-transform duration-300">🏔️</div>
              <div>
                <div className="text-base lg:text-lg font-bold">
                  {chaletName}
                </div>
                <div className="text-xs text-gray-600">{t({ en: 'French Alps', fr: 'Alpes Françaises' })}</div>
              </div>
              <span className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-300 w-0 group-hover:w-full" />
            </Link>

            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 relative group outline-none focus:outline-none ${
                    pathname === link.href
                      ? 'text-slate-700'
                      : 'text-gray-700 hover:text-slate-700'
                  }`}
                >
                  {t(link.label)}
                  <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
              <UserDropdown />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Mobile - Ultra-simplifiée */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm shadow-md">
        <div className="px-3 py-2.5">
          <div className="flex justify-between items-center">
            {/* Logo minimaliste - Plus visible sur mobile */}
            <Link href="/" className="flex items-center gap-2 py-1 outline-none focus:outline-none">
              <span className="text-3xl">🏔️</span>
              <span className="font-bold text-base text-gray-900 tracking-tight">{chaletName}</span>
            </Link>

            {/* Hamburger icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors outline-none focus:outline-none"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile simplifié - Full screen overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop pour fermer au clic */}
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-[90]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu content */}
          <div className="md:hidden fixed inset-0 top-[52px] bg-white z-[95] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="px-4 py-6 space-y-2">
                {mobileNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-200 active:scale-95 outline-none focus:outline-none ${
                      link.highlight
                        ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg hover:shadow-xl'
                        : pathname === link.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span>{t(link.label)}</span>
                  </Link>
                ))}

                {/* User section compact */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <UserMobileMenu onLinkClick={() => setMobileMenuOpen(false)} />
                </div>

                {/* Language toggle */}
                <div className="pt-2">
                  <div className="px-4">
                    <LanguageToggle />
                  </div>
                </div>
              </div>
            </div>
        </>
      )}

    </>
  );
}
