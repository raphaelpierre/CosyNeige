'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, tagline, specs, nearbyResorts, testimonials } from '@/lib/data/chalet';

export default function HomePage() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images du hero carousel - les meilleures photos du chalet
  const heroImages = [
    { src: '/images/ChaletPAnoramiqueVueHaut.webp', alt: 'Vue panoramique' },
    { src: '/images/chalet_neige_devant.webp', alt: 'Chalet en hiver' },
    { src: '/images/Salon2.webp', alt: 'Salon cosy' },
    { src: '/images/ExteriieurJacuzi.webp', alt: 'Jacuzzi extérieur' },
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

        {/* Overlay gradient plus doux */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/90" />

        {/* Titre et accroches - Centré verticalement */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight mb-3 md:mb-4">
              {chaletName}
            </h1>

            {/* Tagline accrocheur avec USP */}
            <p className="text-lg md:text-2xl lg:text-3xl text-white/95 font-light tracking-wide">
              {t({
                en: '5 Ski Resorts • 650km of Slopes • Hot Tub',
                fr: '5 Stations de Ski • 650km de Pistes • Jacuzzi'
              })}
            </p>
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

      {/* Boutons CTA - Après le hero */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/booking"
              className="group inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>📅</span>
              <span>{t({ en: 'Check Availability', fr: 'Voir Disponibilités' })}</span>
            </Link>

            <Link
              href="/chalet"
              className="group inline-flex items-center justify-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300"
            >
              <span>{t({ en: 'Discover', fr: 'Découvrir' })}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
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

      {/* Section Domaines Skiables - Moderne et Compact */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Titre accrocheur */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full text-sm md:text-base font-bold mb-3 shadow-lg">
              <span className="text-xl">⛷️</span>
              <span>{t({ en: '5 Resorts in 30min', fr: '5 Stations en 30min' })}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              {t({ en: 'Unlimited Skiing', fr: 'Ski Illimité' })}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl mx-auto">
              {t({
                en: 'Strategic position between 2 valleys = access to the best ski resorts in the Alps',
                fr: 'Position stratégique entre 2 vallées = accès aux meilleures stations des Alpes'
              })}
            </p>
          </div>

          {/* Cartes compactes modernes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {nearbyResorts.map((resort, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Badge de distance */}
                <div className="absolute top-2 right-2 bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {resort.drivingTime}min
                </div>

                {/* Icône et nom */}
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    ⛷️
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight mb-1">
                    {resort.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>🚗</span>
                    <span className="font-semibold">{resort.distance}km</span>
                  </div>
                </div>

                {/* Barre de progression visuelle pour la distance */}
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-500 group-hover:w-full"
                    style={{ width: `${Math.max(20, 100 - resort.drivingTime * 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats chocs en bas */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-2xl md:text-3xl">🏔️</span>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-700">650km</div>
                <div className="text-xs md:text-sm text-gray-600">{t({ en: 'of slopes', fr: 'de pistes' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-2xl md:text-3xl">🎿</span>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-700">200+</div>
                <div className="text-xs md:text-sm text-gray-600">{t({ en: 'ski lifts', fr: 'remontées' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-2xl md:text-3xl">⭐</span>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-700">1000-2500m</div>
                <div className="text-xs md:text-sm text-gray-600">{t({ en: 'altitude', fr: 'd\'altitude' })}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Réserver - Version plus claire */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge "Position stratégique" */}
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <span>📍</span>
            <span>{t({ en: 'Strategic Location', fr: 'Position Stratégique' })}</span>
          </div>

          {/* Titre principal */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            {t({
              en: 'Ready for Your Alpine Adventure?',
              fr: 'Prêt pour Votre Aventure Alpine ?'
            })}
          </h2>

          {/* Sous-titre */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            {t({
              en: 'Between 2 valleys, access to 5 resorts, 650km of slopes. Your perfect ski chalet awaits.',
              fr: 'Entre 2 vallées, accès à 5 stations, 650km de pistes. Votre chalet de ski idéal vous attend.'
            })}
          </p>

          {/* Prix accrocheur */}
          <div className="mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 text-slate-700">
              <span className="text-2xl md:text-3xl">✨</span>
              <span className="text-3xl md:text-4xl font-bold">€310</span>
              <span className="text-lg md:text-xl text-gray-600">/ {t({ en: 'night', fr: 'nuit' })}</span>
              <span className="text-2xl md:text-3xl">✨</span>
            </div>
          </div>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/booking"
              className="group inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>📅</span>
              <span>{t({ en: 'Check Availability', fr: 'Voir Disponibilités' })}</span>
            </Link>

            <Link
              href="/chalet"
              className="group inline-flex items-center justify-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300"
            >
              <span>{t({ en: 'Discover', fr: 'Découvrir' })}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Mini info en bas */}
          <p className="mt-6 text-sm text-gray-500">
            {t({
              en: 'Free cancellation up to 30 days before arrival',
              fr: 'Annulation gratuite jusqu\'à 30 jours avant l\'arrivée'
            })}
          </p>
        </div>
      </section>

      {/* Testimonials - Masqué sur mobile */}
      <section className="hidden md:block py-12 md:py-14 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t({ en: 'Guest Reviews', fr: 'Avis des Clients' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-slate-600 to-slate-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((review, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300  border border-gray-200 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gold-100/40 to-transparent rounded-br-full transform -translate-x-8 -translate-y-8" />
                <div className="relative">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-gold-500 text-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">&ldquo;{t(review.comment)}&rdquo;</p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200">
                    <div className="font-semibold text-gray-800">{review.name}</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <span>📍</span>
                      {review.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
