'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location } from '@/lib/data/chalet';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏔️</span>
              <h3 className="text-xl font-bold text-white">{chaletName}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t({
                en: 'Mountain chalet in the heart of the French Alps.',
                fr: 'Chalet de montagne au cœur des Alpes françaises.'
              })}
            </p>
          </div>

          {/* Location Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📍</span>
              {t({ en: 'Location', fr: 'Localisation' })}
            </h4>
            <address className="text-slate-300 text-sm not-italic space-y-1 leading-relaxed">
              {location.street && <p>{location.street}</p>}
              <p>{location.village}</p>
              <p>{location.region}, {location.postalCode}</p>
            </address>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">{t({ en: 'Contact', fr: 'Contact' })}</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contact@chalet-balmotte810.com"
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">📧</span>
                <span className="break-all">contact@chalet-balmotte810.com</span>
              </a>
              <a
                href="tel:+33685858491"
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
                <span>+33 6 85 85 84 91</span>
              </a>
              <p className="text-slate-400 text-xs pt-2 leading-relaxed border-t border-slate-700 mt-3">
                {t({
                  en: 'Available 24/7 for emergencies during your stay',
                  fr: 'Disponible 24h/24 pour urgences pendant votre séjour',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} {chaletName}. {t({ en: 'All rights reserved', fr: 'Tous droits réservés' })}.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{t({ en: 'Made with', fr: 'Fait avec' })}</span>
              <span className="text-red-400 animate-pulse text-lg">♥</span>
              <span>{t({ en: 'by', fr: 'par' })}</span>
              <a
                href="mailto:pierre.raphael@gmail.com"
                className="text-white hover:text-slate-200 transition-colors font-bold underline decoration-2 decoration-white hover:decoration-slate-200"
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
