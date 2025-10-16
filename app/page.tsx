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
      {/* Hero Carousel Full-Screen - Optimisé Mobile */}
      <section className="relative h-screen overflow-hidden">
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

        {/* Overlay gradient renforcé pour mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

        {/* Titre et détails - Minimaliste sur mobile */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-20 md:pt-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Mobile: Titre simple centré */}
            <div className="md:hidden text-center animate-in fade-in duration-1000">
              <h1 className="text-4xl font-bold text-white drop-shadow-2xl mb-2">
                {chaletName}
              </h1>
              <p className="text-sm text-white/90 flex items-center justify-center gap-2">
                <span>📍</span>
                <span>Châtillon • {t({ en: 'French Alps', fr: 'Alpes Françaises' })}</span>
              </p>
            </div>

            {/* Desktop: Tout afficher */}
            <div className="hidden md:block animate-in fade-in slide-in-from-top-4 duration-1000">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-2 drop-shadow-2xl leading-tight">
                {chaletName}
              </h1>
              <p className="text-2xl lg:text-3xl text-white/95 mb-2 font-light tracking-wide">
                {t(tagline)}
              </p>
              <p className="text-base lg:text-lg text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-block animate-pulse">📍</span>
                <span className="truncate">Châtillon-sur-Cluses • {t({ en: 'French Alps', fr: 'Alpes Françaises' })}</span>
              </p>

              {/* Badges - Desktop uniquement */}
              <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-8 duration-1000 delay-200">
                <div className="bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300 shadow-lg">
                  <span className="text-white font-semibold text-sm md:text-base">{specs.capacity} {t({ en: 'Guests', fr: 'Pers.' })}</span>
                </div>
                <div className="bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300 shadow-lg">
                  <span className="text-white font-semibold text-sm md:text-base">{specs.bedrooms} {t({ en: 'Bedrooms', fr: 'Ch.' })}</span>
                </div>
                <div className="bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300 shadow-lg">
                  <span className="text-white font-semibold text-sm md:text-base">{specs.bathrooms} {t({ en: 'Bathrooms', fr: 'SDB' })}</span>
                </div>
                <div className="bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300 shadow-lg">
                  <span className="text-white font-semibold text-sm md:text-base">{specs.surface}m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons CTA EN BAS - Simplifié sur mobile */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Mobile: CTA unique centré - le bouton flottant fera le reste */}
            <div className="md:hidden flex justify-center animate-in fade-in duration-1000 delay-400">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center bg-slate-700 active:bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-2xl active:scale-95 border-2 border-slate-700"
              >
                <span className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{t({ en: 'Book Now', fr: 'Réserver' })}</span>
                </span>
              </Link>
            </div>

            {/* Desktop: Deux boutons */}
            <div className="hidden md:flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              <Link
                href="/booking"
                className="group relative inline-flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-slate-900/50 border-2 border-slate-700 hover:border-slate-800 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>📅</span>
                  <span className="whitespace-nowrap">{t({ en: 'Check Availability', fr: 'Voir Disponibilités' })}</span>
                </span>
              </Link>
              <Link
                href="/chalet"
                className="group bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-white/30 hover:scale-105"
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {t({ en: 'Discover the Chalet', fr: 'Découvrir le Chalet' })}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation dots du carousel */}
        <div className="absolute bottom-14 sm:bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2 sm:w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator - masqué sur mobile */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-1.5 animate-pulse" />
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

            {/* Vue panoramique - vers exterior */}
            <Link href="/gallery?filter=exterior" className="col-span-2 lg:col-span-1 relative h-[135px] sm:h-[170px] md:h-[243px] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/ExterieurBalcon.webp"
                alt="Balcon"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
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

          {/* CTA vers galerie complète */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 sm:gap-3 bg-slate-700 hover:bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 md:hover:scale-105"
            >
              <span>📸</span>
              <span className="whitespace-nowrap">{t({ en: 'View Full Gallery', fr: 'Voir Toute la Galerie' })}</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Hero Immersive - USP Principal */}
      <section className="py-0">
        {/* Vue entre deux vallées - Photo immersive */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <Image
            src="/images/entre2vallees.webp"
            alt="Entre deux vallées"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Mobile: Gradient léger, pas de texte - juste la photo */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Desktop: Gradient + texte complet */}
          <div className="hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="text-6xl mb-6">⛷️</div>
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}
                  </h2>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    {t({
                      en: 'Unique strategic location between the Arve and Giffre valleys. Access to 5 major ski resorts in under 30 minutes.',
                      fr: 'Position stratégique unique entre les vallées de l\'Arve et du Giffre. Accès à 5 grandes stations en moins de 30 minutes.'
                    })}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                      <span className="text-white font-semibold text-base">⛷️ 5 {t({ en: 'Resorts', fr: 'Stations' })}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                      <span className="text-white font-semibold text-base">🚗 &lt; 30 min</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                      <span className="text-white font-semibold text-base">👥 10 {t({ en: 'Guests', fr: 'Personnes' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats - Masqué sur mobile */}
      <section className="hidden md:block py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-slate-700 mb-2">5</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Ski Resorts Nearby', fr: 'Stations de Ski' })}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-slate-700 mb-2">10</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Guests Capacity', fr: 'Personnes Max' })}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-slate-700 mb-2">180</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Square Meters', fr: 'Mètres Carrés' })}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-slate-700 mb-2">4+</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Premium Amenities', fr: 'Équipements Premium' })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Resorts - Masqué sur mobile */}
      <section className="hidden md:block py-12 md:py-16 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t({ en: 'Access to 5 Major Ski Resorts', fr: 'Accès à 5 Grandes Stations' })}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {t({ en: 'Strategic location for ski variety', fr: 'Emplacement stratégique pour varier les plaisirs' })}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-slate-600 to-slate-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyResorts.map((resort, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300  border border-gray-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-200/20 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-300">⛷️</span>
                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-gray-900">{resort.name}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full">
                      <span className="text-slate-700 font-semibold">{resort.distance}km</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full">
                      <span>🚗</span>
                      <span className="text-slate-700 font-semibold">{resort.drivingTime} min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* CTA */}
      <section className="py-14 bg-white border-t border-gray-200/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-700">
              {t({ en: 'Ready to Book Your Alpine Retreat?', fr: 'Prêt à Réserver Votre Refuge Alpin ?' })}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 flex items-center justify-center gap-2">
              <span className="text-slate-700">✨</span>
              {t({ en: 'From €310 per night', fr: 'À partir de 310€ par nuit' })}
              <span className="text-slate-700">✨</span>
            </p>
            <Link
              href="/booking"
              className="group relative inline-block bg-slate-700 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-slate-700 hover:border-slate-800"
            >
              <span className="relative z-10 flex items-center gap-2 font-bold">
                {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
                <span className="group-hover:translate-x-1 transition-transform duration-300 font-bold">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
