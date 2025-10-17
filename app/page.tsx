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
                    <span>🍽️</span>
                    <span>{t({ en: 'Dining Table for 10', fr: 'Table pour 10 convives' })}</span>
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
                    en: 'Upstairs retreat with panoramic mountain views and private balcony. Features a spacious walk-in dressing and climate control for year-round comfort.',
                    fr: 'Refuge à l\'étage avec vue panoramique sur les montagnes et balcon privé. Dispose d\'un spacieux dressing et climatisation pour un confort toute l\'année.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: 'King 180x200 + Child bed available', fr: 'King 180x200 + Lit enfant disponible' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Walk-in Dressing Room', fr: 'Dressing Walk-in' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>❄️</span>
                    <span>{t({ en: 'Air Conditioning', fr: 'Climatisation' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 2 - Chambre du Bas avec Vue Jardin */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/Chambre23.webp"
                  alt="Chambre Vue Jardin"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Garden View Bedroom', fr: 'Chambre Vue Jardin' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Peaceful ground floor room overlooking the private garden. Combines comfort with authentic Alpine charm through traditional wood furnishings.',
                    fr: 'Chambre paisible au rez-de-chaussée donnant sur le jardin privé. Allie confort et charme alpin authentique grâce à des meubles traditionnels en bois.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: 'Queen Bed 160x200', fr: 'Lit Queen 160x200' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Alpine Wardrobe', fr: 'Armoire Alpine' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌿</span>
                    <span>{t({ en: 'Garden Outlook', fr: 'Vue sur Jardin' })}</span>
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
                    en: 'Versatile bedroom perfect for couples or small groups. Modular bed configuration adapts to your needs.',
                    fr: 'Chambre polyvalente parfaite pour couples ou petits groupes. Configuration de lits modulable selon vos besoins.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: 'Flexible: 1 Double + 1 Single OR 3 Singles', fr: 'Modulable: 1 Double + 1 Simple OU 3 Simples' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Compact Storage', fr: 'Rangement Compact' })}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chambre 4 - Chambre Enfants */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/ChambreDortoir.webp"
                  alt="Chambre Enfants"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{t({ en: 'Children\'s Bedroom', fr: 'Chambre Enfants' })}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {t({
                    en: 'Cheerful family space ideal for children or additional guests. Adaptable layout suits various group configurations.',
                    fr: 'Espace familial joyeux idéal pour enfants ou invités supplémentaires. Agencement adaptable convient à diverses configurations de groupe.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛏️</span>
                    <span>{t({ en: '3 Singles OR 1 Double + 1 Single', fr: '3 Simples OU 1 Double + 1 Simple' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚪</span>
                    <span>{t({ en: 'Storage Space', fr: 'Espace Rangement' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>👨‍👩‍👧‍👦</span>
                    <span>{t({ en: 'Family-Friendly', fr: 'Adapté Familles' })}</span>
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
                    en: 'Contemporary design meets luxury with walk-in shower and dual sinks. Heated rails add a premium touch.',
                    fr: 'Design contemporain rencontre le luxe avec douche à l\'italienne et double vasque. Sèche-serviettes pour une touche premium.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🚿</span>
                    <span>{t({ en: 'Walk-in Shower', fr: 'Douche Italienne' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪞</span>
                    <span>{t({ en: 'Dual Sinks', fr: 'Double Vasque' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>{t({ en: 'Towel Warmer', fr: 'Chauffe-Serviettes' })}</span>
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
                    en: 'Generous wellness space featuring a soaking tub perfect for après-ski relaxation. Independent shower adds practicality.',
                    fr: 'Généreux espace bien-être avec baignoire idéale pour l\'après-ski. Douche indépendante pour plus de praticité.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🛁</span>
                    <span>{t({ en: 'Soaking Tub', fr: 'Baignoire Relaxante' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚿</span>
                    <span>{t({ en: 'Independent Shower', fr: 'Douche Indépendante' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✨</span>
                    <span>{t({ en: 'Premium Finishes', fr: 'Finitions Premium' })}</span>
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
                    en: 'Unwind in your private outdoor spa under alpine skies. Heated year-round for après-ski bliss.',
                    fr: 'Détendez-vous dans votre spa extérieur privé sous le ciel alpin. Chauffé toute l\'année pour un moment après-ski parfait.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>♨️</span>
                    <span>{t({ en: 'All-Season Heating', fr: 'Chauffage 4 Saisons' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌟</span>
                    <span>{t({ en: 'Evening Ambiance', fr: 'Ambiance Nocturne' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏔️</span>
                    <span>{t({ en: 'Alpine Panorama', fr: 'Panorama Alpin' })}</span>
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
                    en: 'Generous outdoor living area equipped for memorable mountain dining experiences. Enjoy summer cookouts with breathtaking scenery.',
                    fr: 'Généreux espace de vie extérieur équipé pour des moments gastronomiques inoubliables. Profitez de grillades estivales avec panorama exceptionnel.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🍖</span>
                    <span>{t({ en: 'BBQ & Plancha', fr: 'Barbecue & Plancha' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🪑</span>
                    <span>{t({ en: 'Lounge Seating', fr: 'Salon d\'Extérieur' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌄</span>
                    <span>{t({ en: 'Scenic Backdrop', fr: 'Décor Naturel' })}</span>
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
                    en: 'Ample vehicle storage plus organized gear space. Everything you need for hassle-free mountain adventures.',
                    fr: 'Grand parking véhicules et espace équipement organisé. Tout pour des aventures en montagne sans tracas.'
                  })}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>🚗</span>
                    <span>{t({ en: '5 Vehicle Spaces', fr: '5 Places Véhicules' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>⛷️</span>
                    <span>{t({ en: 'Equipment Storage', fr: 'Stockage Équipement' })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>👢</span>
                    <span>{t({ en: 'Boot Warmers', fr: 'Chauffe-Chaussures' })}</span>
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
