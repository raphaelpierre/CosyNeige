'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, specs, description, amenities, galleryImages } from '@/lib/data/chalet';

export default function ChaletPage() {
  const { t } = useLanguage();

  const rooms = [
    {
      name: { en: 'Master Bedroom', fr: 'Chambre Principale' },
      description: { en: 'King-size bed, en-suite bathroom with bathtub, mountain view balcony, walk-in closet', fr: 'Lit king-size, salle de bain attenante avec baignoire, balcon vue montagne, dressing' },
      icon: '🛏️',
    },
    {
      name: { en: 'Second Bedroom', fr: 'Deuxième Chambre' },
      description: { en: 'Queen-size bed, shared bathroom access, south-facing windows', fr: 'Lit queen-size, accès salle de bain partagée, fenêtres plein sud' },
      icon: '🛏️',
    },
    {
      name: { en: 'Third Bedroom', fr: 'Troisième Chambre' },
      description: { en: 'Two single beds (can be joined), mountain views, desk area', fr: 'Deux lits simples (jumelables), vue montagne, coin bureau' },
      icon: '🛏️',
    },
    {
      name: { en: 'Fourth Bedroom', fr: 'Quatrième Chambre' },
      description: { en: 'Bunk beds + single bed, perfect for children, playful decor', fr: 'Lits superposés + lit simple, parfait pour enfants, décoration ludique' },
      icon: '🛏️',
    },
    {
      name: { en: 'Living Room', fr: 'Salon' },
      description: { en: 'Spacious area with stone fireplace, comfortable sofas, Smart TV, large windows with panoramic views', fr: 'Espace spacieux avec cheminée en pierre, canapés confortables, Smart TV, grandes fenêtres vue panoramique' },
      icon: '🛋️',
    },
    {
      name: { en: 'Kitchen', fr: 'Cuisine' },
      description: { en: 'Fully equipped modern kitchen: oven, induction hob, dishwasher, Nespresso machine, large dining table for 10', fr: 'Cuisine moderne entièrement équipée : four, plaques induction, lave-vaisselle, machine Nespresso, grande table pour 10' },
      icon: '🍳',
    },
    {
      name: { en: 'Bathrooms', fr: 'Salles de Bain' },
      description: { en: '3 bathrooms: 1 en-suite with bathtub, 2 with walk-in showers, heated towel rails, luxury toiletries', fr: '3 salles de bain : 1 attenante avec baignoire, 2 avec douches italiennes, sèche-serviettes, produits de luxe' },
      icon: '🚿',
    },
    {
      name: { en: 'Outdoor Spaces', fr: 'Espaces Extérieurs' },
      description: { en: 'Large terrace with outdoor furniture, BBQ area, private garden, mountain panorama, 2 parking spaces', fr: 'Grande terrasse avec mobilier extérieur, espace BBQ, jardin privé, panorama montagne, 2 places parking' },
      icon: '🌲',
    },
  ];

  const specifications = [
    { label: { en: 'Total Surface', fr: 'Surface Totale' }, value: `${specs.surface}m²` },
    { label: { en: 'Capacity', fr: 'Capacité' }, value: `${specs.capacity} ${t({ en: 'guests', fr: 'personnes' })}` },
    { label: { en: 'Bedrooms', fr: 'Chambres' }, value: specs.bedrooms.toString() },
    { label: { en: 'Bathrooms', fr: 'Salles de Bain' }, value: specs.bathrooms.toString() },
    { label: { en: 'Parking', fr: 'Parking' }, value: `${specs.parkingSpaces} ${t({ en: 'spaces', fr: 'places' })}` },
    { label: { en: 'Floor', fr: 'Étage' }, value: t({ en: 'Ground + 1st floor', fr: 'Rez-de-chaussée + 1er' }) },
    { label: { en: 'Year Built', fr: 'Année Construction' }, value: '2018' },
    { label: { en: 'Last Renovated', fr: 'Dernière Rénovation' }, value: '2023' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={galleryImages[0].url}
            alt={t(galleryImages[0].alt)}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t({ en: 'The Chalet', fr: 'Le Chalet' })}</h1>
          <p className="text-xl md:text-2xl">{t({ en: 'Luxury & Authenticity', fr: 'Luxe & Authenticité' })}</p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
                {chaletName}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t(description)}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t({
                  en: 'Built in 2018 and completely renovated in 2023, our chalet combines traditional Savoyard architecture with modern luxury. Every detail has been carefully chosen to create a warm and refined atmosphere, perfect for unforgettable family or friends gatherings.',
                  fr: 'Construit en 2018 et entièrement rénové en 2023, notre chalet allie architecture savoyarde traditionnelle et luxe moderne. Chaque détail a été soigneusement choisi pour créer une atmosphère chaleureuse et raffinée, parfaite pour des séjours inoubliables en famille ou entre amis.',
                })}
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={galleryImages[1].url}
                alt={t(galleryImages[1].alt)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'Specifications', fr: 'Caractéristiques' })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specifications.map((spec, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="text-sm text-gray-600 mb-2">{t(spec.label)}</div>
                  <div className="text-2xl font-bold text-forest-800 group-hover:text-forest-900">{spec.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Details */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'Room by Room', fr: 'Pièce par Pièce' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-300">{room.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-forest-800 group-hover:text-forest-900 mb-2">{t(room.name)}</h3>
                    <p className="text-gray-700">{t(room.description)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'All Amenities', fr: 'Tous les Équipements' })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{amenity.icon}</div>
                  <div className="text-sm font-medium text-gray-800 group-hover:text-forest-700 transition-colors">{t(amenity.label)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'Explore the Chalet', fr: 'Découvrez le Chalet' })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {galleryImages.slice(0, 9).map((img, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden group">
                <Image
                  src={img.url}
                  alt={t(img.alt)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-block bg-forest-700 hover:bg-forest-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {t({ en: 'View Full Gallery', fr: 'Voir Toute la Galerie' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour Placeholder */}
      <section className="py-16 bg-forest-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
            {t({ en: '360° Virtual Tour', fr: 'Visite Virtuelle 360°' })}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {t({
              en: 'Coming soon: Explore every corner of the chalet from the comfort of your home with our immersive virtual tour.',
              fr: 'Bientôt disponible : Explorez chaque recoin du chalet depuis chez vous avec notre visite virtuelle immersive.',
            })}
          </p>
          <div className="bg-white rounded-lg p-12 shadow-md">
            <div className="text-6xl mb-4">🏔️</div>
            <p className="text-gray-600">{t({ en: 'Virtual tour coming soon', fr: 'Visite virtuelle à venir' })}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t({ en: 'Ready to Experience This?', fr: 'Prêt à Vivre Cette Expérience ?' })}
          </h2>
          <p className="text-xl text-forest-100 mb-8">
            {t({ en: 'Check our rates and book your stay', fr: 'Consultez nos tarifs et réservez votre séjour' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-block bg-white text-forest-800 hover:bg-cream px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
            </Link>
            <Link
              href="/location"
              className="inline-block bg-forest-700 hover:bg-forest-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-white"
            >
              {t({ en: 'Explore Location', fr: 'Découvrir la Localisation' })}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
