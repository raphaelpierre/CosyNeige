'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, tagline, specs, description, amenities, nearbyResorts, testimonials, galleryImages } from '@/lib/data/chalet';

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
      {/* Hero Carousel Full-Screen */}
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

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        {/* Titre et détails EN HAUT - TRÈS HAUT */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-8 md:pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:mb-3 drop-shadow-2xl">
                {chaletName}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-1 md:mb-2 font-light tracking-wide">
                {t(tagline)}
              </p>
              <p className="text-base md:text-lg text-white/90 mb-4 md:mb-5 flex items-center gap-2">
                <span className="inline-block animate-pulse">📍</span>
                Châtillon-sur-Cluses • {t({ en: 'French Alps', fr: 'Alpes Françaises' })}
              </p>
            </div>

            {/* Badges compacts en ligne */}
            <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-8 duration-1000 delay-200">
              <div className="bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300 shadow-lg">
                <span className="text-white font-semibold text-sm md:text-base">{specs.capacity} {t({ en: 'Guests', fr: 'Personnes' })}</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300 shadow-lg">
                <span className="text-white font-semibold text-sm md:text-base">{specs.bedrooms} {t({ en: 'Bedrooms', fr: 'Chambres' })}</span>
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

        {/* Boutons CTA EN BAS */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              <Link
                href="/booking"
                className="group relative inline-flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-2xl hover:shadow-slate-900/50 border-2 border-slate-700 hover:border-slate-800 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>📅</span>
                  {t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}
                </span>
              </Link>
              <Link
                href="/chalet"
                className="group bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-white/30 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  {t({ en: 'Discover the Chalet', fr: 'Découvrir le Chalet' })}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation dots du carousel */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Galerie Photo Masonry - NOUVELLE SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Discover Your Alpine Sanctuary', fr: 'Découvrez Votre Refuge Alpin' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t({
                en: 'Authentic Savoyard chalet in the French Alps • 180m² of comfort for 10 guests',
                fr: 'Chalet savoyard authentique dans les Alpes • 180m² de confort pour 10 personnes'
              })}
            </p>
          </div>

          {/* Grille Masonry avec liens vers galerie filtrée */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Grande image principale - Salon */}
            <Link href="/gallery?filter=living" className="col-span-2 row-span-2 relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Salon2.webp"
                alt="Salon principal"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{t({ en: 'Cozy Living Space', fr: 'Espace de Vie Chaleureux' })}</h3>
                <p className="text-white/90 flex items-center gap-2">
                  {t({ en: '180m² of Comfort', fr: '180m² de Confort' })}
                  <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </p>
              </div>
            </Link>

            {/* Jacuzzi - vers wellness */}
            <Link href="/gallery?filter=wellness" className="relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/jacusi.webp"
                alt="Jacuzzi soirée"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-semibold flex items-center gap-2">
                  ♨️ {t({ en: 'Hot Tub', fr: 'Jacuzzi' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Cuisine - vers kitchen */}
            <Link href="/gallery?filter=kitchen" className="relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Cuisine2.webp"
                alt="Cuisine moderne"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-semibold flex items-center gap-2">
                  🍳 {t({ en: 'Gourmet Kitchen', fr: 'Cuisine Équipée' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Chambre - vers bedroom */}
            <Link href="/gallery?filter=bedroom" className="relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Chambre3.webp"
                alt="Chambre"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-semibold flex items-center gap-2">
                  🛏️ {t({ en: 'Bedrooms', fr: 'Chambres' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Terrasse - vers exterior */}
            <Link href="/gallery?filter=exterior" className="relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/Terrasse1.webp"
                alt="Terrasse"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-semibold flex items-center gap-2">
                  🌄 {t({ en: 'Terrace', fr: 'Terrasse' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Exterieur hiver - vers exterior */}
            <Link href="/gallery?filter=exterior" className="col-span-2 relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/chaletneigedehors.webp"
                alt="Chalet hiver"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  {t({ en: 'Winter Wonderland', fr: 'Paradis Hivernal' })}
                  <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </h3>
                <p className="text-white/90 text-sm">⛷️ {t({ en: '5 Resorts Nearby', fr: '5 Stations à Proximité' })}</p>
              </div>
            </Link>

            {/* Salle de bain - vers bathroom */}
            <Link href="/gallery?filter=bathroom" className="relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/SalledeBain1.webp"
                alt="Salle de bain"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-semibold flex items-center gap-2">
                  🚿 {t({ en: 'Bathroom', fr: 'Salle de Bain' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>

            {/* Vue panoramique - vers exterior */}
            <Link href="/gallery?filter=exterior" className="col-span-2 lg:col-span-1 relative h-[195px] md:h-[243px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="/images/ExterieurBalcon.webp"
                alt="Balcon"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-semibold flex items-center gap-2">
                  🏔️ {t({ en: 'Mountain Views', fr: 'Vue Montagne' })}
                  <span className="text-xs opacity-75 group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>
          </div>

          {/* CTA vers galerie complète */}
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>📸</span>
              <span>{t({ en: 'View Full Gallery', fr: 'Voir Toute la Galerie' })}</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Images Plein Écran - Immersive */}
      <section className="py-0">
        {/* Jacuzzi avec vue montagne */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image
            src="/images/ExteriieurJacuzi.webp"
            alt="Jacuzzi avec vue montagne"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div className="text-6xl mb-6">♨️</div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {t({ en: 'Unwind in Luxury', fr: 'Détente Absolue' })}
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  {t({
                    en: 'Soak in the outdoor hot tub with breathtaking mountain views. The perfect way to relax after a day of skiing.',
                    fr: 'Plongez dans le jacuzzi extérieur avec vue imprenable sur les montagnes. Le moyen parfait de se détendre après une journée de ski.'
                  })}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                    <span className="text-white font-semibold">♨️ {t({ en: 'Hot Tub', fr: 'Jacuzzi Extérieur' })}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                    <span className="text-white font-semibold">🏔️ {t({ en: 'Mountain Views', fr: 'Vue Montagne' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salon chaleureux */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image
            src="/images/Salon1.webp"
            alt="Salon chaleureux"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl ml-auto text-right">
                <div className="text-6xl mb-6">🔥</div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {t({ en: 'Cozy Living Space', fr: 'Espace de Vie Chaleureux' })}
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  {t({
                    en: 'Spacious 180m² living area with stone fireplace, comfortable seating for 10, and warm alpine atmosphere.',
                    fr: 'Spacieux espace de 180m² avec cheminée en pierre, sièges confortables pour 10 personnes et ambiance alpine chaleureuse.'
                  })}
                </p>
                <div className="flex flex-wrap gap-3 justify-end">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                    <span className="text-white font-semibold">🔥 {t({ en: 'Fireplace', fr: 'Cheminée' })}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                    <span className="text-white font-semibold">🏠 180m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vue entre deux vallées - Position stratégique */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image
            src="/images/entre2vallees.webp"
            alt="Entre deux vallées"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 md:pb-16">
              <div className="max-w-3xl mx-auto text-center">
                <div className="text-5xl md:text-6xl mb-4 md:mb-6">⛷️</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                  {t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
                  {t({
                    en: 'Unique strategic location between the Arve and Giffre valleys. Access to 5 major ski resorts in under 30 minutes.',
                    fr: 'Position stratégique unique entre les vallées de l\'Arve et du Giffre. Accès à 5 grandes stations en moins de 30 minutes.'
                  })}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 md:px-6 py-2 md:py-3 rounded-full">
                    <span className="text-white font-semibold text-sm md:text-base">⛷️ 5 {t({ en: 'Resorts', fr: 'Stations' })}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 md:px-6 py-2 md:py-3 rounded-full">
                    <span className="text-white font-semibold text-sm md:text-base">🚗 &lt; 30 min</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 md:px-6 py-2 md:py-3 rounded-full">
                    <span className="text-white font-semibold text-sm md:text-base">👥 10 {t({ en: 'Guests', fr: 'Personnes' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
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

      {/* Équipements Premium avec photos réelles */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Premium Amenities', fr: 'Équipements Premium' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t({
                en: 'Everything you need for an unforgettable mountain stay',
                fr: 'Tout ce dont vous avez besoin pour un séjour inoubliable à la montagne'
              })}
            </p>
          </div>

          {/* Grille d'équipements avec vraies photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Jacuzzi extérieur */}
            <Link href="/gallery?filter=wellness" className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/ExteriieurJacuzi.webp"
                  alt="Jacuzzi"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">♨️</div>
                  <h3 className="text-xl font-bold">{t({ en: 'Outdoor Hot Tub', fr: 'Jacuzzi Extérieur' })}</h3>
                  <p className="text-sm text-white/90">{t({ en: 'Mountain views', fr: 'Vue montagne' })}</p>
                </div>
              </div>
            </Link>

            {/* Cuisine équipée */}
            <Link href="/gallery?filter=kitchen" className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Cuisine1.webp"
                  alt="Cuisine"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">🍳</div>
                  <h3 className="text-xl font-bold">{t({ en: 'Gourmet Kitchen', fr: 'Cuisine Gastronomique' })}</h3>
                  <p className="text-sm text-white/90">{t({ en: 'Fully equipped', fr: 'Entièrement équipée' })}</p>
                </div>
              </div>
            </Link>

            {/* Salon avec cheminée */}
            <Link href="/gallery?filter=living" className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Fauteuil.webp"
                  alt="Salon"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">🔥</div>
                  <h3 className="text-xl font-bold">{t({ en: 'Stone Fireplace', fr: 'Cheminée en Pierre' })}</h3>
                  <p className="text-sm text-white/90">{t({ en: 'Cozy atmosphere', fr: 'Ambiance chaleureuse' })}</p>
                </div>
              </div>
            </Link>

            {/* Terrasse avec vue */}
            <Link href="/gallery?filter=exterior" className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Terrasse1.webp"
                  alt="Terrasse"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">🌄</div>
                  <h3 className="text-xl font-bold">{t({ en: 'Mountain Terrace', fr: 'Terrasse Montagne' })}</h3>
                  <p className="text-sm text-white/90">{t({ en: 'Outdoor furniture & BBQ', fr: 'Mobilier extérieur & BBQ' })}</p>
                </div>
              </div>
            </Link>

            {/* Chambres confortables */}
            <Link href="/gallery?filter=bedroom" className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Chambre4.webp"
                  alt="Chambre"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">🛏️</div>
                  <h3 className="text-xl font-bold">{t({ en: '4 Bedrooms', fr: '4 Chambres' })}</h3>
                  <p className="text-sm text-white/90">{t({ en: 'Up to 10 guests', fr: 'Jusqu\'à 10 personnes' })}</p>
                </div>
              </div>
            </Link>

            {/* Salles de bain modernes */}
            <Link href="/gallery?filter=bathroom" className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/SalledeBain1.webp"
                  alt="Salle de bain"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl mb-2">🚿</div>
                  <h3 className="text-xl font-bold">{t({ en: '2 Modern Bathrooms', fr: '2 Salles de Bain Modernes' })}</h3>
                  <p className="text-sm text-white/90">{t({ en: 'Shower & bathtub', fr: 'Douche & baignoire' })}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Équipements additionnels en liste compacte */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t({ en: 'Additional Amenities', fr: 'Équipements Supplémentaires' })}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">📶</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: 'High-Speed WiFi', fr: 'WiFi Haut Débit' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">📺</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: '65" Smart TV', fr: 'Smart TV 65"' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">🚗</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: '5 Parking Spaces', fr: '5 Places Parking' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">⛷️</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: 'Ski Room', fr: 'Local à Skis' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">🔆</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: 'Heated Floors', fr: 'Sols Chauffants' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">☕</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: 'Nespresso', fr: 'Nespresso' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">🧺</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: 'Laundry', fr: 'Buanderie' })}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">🍖</span>
                <span className="text-sm font-medium text-gray-800">{t({ en: 'BBQ', fr: 'Barbecue' })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Resorts */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-50">
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

      {/* Testimonials */}
      <section className="py-12 md:py-14 bg-gradient-to-b from-gray-50 to-white">
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
