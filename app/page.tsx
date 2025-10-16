'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName } from '@/lib/data/chalet';

export default function HomePage() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images du hero carousel - les meilleures photos du chalet
  const heroImages = [
    { src: '/images/ExteriieurJacuzi.webp', alt: 'Chalet enneigé avec jacuzzi' },
    { src: '/images/chalet_neige_devant.webp', alt: 'Chalet en hiver' },
    { src: '/images/ChaletPAnoramiqueVueHaut.webp', alt: 'Vue panoramique' },
    { src: '/images/Salon2.webp', alt: 'Salon cosy' },
    { src: '/images/Exterieur.webp', alt: 'Vue extérieure été' },
    { src: '/images/Cuisine1.webp', alt: 'Cuisine équipée' },
  ];

  // Auto-rotation du carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div>
      {/* Hero Carousel - Compact avec accroches */}
      <section className="relative h-[60vh] md:h-[85vh] overflow-hidden">
        {/* Images du carousel */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Overlay gradient adaptatif - Plus sombre en haut pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50" />

        {/* Titre et accroches - Positionnés en haut pour meilleure lisibilité */}
        <div className="absolute inset-0 z-10 flex flex-col justify-start pt-16 md:pt-24 lg:pt-32 items-center">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
            {/* Titre principal avec ombre portée renforcée */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 md:mb-4"
                style={{
                  textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.6)'
                }}>
              {chaletName}
            </h1>

            {/* Tagline accrocheur avec USP */}
            <p className="text-lg md:text-2xl lg:text-3xl text-white font-light tracking-wide mb-6 md:mb-8"
               style={{
                 textShadow: '0 3px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9), 0 6px 16px rgba(0,0,0,0.6)'
               }}>
              {t({
                en: 'Your Alpine Retreat • All Year Round',
                fr: 'Votre Refuge Alpin • Toute l\'Année'
              })}
            </p>

            {/* Points clés visuels sous le tagline - Fond plus opaque */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mx-auto">
              <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 md:px-6 md:py-3 shadow-xl">
                <span className="text-white font-semibold text-sm md:text-base"
                      style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  🏔️ {t({ en: '180m² Chalet', fr: 'Chalet 180m²' })}
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 md:px-6 md:py-3 shadow-xl">
                <span className="text-white font-semibold text-sm md:text-base"
                      style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  🛏️ {t({ en: '10-12 Guests', fr: '10-12 Pers.' })}
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 md:px-6 md:py-3 shadow-xl">
                <span className="text-white font-semibold text-sm md:text-base"
                      style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  ♨️ {t({ en: 'Private Hot Tub', fr: 'Jacuzzi Privé' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots - Plus discrets */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white/90 w-6 md:w-8'
                  : 'bg-white/40 hover:bg-white/60 w-1.5 md:w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Galerie Photo Masonry - Optimisée Mobile */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Grille Masonry avec liens vers galerie filtrée - Optimisée Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {/* Grande image principale - Salon */}
            <Link href="/gallery?filter=living" className="col-span-2 row-span-2 relative h-[280px] sm:h-[350px] md:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Salon2.webp"
                alt="Salon principal"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 text-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1">{t({ en: 'Cozy Living Space', fr: 'Espace Chaleureux' })}</h3>
                <p className="text-white/90 text-sm sm:text-base flex items-center gap-2">
                  {t({ en: '180m² of Comfort', fr: '180m² de Confort' })}
                  <span className="text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </p>
              </div>
            </Link>

            {/* Jacuzzi - vers wellness */}
            <Link href="/gallery?filter=wellness" className="relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/jacusi.webp"
                alt="Jacuzzi soirée"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                  ♨️ {t({ en: 'Hot Tub', fr: 'Jacuzzi' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Cuisine - vers kitchen */}
            <Link href="/gallery?filter=kitchen" className="relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Cuisine2.webp"
                alt="Cuisine moderne"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                  🍳 {t({ en: 'Kitchen', fr: 'Cuisine' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Chambre - vers bedroom */}
            <Link href="/gallery?filter=bedroom" className="relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Chambre3.webp"
                alt="Chambre"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                  🛏️ {t({ en: 'Bedrooms', fr: 'Chambres' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Terrasse - vers exterior */}
            <Link href="/gallery?filter=exterior" className="relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Terrasse1.webp"
                alt="Terrasse"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                  🌄 {t({ en: 'Terrace', fr: 'Terrasse' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Exterieur hiver - vers exterior */}
            <Link href="/gallery?filter=exterior" className="col-span-2 relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/chaletneigedehors.webp"
                alt="Chalet hiver"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 text-white">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 flex items-center gap-1 sm:gap-2">
                  {t({ en: 'Winter Wonderland', fr: 'Paradis Hivernal' })}
                  <span className="text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </h3>
                <p className="text-white/90 text-xs sm:text-sm">⛷️ {t({ en: '5 Resorts Nearby', fr: '5 Stations' })}</p>
              </div>
            </Link>

            {/* Salle de bain - vers bathroom */}
            <Link href="/gallery?filter=bathroom" className="relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/SalledeBain1.webp"
                alt="Salle de bain"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                  🚿 {t({ en: 'Bathroom', fr: 'Salle de Bain' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Vue panoramique - vers exterior - FIX: col-span-1 sur toutes les tailles */}
            <Link href="/gallery?filter=exterior" className="relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/ExterieurBalcon.webp"
                alt="Balcon"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                  🏔️ {t({ en: 'Mountain Views', fr: 'Vue Montagne' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Activités 4 Saisons */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Titre */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full text-sm md:text-base font-bold mb-3 shadow-lg">
              <span className="text-xl">🌍</span>
              <span>{t({ en: 'More Than Just a Chalet', fr: 'Plus Qu\'un Chalet' })}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Adventures for Everyone, All Year Long', fr: 'Des Aventures pour Tous, Toute l\'Année' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t({
                en: 'A stunning chalet is just the beginning. Ski enthusiasts, hikers, families, adventurers—the French Alps offer endless possibilities for every type of traveler.',
                fr: 'Un chalet magnifique n\'est que le début. Skieurs, randonneurs, familles, aventuriers—les Alpes françaises offrent des possibilités infinies pour tous les voyageurs.'
              })}
            </p>
          </div>

          {/* Grille d'activités par saison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* Hiver */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">❄️</div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t({ en: 'Winter', fr: 'Hiver' })}
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">⛷️</span>
                  <span>{t({ en: 'Skiing & Snowboarding (5 resorts, 650km slopes)', fr: 'Ski & Snowboard (5 stations, 650km de pistes)' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">🥾</span>
                  <span>{t({ en: 'Snowshoeing & winter hiking', fr: 'Raquettes & randonnée hivernale' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">🧗</span>
                  <span>{t({ en: 'Ice climbing & frozen waterfalls', fr: 'Cascade de glace & cascades gelées' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">♨️</span>
                  <span>{t({ en: 'Hot tub under the stars', fr: 'Jacuzzi sous les étoiles' })}</span>
                </li>
              </ul>
            </div>

            {/* Été */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">☀️</div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t({ en: 'Summer', fr: 'Été' })}
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">🥾</span>
                  <span>{t({ en: 'Mountain hiking & alpine trails', fr: 'Randonnée montagne & sentiers alpins' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">🚴</span>
                  <span>{t({ en: 'Mountain biking & cycling routes', fr: 'VTT & parcours cyclables' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">🪂</span>
                  <span>{t({ en: 'Paragliding & via ferrata', fr: 'Parapente & via ferrata' })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-700 font-bold">🏊</span>
                  <span>{t({ en: 'Swimming lakes & water sports', fr: 'Lacs de baignade & sports nautiques' })}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Activités toute l'année */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 md:p-8 shadow-xl text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
              {t({ en: 'All Year Round', fr: 'Toute l\'Année' })}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🏔️</span>
                <span className="text-sm md:text-base">{t({ en: 'Chamonix Mont-Blanc', fr: 'Chamonix Mont-Blanc' })}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🏰</span>
                <span className="text-sm md:text-base">{t({ en: 'Swiss Villages', fr: 'Villages Suisses' })}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🧀</span>
                <span className="text-sm md:text-base">{t({ en: 'Cheese Farms', fr: 'Fermes Fromagères' })}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">✈️</span>
                <span className="text-sm md:text-base">{t({ en: 'Geneva 45min', fr: 'Genève 45min' })}</span>
              </div>
            </div>
          </div>

          {/* Lien vers localisation */}
          <div className="mt-8 text-center">
            <Link
              href="/location"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
            >
              <span>{t({ en: 'Discover more activities', fr: 'Découvrir plus d\'activités' })}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
