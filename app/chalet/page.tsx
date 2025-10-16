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
      name: { en: 'Ground Floor Bedroom', fr: 'Chambre Rez-de-Chaussée' },
      description: { en: 'Elegant queen-size bed with premium bedding, peaceful garden views, spacious traditional alpine wardrobe with ample storage', fr: 'Élégant lit queen-size avec literie premium, vue paisible sur jardin, spacieuse armoire alpine traditionnelle avec grand rangement' },
      icon: '🛏️',
      image: '/images/Chambre3.webp',
    },
    {
      name: { en: 'Master Bedroom', fr: 'Suite Master' },
      description: { en: 'Luxurious suite with walk-in dressing room, breathtaking mountain panorama, private balcony access, climate control, and children\'s bed on request', fr: 'Suite luxueuse avec dressing, panorama montagneux à couper le souffle, accès balcon privé, climatisation, et lit enfant sur demande' },
      icon: '🛏️',
      image: '/images/Chambre4.webp',
    },
    {
      name: { en: 'Garden View Bedroom', fr: 'Chambre Vue Jardin' },
      description: { en: 'Comfortable queen-size bed overlooking the private garden, authentic alpine closet with traditional wood finishes', fr: 'Confortable lit queen-size donnant sur le jardin privé, penderie alpine authentique aux finitions bois traditionnelles' },
      icon: '🛏️',
      image: '/images/Chambre3.webp',
    },
    {
      name: { en: 'Children\'s Bedroom', fr: 'Chambre des Enfants' },
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

      {/* Description avec image */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                {chaletName}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
                {t(description)}
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {t({
                  en: 'Our chalet combines traditional Savoyard architecture with modern luxury. Every detail has been carefully chosen to create a warm and refined atmosphere, perfect for unforgettable family or friends gatherings.',
                  fr: 'Notre chalet allie architecture savoyarde traditionnelle et luxe moderne. Chaque détail a été soigneusement choisi pour créer une atmosphère chaleureuse et raffinée, parfaite pour des séjours inoubliables en famille ou entre amis.',
                })}
              </p>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/chalet_neige_devant.webp"
                alt="Chalet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pièces avec grandes images */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Every Room, A Story', fr: 'Chaque Pièce, Une Histoire' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t({
                en: 'Discover each space designed for your comfort and enjoyment',
                fr: 'Découvrez chaque espace conçu pour votre confort et plaisir'
              })}
            </p>
          </div>

          <div className="space-y-0">
            {rooms.map((room, index) => (
              <div
                key={index}
                className={`relative h-[60vh] md:h-[70vh] overflow-hidden ${index > 0 ? 'mt-0' : ''}`}
              >
                <Image
                  src={room.image}
                  alt={t(room.name)}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Alternance gauche/droite du texte */}
                <div className={`absolute inset-0 bg-gradient-to-${index % 2 === 0 ? 'r' : 'l'} from-black/80 via-black/50 to-transparent`} />
                <div className="absolute inset-0 flex items-center">
                  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${index % 2 === 0 ? '' : 'text-right'}`}>
                    <div className={`max-w-xl ${index % 2 === 0 ? '' : 'ml-auto'}`}>
                      <div className="text-5xl md:text-6xl mb-4 md:mb-6">{room.icon}</div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                        {t(room.name)}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                        {t(room.description)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grille amenities compacte */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
            {t({ en: 'All Amenities', fr: 'Tous les Équipements' })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl p-4 md:p-6 transition-all duration-300 border border-gray-200 text-center group"
              >
                <div className="text-3xl md:text-4xl mb-2 md:mb-3 group-hover:scale-125 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <div className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-slate-700 transition-colors">
                  {t(amenity.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie preview masonry mobile-friendly */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t({ en: 'Photo Gallery', fr: 'Galerie Photos' })}
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              {t({ en: 'Explore more than 25 photos', fr: 'Explorez plus de 25 photos' })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mb-8">
            {galleryImages.slice(0, 12).map((img, index) => (
              <Link
                key={index}
                href="/gallery"
                className={`relative overflow-hidden rounded-lg md:rounded-xl group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                  index === 0 ? 'col-span-2 row-span-2 h-[300px] md:h-[400px]' : 'h-[145px] md:h-[195px]'
                }`}
              >
                <Image
                  src={img.url}
                  alt={t(img.alt)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 md:gap-3 bg-slate-700 hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>📸</span>
              <span>{t({ en: 'View Full Gallery', fr: 'Voir Toute la Galerie' })}</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="py-12 md:py-16 bg-white">
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
