'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location } from '@/lib/data/chalet';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { href: '/', label: { en: 'Home', fr: 'Accueil' } },
      { href: '/gallery', label: { en: 'Gallery', fr: 'Galerie' } },
      { href: '/location', label: { en: 'Location', fr: 'Localisation' } },
      { href: '/guide', label: { en: 'Guest Guide', fr: 'Guide' } },
    ],
    booking: [
      { href: '/booking', label: { en: 'Book Now', fr: 'Réserver' } },
      { href: '/contact', label: { en: 'Contact Us', fr: 'Nous Contacter' } },
      { href: '/client/login', label: { en: 'My Account', fr: 'Mon Compte' } },
    ],
  };

  return (
    <footer className="bg-white border-t border-forest-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏔️</span>
              <div>
                <h3 className="text-xl font-bold text-gray-700">{chaletName}</h3>
                <p className="text-gray-700 text-sm font-medium">{t({ en: 'French Alps', fr: 'Alpes Françaises' })}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium">
              {t({
                en: 'Alpine chalet in Haute-Savoie. 180m², 5 bedrooms, access to 5 ski resorts.',
                fr: 'Chalet alpin en Haute-Savoie. 180m², 5 chambres, accès à 5 stations de ski.',
              })}
            </p>
            <div className="text-gray-700 text-sm">
              <p className="font-bold text-gray-700 mb-1">{t({ en: 'Location', fr: 'Localisation' })}</p>
              {location.street && <p className="font-medium text-gray-700">{location.street}</p>}
              <p className="font-medium text-gray-700">{location.village}</p>
              <p className="font-medium text-gray-700">{location.region}, {location.postalCode}</p>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-700 mb-4">{t({ en: 'Explore', fr: 'Explorer' })}</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-forest-700 transition-colors text-sm font-medium"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-700 mb-4">{t({ en: 'Booking', fr: 'Réservation' })}</h4>
            <ul className="space-y-2">
              {footerLinks.booking.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-forest-700 transition-colors text-sm font-medium"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-700 mb-4">{t({ en: 'Contact', fr: 'Contact' })}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:contact@chalet-balmotte810.com"
                  className="text-gray-700 hover:text-forest-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <span>📧</span>
                  <span>contact@chalet-balmotte810.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+33685858491"
                  className="text-gray-700 hover:text-forest-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <span>📞</span>
                  <span>+33 6 85 85 84 91</span>
                </a>
              </li>
              <li className="text-gray-700 text-xs pt-2 font-medium">
                {t({
                  en: 'Available 24/7 for emergencies during your stay',
                  fr: 'Disponible 24h/24 pour urgences pendant votre séjour',
                })}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-forest-100/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-700 text-sm text-center md:text-left font-medium">
              © {currentYear} {chaletName}. {t({ en: 'All rights reserved', fr: 'Tous droits réservés' })}.
            </p>
            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
              <span>{t({ en: 'Made with', fr: 'Fait avec' })}</span>
              <span className="text-red-400 animate-pulse text-lg">♥</span>
              <span>{t({ en: 'by', fr: 'par' })}</span>
              <a
                href="mailto:pierre.raphael@gmail.com"
                className="text-forest-700 hover:text-forest-800 transition-colors font-bold underline decoration-2 decoration-forest-700 hover:decoration-forest-800"
              >
                raphaelpierre
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
