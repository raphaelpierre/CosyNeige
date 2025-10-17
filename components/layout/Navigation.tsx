'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { chaletName } from '@/lib/data/chalet';
import { useAuth } from '@/lib/context/AuthContext';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();

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

              {/* Lien Mon Compte */}
              {loading ? (
                <div className="flex items-center justify-center w-8 h-8">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                </div>
              ) : (
                <Link
                  href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/client/dashboard') : '/client/login'}
                  className={`text-sm font-medium transition-all duration-300 relative group flex items-center gap-2 outline-none focus:outline-none ${
                    pathname.startsWith('/client') || pathname.startsWith('/admin')
                      ? 'text-slate-700'
                      : 'text-gray-700 hover:text-slate-700'
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:block">{user?.firstName}</span>
                    </>
                  ) : (
                    <>
                      <span>👤</span>
                      <span>{t({ en: 'My Account', fr: 'Mon Compte' })}</span>
                    </>
                  )}
                  <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-300 ${
                    pathname.startsWith('/client') || pathname.startsWith('/admin') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )}

              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Mobile - Ultra-simplifiée */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm shadow-md">
        <div className="pl-2 pr-1 py-2.5">
          <div className="flex items-center gap-1">
            {/* Logo et titre - Occupe toute la largeur disponible */}
            <Link href="/" className="flex items-center gap-2 py-1 flex-1 min-w-0 outline-none focus:outline-none">
              <span className="text-3xl flex-shrink-0">🏔️</span>
              <span className="font-bold text-base text-gray-900 tracking-tight truncate">{chaletName}</span>
            </Link>

            {/* Hamburger icon - Position fixe à droite */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors outline-none focus:outline-none flex-shrink-0"
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

                {/* Mon Compte - Mobile */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
                    </div>
                  ) : (
                    <Link
                      href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/client/dashboard') : '/client/login'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-200 active:scale-95 outline-none focus:outline-none bg-slate-100 text-slate-900 hover:bg-slate-200"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{user?.firstName} {user?.lastName}</span>
                            <span className="text-xs text-slate-600">{t({ en: 'My Account', fr: 'Mon Compte' })}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">👤</span>
                          <span>{t({ en: 'My Account', fr: 'Mon Compte' })}</span>
                        </>
                      )}
                    </Link>
                  )}
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
