'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName } from '@/lib/data/chalet';

export default function HomePage() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images du hero carousel - focus sur le chalet enneigé et jacuzzi
  const heroImages = [
    { src: '/images/chalet_neige_devant.webp', alt: 'Chalet en hiver' },
    { src: '/images/jacusi.webp', alt: 'Jacuzzi de nuit' },
    { src: '/images/ExteriieurJacuzi.webp', alt: 'Jacuzzi de jour' },
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

        {/* Badges informatifs - Repositionnés pour mieux comprendre le chalet */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
            {/* Grille de badges descriptifs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
              {/* Surface */}
              <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl px-3 py-3 md:px-5 md:py-4 shadow-2xl hover:bg-white/30 transition-all">
                <div className="text-2xl md:text-3xl mb-1">🏔️</div>
                <div className="text-white font-bold text-lg md:text-xl"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                  180m²
                </div>
                <div className="text-white/90 text-xs md:text-sm"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {t({ en: 'Chalet', fr: 'Chalet' })}
                </div>
              </div>

              {/* Capacité */}
              <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl px-3 py-3 md:px-5 md:py-4 shadow-2xl hover:bg-white/30 transition-all">
                <div className="text-2xl md:text-3xl mb-1">👥</div>
                <div className="text-white font-bold text-lg md:text-xl"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                  10-12
                </div>
                <div className="text-white/90 text-xs md:text-sm"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {t({ en: 'Guests', fr: 'Personnes' })}
                </div>
              </div>

              {/* Chambres */}
              <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl px-3 py-3 md:px-5 md:py-4 shadow-2xl hover:bg-white/30 transition-all">
                <div className="text-2xl md:text-3xl mb-1">🛏️</div>
                <div className="text-white font-bold text-lg md:text-xl"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                  5
                </div>
                <div className="text-white/90 text-xs md:text-sm"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {t({ en: 'Bedrooms', fr: 'Chambres' })}
                </div>
              </div>

              {/* Jacuzzi */}
              <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl px-3 py-3 md:px-5 md:py-4 shadow-2xl hover:bg-white/30 transition-all">
                <div className="text-2xl md:text-3xl mb-1">♨️</div>
                <div className="text-white font-bold text-lg md:text-xl"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                  {t({ en: 'Hot Tub', fr: 'Jacuzzi' })}
                </div>
                <div className="text-white/90 text-xs md:text-sm"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {t({ en: 'Private', fr: 'Privé' })}
                </div>
              </div>

              {/* Localisation */}
              <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl px-3 py-3 md:px-5 md:py-4 shadow-2xl hover:bg-white/30 transition-all col-span-2 md:col-span-1">
                <div className="text-2xl md:text-3xl mb-1">⛷️</div>
                <div className="text-white font-bold text-lg md:text-xl"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                  {t({ en: '5 Resorts', fr: '5 Stations' })}
                </div>
                <div className="text-white/90 text-xs md:text-sm"
                     style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {t({ en: 'Nearby', fr: 'À proximité' })}
                </div>
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

      {/* Section Pièces du Chalet */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Titre */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold mb-4 shadow-lg">
              <span className="text-xl">🏠</span>
              <span>{t({ en: 'Inside the Chalet', fr: 'À l\'Intérieur du Chalet' })}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Discover Each Room', fr: 'Découvrez Chaque Pièce' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t({
                en: '180m² of carefully designed space, where alpine charm meets modern comfort. Every room tells a story of warmth and elegance.',
                fr: '180m² d\'espace soigneusement conçu, où le charme alpin rencontre le confort moderne. Chaque pièce raconte une histoire de chaleur et d\'élégance.'
              })}
            </p>
          </div>

          {/* Grille des pièces */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Salon */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Salon2.webp"
                  alt="Salon"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Living Room', fr: 'Salon' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Spacious living area with fireplace, comfortable seating, and panoramic mountain views. The heart of the chalet.',
                    fr: 'Vaste espace de vie avec cheminée, sièges confortables et vues panoramiques sur les montagnes. Le cœur du chalet.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>{t({ en: 'Fireplace', fr: 'Cheminée' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📺</span>
                    <span>{t({ en: 'Smart TV', fr: 'TV connectée' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏔️</span>
                    <span>{t({ en: 'Mountain Views', fr: 'Vue Montagne' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cuisine */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Cuisine2.webp"
                  alt="Cuisine"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Kitchen', fr: 'Cuisine' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Fully equipped modern kitchen with high-end appliances. Perfect for preparing hearty meals after a day on the slopes.',
                    fr: 'Cuisine moderne entièrement équipée avec appareils haut de gamme. Parfaite pour préparer de copieux repas après une journée sur les pistes.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🍳</span>
                    <span>{t({ en: 'Full Equipment', fr: 'Équipement complet' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>☕</span>
                    <span>{t({ en: 'Coffee Machine', fr: 'Machine à café' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>{t({ en: 'Dining Area', fr: 'Coin repas' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambres */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Chambre3.webp"
                  alt="Chambre"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Bedrooms', fr: 'Chambres' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: '5 cozy bedrooms designed for restful nights. Quality bedding and peaceful mountain atmosphere.',
                    fr: '5 chambres douillettes conçues pour des nuits reposantes. Literie de qualité et atmosphère paisible de montagne.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: '5 Bedrooms', fr: '5 Chambres' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{t({ en: '10-12 Guests', fr: '10-12 Personnes' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌙</span>
                    <span>{t({ en: 'Quality Bedding', fr: 'Literie qualité' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Salle de Bain */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/SalledeBain1.webp"
                  alt="Salle de bain"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Bathrooms', fr: 'Salles de Bain' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Modern bathrooms with premium fixtures. Comfort and elegance for your daily routine.',
                    fr: 'Salles de bain modernes avec équipements haut de gamme. Confort et élégance pour votre routine quotidienne.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🚿</span>
                    <span>{t({ en: 'Walk-in Showers', fr: 'Douches italiennes' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🛁</span>
                    <span>{t({ en: 'Bathtub', fr: 'Baignoire' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💫</span>
                    <span>{t({ en: 'Modern Design', fr: 'Design moderne' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Jacuzzi */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/jacusi.webp"
                  alt="Jacuzzi"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Hot Tub', fr: 'Jacuzzi' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Private outdoor hot tub with stunning mountain views. The perfect way to relax after skiing.',
                    fr: 'Jacuzzi extérieur privé avec vue imprenable sur les montagnes. Le moyen parfait pour se détendre après le ski.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>♨️</span>
                    <span>{t({ en: 'Heated Year-Round', fr: 'Chauffé toute l\'année' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌟</span>
                    <span>{t({ en: 'Stargazing', fr: 'Vue sur étoiles' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏔️</span>
                    <span>{t({ en: 'Mountain Views', fr: 'Vue Montagne' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Terrasse */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Terrasse1.webp"
                  alt="Terrasse"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Terrace', fr: 'Terrasse' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Spacious terrace with outdoor furniture. Enjoy breakfast with alpine views or evening aperitifs.',
                    fr: 'Grande terrasse avec mobilier extérieur. Profitez du petit-déjeuner avec vue alpine ou des apéritifs en soirée.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🌄</span>
                    <span>{t({ en: 'Panoramic Views', fr: 'Vue panoramique' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪑</span>
                    <span>{t({ en: 'Outdoor Furniture', fr: 'Mobilier extérieur' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>{t({ en: 'Sun All Day', fr: 'Soleil toute la journée' })}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lien vers galerie */}
          <div className="mt-8 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
            >
              <span>{t({ en: 'View Full Gallery', fr: 'Voir la Galerie Complète' })}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
