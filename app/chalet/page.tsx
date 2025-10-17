'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, specs, description, amenities, galleryImages } from '@/lib/data/chalet';

export default function ChaletPage() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images pour le hero carousel
  const heroImages = [
    '/images/exterieur_terrase_devant.webp',
    '/images/Salon2.webp',
    '/images/ExteriieurJacuzi.webp',
    '/images/Cuisine1.webp',
  ];

  // Auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const rooms = [
    {
      name: { en: 'Master Suite', fr: 'Suite Master' },
      description: { en: 'Luxurious upstairs suite with walk-in dressing room, breathtaking mountain panorama, private balcony access, climate control, and children\'s bed on request', fr: 'Suite luxueuse à l\'étage avec dressing, panorama montagneux à couper le souffle, accès balcon privé, climatisation, et lit enfant sur demande' },
      icon: '🛏️',
      image: '/images/Chambre4.webp',
    },
    {
      name: { en: 'Garden View Bedroom', fr: 'Chambre Vue Jardin' },
      description: { en: 'Ground floor bedroom with comfortable queen-size bed overlooking the private garden, authentic alpine closet with traditional wood finishes', fr: 'Chambre au rez-de-chaussée avec confortable lit queen-size donnant sur le jardin privé, penderie alpine authentique aux finitions bois traditionnelles' },
      icon: '🛏️',
      image: '/images/Chambre23.webp',
    },
    {
      name: { en: 'Children\'s Bedroom', fr: 'Chambre Enfants' },
      description: { en: 'Three single beds in a cheerful, family-friendly space with playful mountain-themed décor and dedicated storage closet', fr: 'Trois lits simples dans un espace familial chaleureux avec décoration ludique aux thèmes montagnards et penderie dédiée' },
      icon: '🛏️',
      image: '/images/ChambreDortoir.webp',
    },
    {
      name: { en: 'Living Room', fr: 'Salon Principal' },
      description: { en: 'Grand living space featuring authentic stone fireplace with complimentary firewood, premium leather sofas, 65" Smart TV with Netflix and Amazon Prime, heated floors, and floor-to-ceiling windows showcasing spectacular Alpine panoramas', fr: 'Grand espace de vie avec authentique cheminée en pierre avec bois gratuit, canapés cuir premium, Smart TV 65" avec Netflix et Amazon Prime, sols chauffants, et baies vitrées offrant des panoramas alpins spectaculaires' },
      icon: '🛋️',
      image: '/images/Salon1.webp',
    },
    {
      name: { en: 'Gourmet Kitchen', fr: 'Cuisine Gastronomique' },
      description: { en: 'Authentic Savoyard kitchen fully equipped: professional oven, traditional gas range, premium dishwasher, Nespresso machine, toaster, kettle, and grand dining table seating 10 guests with all cooking utensils provided', fr: 'Authentique cuisine savoyarde entièrement équipée : four professionnel, piano à gaz traditionnel, lave-vaisselle haut de gamme, machine Nespresso, grille-pain, bouilloire, et grande table conviviale pour 10 convives avec tous ustensiles fournis' },
      icon: '🍳',
      image: '/images/Cuisine2.webp',
    },
    {
      name: { en: 'Luxury Bathrooms', fr: 'Salles de Bain de Luxe' },
      description: { en: 'Two designer bathrooms: master bathroom with oversized Italian shower and double vanity with heated towel rails; family bathroom with deep soaking tub, separate shower, and elegant fixtures', fr: 'Deux salles de bain design : salle de bain master avec grande douche italienne et double vasque avec sèche-serviettes chauffants ; salle familiale avec baignoire profonde, douche séparée, et élégants équipements' },
      icon: '🚿',
      image: '/images/SalledeBain1.webp',
    },
    {
      name: { en: 'Alpine Outdoor Paradise', fr: 'Paradis Extérieur Alpin' },
      description: { en: 'Expansive terrace with premium outdoor furniture, professional BBQ station, outdoor hot tub with breathtaking mountain views, manicured private garden, and convenient 5-space private parking with ski room featuring boot warmers', fr: 'Vaste terrasse avec mobilier extérieur haut de gamme, station BBQ professionnelle, jacuzzi extérieur avec vue montagne à couper le souffle, jardin privé paysagé, et parking privé pratique de 5 places avec local à skis équipé de chauffe-chaussures' },
      icon: '🌲',
      image: '/images/Terrasse1.webp',
    },
  ];

  const specifications = [
    { label: { en: 'Total Surface', fr: 'Surface Totale' }, value: `${specs.surface}m²`, icon: '📏' },
    { label: { en: 'Capacity', fr: 'Capacité' }, value: `${specs.capacity}`, icon: '👥' },
    { label: { en: 'Bedrooms', fr: 'Chambres' }, value: specs.bedrooms.toString(), icon: '🛏️' },
    { label: { en: 'Bathrooms', fr: 'Salles de Bain' }, value: specs.bathrooms.toString(), icon: '🚿' },
    { label: { en: 'Parking', fr: 'Parking' }, value: `${specs.parkingSpaces}`, icon: '🚗' },
  ];

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt="Chalet"
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        {/* Contenu centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">
              {t({ en: 'The Chalet', fr: 'Le Chalet' })}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 md:mb-8">
              {t({ en: 'Luxury & Authenticity', fr: 'Luxe & Authenticité' })}
            </p>

            {/* Badges specs */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {specifications.map((spec, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-md border border-white/30 px-3 md:px-4 py-2 rounded-full">
                  <span className="text-white font-semibold text-xs sm:text-sm md:text-base">
                    {spec.icon} {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6 md:w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Galerie moderne par catégories - Design épuré */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Grid masonry moderne avec grandes photos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {/* Living Room - Large featured */}
            <Link
              href="/gallery?filter=living"
              className="col-span-2 md:col-span-2 md:row-span-2 relative h-[280px] md:h-[500px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/images/Salon1.webp"
                alt="Living Room"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl md:text-4xl">🛋️</span>
                  <h3 className="text-xl md:text-3xl font-bold text-white">{t({ en: 'Living Room', fr: 'Salon' })}</h3>
                </div>
                <p className="text-white/80 text-xs md:text-sm">{t({ en: 'Fireplace • Smart TV • Alpine views', fr: 'Cheminée • Smart TV • Vue alpine' })}</p>
              </div>
            </Link>

            {/* Kitchen */}
            <Link
              href="/gallery?filter=kitchen"
              className="relative h-[140px] md:h-[240px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/images/Cuisine2.webp"
                alt="Kitchen"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xl md:text-2xl">🍳</span>
                  <h3 className="text-sm md:text-lg font-bold text-white">{t({ en: 'Kitchen', fr: 'Cuisine' })}</h3>
                </div>
              </div>
            </Link>

            {/* Bedroom */}
            <Link
              href="/gallery?filter=bedroom"
              className="relative h-[140px] md:h-[240px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/images/Chambre4.webp"
                alt="Bedroom"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xl md:text-2xl">🛏️</span>
                  <h3 className="text-sm md:text-lg font-bold text-white">{t({ en: 'Bedrooms', fr: 'Chambres' })}</h3>
                </div>
              </div>
            </Link>

            {/* Bathroom */}
            <Link
              href="/gallery?filter=bathroom"
              className="relative h-[140px] md:h-[260px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/images/SalledeBain1.webp"
                alt="Bathroom"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xl md:text-2xl">🚿</span>
                  <h3 className="text-sm md:text-lg font-bold text-white">{t({ en: 'Bathrooms', fr: 'Salles de Bain' })}</h3>
                </div>
              </div>
            </Link>

            {/* Hot Tub - Featured */}
            <Link
              href="/gallery?filter=wellness"
              className="col-span-2 md:col-span-1 relative h-[200px] md:h-[260px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/images/ExteriieurJacuzi.webp"
                alt="Hot Tub"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl md:text-3xl">♨️</span>
                  <h3 className="text-base md:text-xl font-bold text-white">{t({ en: 'Hot Tub', fr: 'Jacuzzi' })}</h3>
                </div>
                <p className="text-white/80 text-xs md:text-sm">{t({ en: 'Mountain views', fr: 'Vue montagne' })}</p>
              </div>
            </Link>

            {/* Exterior - Large featured */}
            <Link
              href="/gallery?filter=exterior"
              className="col-span-2 md:col-span-2 relative h-[240px] md:h-[320px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/images/ExterieurBalcon.webp"
                alt="Exterior"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl md:text-4xl">🏔️</span>
                  <h3 className="text-xl md:text-3xl font-bold text-white">{t({ en: 'Exterior', fr: 'Extérieur' })}</h3>
                </div>
                <p className="text-white/80 text-xs md:text-sm">{t({ en: 'Terrace • BBQ • Private parking', fr: 'Terrasse • BBQ • Parking privé' })}</p>
              </div>
            </Link>
          </div>

          {/* CTA vers galerie complète - Compact */}
          <div className="text-center mt-6 md:mt-8">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold text-sm md:text-base transition-colors group"
            >
              <span>{t({ en: 'View all photos', fr: 'Voir toutes les photos' })}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
            {t({ en: '360° Virtual Tour', fr: 'Visite Virtuelle 360°' })}
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 text-center max-w-3xl mx-auto">
            {t({
              en: 'Explore every corner of the chalet from the comfort of your home with our immersive virtual tour.',
              fr: 'Explorez chaque recoin du chalet depuis chez vous avec notre visite virtuelle immersive.',
            })}
          </p>
          <div className="bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://view.ricoh360.com/1b07e554-b9eb-4b08-9b18-2940ab2496ea"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              className="w-full md:h-[600px]"
              title={t({ en: '360° Virtual Tour of the Chalet', fr: 'Visite Virtuelle 360° du Chalet' })}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900">
            {t({ en: 'Ready to Experience This?', fr: 'Prêt à Vivre Cette Expérience ?' })}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8">
            {t({ en: 'Check our rates and book your stay', fr: 'Consultez nos tarifs et réservez votre séjour' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
            </Link>
            <Link
              href="/location"
              className="inline-block border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300"
            >
              {t({ en: 'Explore Location', fr: 'Découvrir la Localisation' })}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
