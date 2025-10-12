'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location } from '@/lib/data/chalet';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <h3 className="text-3xl font-bold mb-4 text-white">
              {chaletName}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t({
                en: 'Experience luxury and authenticity in the heart of the French Alps. Your perfect mountain retreat awaits between the Arve and Giffre valleys.',
                fr: 'Vivez le luxe et l\'authenticité au cœur des Alpes françaises. Votre refuge montagnard parfait vous attend entre les vallées de l\'Arve et du Giffre.'
              })}
            </p>
            <div className="flex items-start space-x-3 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div className="font-medium text-white">{location.village}</div>
                <div>{location.region}, {location.postalCode}</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gold-400">
              {t({ en: 'Discover', fr: 'Découvrir' })}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/chalet" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'The Chalet', fr: 'Le Chalet' })}
                </Link>
              </li>
              <li>
                <Link href="/location" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'Location', fr: 'Localisation' })}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'Gallery', fr: 'Galerie' })}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'About', fr: 'À Propos' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gold-400">
              {t({ en: 'Plan Your Stay', fr: 'Planifier' })}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'Rates & Booking', fr: 'Tarifs & Réservation' })}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'Guest Guide', fr: 'Guide Visiteur' })}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t({ en: 'Contact', fr: 'Contact' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gold-400">
              {t({ en: 'Contact Us', fr: 'Nous Contacter' })}
            </h4>
            <div className="space-y-4">
              <a href="mailto:info@chaletlessires.com" className="flex items-start space-x-3 text-gray-300 hover:text-white transition-colors group">
                <svg className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t({ en: 'Email', fr: 'Email' })}</div>
                  <div className="font-medium break-all">info@chaletlessires.com</div>
                </div>
              </a>

              <a href="tel:+33XXXXXXXXX" className="flex items-start space-x-3 text-gray-300 hover:text-white transition-colors group">
                <svg className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t({ en: 'Phone', fr: 'Téléphone' })}</div>
                  <div className="font-medium">+33 (0)X XX XX XX XX</div>
                </div>
              </a>

              <div className="pt-4">
                <p className="text-xs text-gray-400 mb-3">
                  {t({ en: 'Available 7 days a week', fr: 'Disponible 7 jours sur 7' })}
                </p>
                <Link
                  href="/booking"
                  className="inline-block bg-gold-600 hover:bg-gold-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-gold-500/20"
                >
                  {t({ en: 'Book Now', fr: 'Réserver' })}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {chaletName}. {t({ en: 'All rights reserved.', fr: 'Tous droits réservés.' })}
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                {t({ en: 'Made with', fr: 'Fait avec' })} <span className="text-red-400 animate-pulse">♥</span> {t({ en: 'by', fr: 'par' })} <span className="text-gold-400 font-semibold">raphaelpierre</span>
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t({ en: 'Privacy Policy', fr: 'Confidentialité' })}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t({ en: 'Terms of Service', fr: 'Conditions' })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
