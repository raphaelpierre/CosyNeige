'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, specs, description, amenities, galleryImages } from '@/lib/data/chalet';

export default function ChaletPage() {
  const { t } = useLanguage();

  const rooms = [
    {
      name: { en: 'Ground Floor Bedroom', fr: 'Chambre Rez-de-Chaussée' },
      description: { en: 'Elegant queen-size bed with premium bedding, peaceful garden views, spacious traditional alpine wardrobe with ample storage', fr: 'Élégant lit queen-size avec literie premium, vue paisible sur jardin, spacieuse armoire alpine traditionnelle avec grand rangement' },
      icon: '🛏️',
    },
    {
      name: { en: 'Master Bedroom', fr: 'Suite Master' },
      description: { en: 'Luxurious suite with walk-in dressing room, breathtaking mountain panorama, private balcony access, climate control, and children\'s bed on request', fr: 'Suite luxueuse avec dressing, panorama montagneux à couper le souffle, accès balcon privé, climatisation, et lit enfant sur demande' },
      icon: '🛏️',
    },
    {
      name: { en: 'Garden View Bedroom', fr: 'Chambre Vue Jardin' },
      description: { en: 'Comfortable queen-size bed overlooking the private garden, authentic alpine closet with traditional wood finishes', fr: 'Confortable lit queen-size donnant sur le jardin privé, penderie alpine authentique aux finitions bois traditionnelles' },
      icon: '🛏️',
    },
    {
      name: { en: 'Children\'s Bedroom', fr: 'Chambre des Enfants' },
      description: { en: 'Three single beds in a cheerful, family-friendly space with playful mountain-themed décor and dedicated storage closet', fr: 'Trois lits simples dans un espace familial chaleureux avec décoration ludique aux thèmes montagnards et penderie dédiée' },
      icon: '🛏️',
    },
    {
      name: { en: 'Living Room', fr: 'Salon Principal' },
      description: { en: 'Grand living space featuring authentic stone fireplace with complimentary firewood, premium leather sofas, 65" Smart TV with Netflix and Amazon Prime, heated floors, and floor-to-ceiling windows showcasing spectacular Alpine panoramas', fr: 'Grand espace de vie avec authentique cheminée en pierre avec bois gratuit, canapés cuir premium, Smart TV 65" avec Netflix et Amazon Prime, sols chauffants, et baies vitrées offrant des panoramas alpins spectaculaires' },
      icon: '🛋️',
    },
    {
      name: { en: 'Gourmet Kitchen', fr: 'Cuisine Gastronomique' },
      description: { en: 'Authentic Savoyard kitchen fully equipped: professional oven, traditional gas range, premium dishwasher, Nespresso machine, toaster, kettle, and grand dining table seating 10 guests with all cooking utensils provided', fr: 'Authentique cuisine savoyarde entièrement équipée : four professionnel, piano à gaz traditionnel, lave-vaisselle haut de gamme, machine Nespresso, grille-pain, bouilloire, et grande table conviviale pour 10 convives avec tous ustensiles fournis' },
      icon: '🍳',
    },
    {
      name: { en: 'Luxury Bathrooms', fr: 'Salles de Bain de Luxe' },
      description: { en: 'Two designer bathrooms: master bathroom with oversized Italian shower and double vanity with heated towel rails; family bathroom with deep soaking tub, separate shower, and elegant fixtures', fr: 'Deux salles de bain design : salle de bain master avec grande douche italienne et double vasque avec sèche-serviettes chauffants ; salle familiale avec baignoire profonde, douche séparée, et élégants équipements' },
      icon: '🚿',
    },
    {
      name: { en: 'Alpine Outdoor Paradise', fr: 'Paradis Extérieur Alpin' },
      description: { en: 'Expansive terrace with premium outdoor furniture, professional BBQ station, outdoor hot tub with breathtaking mountain views, manicured private garden, and convenient 5-space private parking with ski room featuring boot warmers', fr: 'Vaste terrasse avec mobilier extérieur haut de gamme, station BBQ professionnelle, jacuzzi extérieur avec vue montagne à couper le souffle, jardin privé paysagé, et parking privé pratique de 5 places avec local à skis équipé de chauffe-chaussures' },
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
    { label: { en: 'Year Built', fr: 'Année Construction' }, value: '2005' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/exterieur_terrase_devant.webp"
            alt={t({ en: 'Chalet exterior view', fr: 'Vue extérieure du chalet' })}
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
      <section className="py-12 md:py-14 bg-white">
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
                  en: 'Our chalet combines traditional Savoyard architecture with modern luxury. Every detail has been carefully chosen to create a warm and refined atmosphere, perfect for unforgettable family or friends gatherings.',
                  fr: 'Notre chalet allie architecture savoyarde traditionnelle et luxe moderne. Chaque détail a été soigneusement choisi pour créer une atmosphère chaleureuse et raffinée, parfaite pour des séjours inoubliables en famille ou entre amis.',
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
      <section className="py-12 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'Specifications', fr: 'Caractéristiques' })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specifications.map((spec, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300  border border-forest-100 overflow-hidden text-center">
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
      <section className="py-12 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'Room by Room', fr: 'Pièce par Pièce' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300  border border-forest-100 overflow-hidden">
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
      <section className="py-12 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'All Amenities', fr: 'Tous les Équipements' })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300  border border-forest-100 overflow-hidden text-center">
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
      <section className="py-12 bg-white">
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
              className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold transition-colors border-2 border-slate-700 hover:border-slate-800"
            >
              {t({ en: 'View Full Gallery', fr: 'Voir Toute la Galerie' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="py-12 bg-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6 text-center">
            {t({ en: '360° Virtual Tour', fr: 'Visite Virtuelle 360°' })}
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            {t({
              en: 'Explore every corner of the chalet from the comfort of your home with our immersive virtual tour.',
              fr: 'Explorez chaque recoin du chalet depuis chez vous avec notre visite virtuelle immersive.',
            })}
          </p>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://view.ricoh360.com/1b07e554-b9eb-4b08-9b18-2940ab2496ea"
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              className="w-full"
              title={t({ en: '360° Virtual Tour of the Chalet', fr: 'Visite Virtuelle 360° du Chalet' })}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-forest-100/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-700">
            {t({ en: 'Ready to Experience This?', fr: 'Prêt à Vivre Cette Expérience ?' })}
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            {t({ en: 'Check our rates and book your stay', fr: 'Consultez nos tarifs et réservez votre séjour' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-slate-700 hover:border-slate-800"
            >
              {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
            </Link>
            <Link
              href="/location"
              className="inline-block border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-forest-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              {t({ en: 'Explore Location', fr: 'Découvrir la Localisation' })}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
