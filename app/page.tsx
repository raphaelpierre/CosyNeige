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

        {/* Badges informatifs - Optimisés mobile et desktop */}
        <div className="absolute bottom-16 md:bottom-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Badges compacts */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 md:gap-3">
              {/* Surface */}
              <div className="bg-white/25 backdrop-blur-lg border border-white/50 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-xl hover:bg-white/35 transition-all flex items-center gap-1.5 sm:gap-2">
                <div className="text-base sm:text-lg md:text-xl">🏔️</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-bold text-xs sm:text-sm md:text-base"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    180m²
                  </span>
                </div>
              </div>

              {/* Capacité */}
              <div className="bg-white/25 backdrop-blur-lg border border-white/50 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-xl hover:bg-white/35 transition-all flex items-center gap-1.5 sm:gap-2">
                <div className="text-base sm:text-lg md:text-xl">👥</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-bold text-xs sm:text-sm md:text-base"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    10-12
                  </span>
                  <span className="text-white/90 text-xs sm:text-xs md:text-sm"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    {t({ en: 'guests', fr: 'pers.' })}
                  </span>
                </div>
              </div>

              {/* Chambres */}
              <div className="bg-white/25 backdrop-blur-lg border border-white/50 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-xl hover:bg-white/35 transition-all flex items-center gap-1.5 sm:gap-2">
                <div className="text-base sm:text-lg md:text-xl">🛏️</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-bold text-xs sm:text-sm md:text-base"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    5
                  </span>
                  <span className="text-white/90 text-xs sm:text-xs md:text-sm"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    {t({ en: 'rooms', fr: 'ch.' })}
                  </span>
                </div>
              </div>

              {/* Jacuzzi */}
              <div className="bg-white/25 backdrop-blur-lg border border-white/50 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-xl hover:bg-white/35 transition-all flex items-center gap-1.5 sm:gap-2">
                <div className="text-base sm:text-lg md:text-xl">♨️</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-bold text-xs sm:text-sm md:text-base"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    Jacuzzi
                  </span>
                </div>
              </div>

              {/* Localisation */}
              <div className="bg-white/25 backdrop-blur-lg border border-white/50 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-xl hover:bg-white/35 transition-all flex items-center gap-1.5 sm:gap-2">
                <div className="text-base sm:text-lg md:text-xl">⛷️</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-bold text-xs sm:text-sm md:text-base"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    5
                  </span>
                  <span className="text-white/90 text-xs sm:text-xs md:text-sm"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    {t({ en: 'resorts', fr: 'stations' })}
                  </span>
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
      <section className="py-8 sm:py-12 bg-white">
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
      <section className="pt-4 pb-8 md:pt-6 md:pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Badge */}
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold shadow-lg">
              <span className="text-xl">🏠</span>
              <span>{t({ en: 'Inside the Chalet', fr: 'À l\'Intérieur du Chalet' })}</span>
            </div>
          </div>

          {/* Grille des pièces */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Salon */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/VueSalonBas.webp"
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
                    en: 'Authentic Savoyard kitchen fully equipped with traditional charm. Perfect for preparing hearty mountain meals after a day on the slopes.',
                    fr: 'Authentique cuisine savoyarde entièrement équipée au charme traditionnel. Parfaite pour préparer de copieux repas montagnards après une journée sur les pistes.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🍳</span>
                    <span>{t({ en: 'Traditional Gas Range', fr: 'Piano à gaz traditionnel' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>☕</span>
                    <span>{t({ en: 'Nespresso Machine', fr: 'Machine Nespresso' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>{t({ en: 'Dining Table for 10', fr: 'Table pour 10 convives' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 1 - Suite Master */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Chambre4.webp"
                  alt="Suite Master"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Master Suite', fr: 'Suite Master' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Luxurious suite with walk-in dressing room, breathtaking mountain panorama, private balcony access, and climate control.',
                    fr: 'Suite luxueuse avec dressing, panorama montagneux à couper le souffle, accès balcon privé et climatisation.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: 'King Bed 180x200 + Child Bed 70x140', fr: 'Lit King Size 180x200 + Lit enfant 70x140' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Double Walk-in Dressing', fr: 'Double Dressing' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏔️</span>
                    <span>{t({ en: 'Balcony Access', fr: 'Accès Balcon' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 2 - Émeraude */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Chambre23.webp"
                  alt="Chambre Émeraude"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Emerald Room', fr: 'Chambre Émeraude' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Elegant room with flexible sleeping arrangements. Can be configured as 1 double bed (160x200) + 1 single bed (80x200) or 3 single beds (80x200).',
                    fr: 'Chambre élégante avec couchages modulables. Configuration en 1 lit double 160x200 + 1 lit simple 80x200 ou 3 lits simples 80x200.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: '1 Double 160x200 + 1 Single 80x200 OR 3 Singles 80x200', fr: '1 lit double 160x200 + 1 simple 80x200 OU 3 lits simples 80x200' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Double Walk-in Dressing', fr: 'Double Dressing' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏔️</span>
                    <span>{t({ en: 'Balcony Access', fr: 'Accès Balcon' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 3 - Saphir */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/ChambreDortoir2.webp"
                  alt="Chambre Saphir"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Sapphire Room', fr: 'Chambre Saphir' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Cozy room with flexible sleeping: 3 single beds (80x200) or modular setup as 1 double (160x200) + 1 single (80x200).',
                    fr: 'Chambre cosy avec couchages flexibles : 3 lits simples 80x200 modulables en 1 lit double 160x200 + 1 lit simple 80x200.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: '3 Singles 80x200 OR 1 Double 160x200 + 1 Single 80x200', fr: '3 lits simples 80x200 OU 1 double 160x200 + 1 simple 80x200' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌿</span>
                    <span>{t({ en: 'Small Closet', fr: 'Petite Penderie' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪑</span>
                    <span>{t({ en: 'Compact Design', fr: 'Design Compact' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 4 - Dortoir Familial */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/ChambreDortoir.webp"
                  alt="Dortoir Familial"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Family Dormitory', fr: 'Dortoir Familial' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Ground floor bedroom with double bed (160x200) and traditional alpine wardrobe.',
                    fr: 'Chambre au rez-de-chaussée avec lit double 160x200 et armoire traditionnelle alpine avec penderie.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: 'Double Bed 160x200', fr: 'Lit Double 160x200' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Traditional Wardrobe', fr: 'Armoire Traditionnelle' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪑</span>
                    <span>{t({ en: 'Ground Floor Access', fr: 'Accès Rez-de-Chaussée' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 5 - Rubis (removed - now using Family Dormitory as Chambre d'en bas) */}

            {/* Salle de Bain 1 - Suite Prestige */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/SalledeBain1.webp"
                  alt="Salle de bain Suite Prestige"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Prestige Suite Bathroom', fr: 'Salle de Bain Suite Prestige' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Designer master bathroom with oversized Italian shower, double vanity, and heated towel rails for ultimate comfort.',
                    fr: 'Salle de bain master design avec grande douche italienne, double vasque et sèche-serviettes chauffants pour un confort optimal.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🚿</span>
                    <span>{t({ en: 'Italian Shower', fr: 'Douche Italienne' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪞</span>
                    <span>{t({ en: 'Double Vanity', fr: 'Double Vasque' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>{t({ en: 'Heated Towel Rails', fr: 'Sèche-Serviettes' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Salle de Bain 2 - Spa Familial */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/salleDebain_GrabnBaignire.webp"
                  alt="Salle de bain Spa Familial"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Family Spa Bathroom', fr: 'Salle de Bain Spa Familial' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Spacious family bathroom with deep soaking tub, separate shower, and elegant fixtures for relaxing moments.',
                    fr: 'Spacieuse salle de bain familiale avec baignoire profonde, douche séparée et élégants équipements pour des moments de détente.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛁</span>
                    <span>{t({ en: 'Deep Bathtub', fr: 'Baignoire Profonde' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚿</span>
                    <span>{t({ en: 'Separate Shower', fr: 'Douche Séparée' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💫</span>
                    <span>{t({ en: 'Elegant Fixtures', fr: 'Équipements Élégants' })}</span>
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
                    en: 'Spacious terrace with outdoor furniture, BBQ and plancha. Perfect for al fresco dining with stunning alpine views.',
                    fr: 'Grande terrasse avec mobilier extérieur, barbecue et plancha. Parfaite pour les repas en plein air avec vue alpine imprenable.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🍖</span>
                    <span>{t({ en: 'BBQ & Plancha', fr: 'Barbecue & Plancha' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪑</span>
                    <span>{t({ en: 'Outdoor Furniture', fr: 'Mobilier extérieur' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌄</span>
                    <span>{t({ en: 'Mountain Views', fr: 'Vue Montagne' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Parking & Local à Skis */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Chalet_Exterieur.webp"
                  alt="Parking et accès"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Parking & Ski Room', fr: 'Parking & Local Skis' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Convenient 5-space private parking with dedicated ski room for all your winter sports equipment.',
                    fr: 'Parking privé pratique de 5 places avec local à skis dédié pour tout votre équipement de sports d\'hiver.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🚗</span>
                    <span>{t({ en: '5 Parking Spaces', fr: '5 Places de Parking' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>⛷️</span>
                    <span>{t({ en: 'Ski Room', fr: 'Local à Skis' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏔️</span>
                    <span>{t({ en: 'Direct Access', fr: 'Accès Direct' })}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lien vers galerie */}
          <div className="mt-6 text-center">
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

      {/* Virtual Tour Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold shadow-lg">
              <span className="text-xl">360°</span>
              <span>{t({ en: 'Virtual Tour', fr: 'Visite Virtuelle' })}</span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://view.ricoh360.com/1b07e554-b9eb-4b08-9b18-2940ab2496ea"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              className="w-full h-[400px] md:h-[600px]"
              title={t({ en: '360° Virtual Tour of the Chalet', fr: 'Visite Virtuelle 360° du Chalet' })}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>{t({ en: 'Check Availability', fr: 'Voir Disponibilités' })}</span>
              <span>→</span>
            </Link>
            <Link
              href="/location"
              className="inline-flex items-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300"
            >
              <span>{t({ en: 'Explore Location', fr: 'Découvrir la Région' })}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
