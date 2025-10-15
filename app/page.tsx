'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, tagline, specs, description, amenities, nearbyResorts, testimonials } from '@/lib/data/chalet';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/chalet_neige_devant.webp"
            alt="Chalet-Balmotte810 - Chalet de luxe à Châtillon-sur-Cluses"
            fill
            className="object-cover brightness-75 scale-105 animate-[scale_20s_ease-in-out_infinite_alternate]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/30 via-transparent to-forest-900/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              {chaletName}
            </h1>
            <p className="text-xl md:text-3xl text-white/95 mb-2 font-light tracking-wide">
              {t(tagline)}
            </p>
            <p className="text-lg md:text-xl text-white/90 mb-8 flex items-center justify-center gap-2">
              <span className="inline-block animate-pulse">📍</span>
              Châtillon-sur-Cluses • {t({ en: 'French Alps', fr: 'Alpes Françaises' })}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300  hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.capacity}</div>
              <div className="text-sm text-white/80">{t({ en: 'Guests', fr: 'Personnes' })}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300  hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.bedrooms}</div>
              <div className="text-sm text-white/80">{t({ en: 'Bedrooms', fr: 'Chambres' })}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300  hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.bathrooms}</div>
              <div className="text-sm text-white/80">{t({ en: 'Bathrooms', fr: 'Salles de bain' })}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300  hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.surface}m²</div>
              <div className="text-sm text-white/80">{t({ en: 'Surface', fr: 'Surface' })}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                          <Link
                href="/booking"
                className="group relative inline-block bg-slate-700 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-slate-700 hover:border-slate-800"
              >
                <span className="relative z-10">{t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}</span>
              </Link>
            <Link
              href="/chalet"
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-block shadow-xl hover:shadow-2xl "
            >
              {t({ en: 'Discover the Chalet', fr: 'Découvrir le Chalet' })}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
            {t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t(description)}
          </p>
        </div>
      </section>

      {/* Visual Features - What Makes This Chalet Special */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Experience the Alpine Lifestyle', fr: 'Vivez l\'Expérience Alpine' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>

          <div className="space-y-8">
            {/* Feature 1 - Location */}
            <div className="group relative bg-gradient-to-br from-forest-50 to-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0 items-center">
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <Image
                    src="/images/chaletneigedehors.webp"
                    alt="Chalet in winter - Between two valleys"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-50/30" />
                </div>
                <div className="p-8 md:p-12">
                  <div className="text-5xl mb-4">🏔️</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-forest-900 mb-4">
                    {t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {t({
                      en: 'Unique strategic location between the Arve and Giffre valleys. Access to 5 major ski resorts within 30 minutes. Explore a different mountain every day.',
                      fr: 'Position stratégique unique entre les vallées de l\'Arve et du Giffre. Accès à 5 grandes stations en 30 minutes. Explorez une montagne différente chaque jour.'
                    })}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">⛷️ 5 {t({ en: 'Resorts', fr: 'Stations' })}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">🚗 &lt; 30 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Premium Relaxation */}
            <div className="group relative bg-gradient-to-br from-forest-50 to-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0 items-center">
                <div className="p-8 md:p-12 order-2 md:order-1">
                  <div className="text-5xl mb-4">🛁</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-forest-900 mb-4">
                    {t({ en: 'Premium Relaxation', fr: 'Détente Premium' })}
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {t({
                      en: 'After a day on the slopes, soak in the outdoor hot tub with mountain views, enjoy the comfort of heated floors throughout, or cozy up by the wood-burning fireplace.',
                      fr: 'Après une journée sur les pistes, plongez dans le jacuzzi extérieur avec vue montagne, profitez du confort des sols chauffants, ou installez-vous près de la cheminée.'
                    })}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">♨️ {t({ en: 'Hot Tub', fr: 'Jacuzzi' })}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">🔆 {t({ en: 'Heated Floors', fr: 'Sols Chauffants' })}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">🔥 {t({ en: 'Fireplace', fr: 'Cheminée' })}</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-80 md:h-96 overflow-hidden order-1 md:order-2">
                  <Image
                    src="/images/jacusi.webp"
                    alt="Hot tub with mountain view"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-forest-50/30" />
                </div>
              </div>
            </div>

            {/* Feature 3 - Perfect for Groups */}
            <div className="group relative bg-gradient-to-br from-forest-50 to-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0 items-center">
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <Image
                    src="/images/hallEtage2.webp"
                    alt="Spacious interior living space"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-50/30" />
                </div>
                <div className="p-8 md:p-12">
                  <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-forest-900 mb-4">
                    {t({ en: 'Perfect for Groups & Families', fr: 'Parfait pour Groupes & Familles' })}
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {t({
                      en: 'Spacious 180m² chalet accommodating up to 10 guests. 4 comfortable bedrooms, 3 modern bathrooms, and generous living spaces for memorable gatherings.',
                      fr: 'Spacieux chalet de 180m² accueillant jusqu\'à 10 personnes. 4 chambres confortables, 3 salles de bains modernes, et espaces de vie généreux pour des moments inoubliables.'
                    })}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">🏠 180m²</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">🛏️ 4 {t({ en: 'Bedrooms', fr: 'Chambres' })}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-forest-700 font-semibold">👥 10 {t({ en: 'Guests', fr: 'Personnes' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA to Gallery */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              {t({ en: 'Discover more photos of the chalet', fr: 'Découvrez plus de photos du chalet' })}
            </p>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-semibold text-lg transition-colors duration-300"
            >
              <span>{t({ en: 'View Photo Gallery', fr: 'Voir la Galerie Photos' })}</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-gradient-to-b from-white to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-forest-700 mb-2">5</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Ski Resorts Nearby', fr: 'Stations de Ski' })}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-forest-700 mb-2">10</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Guests Capacity', fr: 'Personnes Max' })}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-forest-700 mb-2">180</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Square Meters', fr: 'Mètres Carrés' })}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-forest-700 mb-2">4+</div>
              <div className="text-sm md:text-base text-gray-600">
                {t({ en: 'Premium Amenities', fr: 'Équipements Premium' })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-12 bg-gradient-to-b from-white to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Luxury Amenities', fr: 'Équipements de Luxe' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center p-6 bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300  border border-forest-100 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
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

      {/* Nearby Resorts */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-cream via-white to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Access to 5 Major Ski Resorts', fr: 'Accès à 5 Grandes Stations' })}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {t({ en: 'Strategic location for ski variety', fr: 'Emplacement stratégique pour varier les plaisirs' })}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyResorts.map((resort, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300  border border-forest-100 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-300">⛷️</span>
                    <h3 className="font-bold text-xl text-forest-800 group-hover:text-forest-900">{resort.name}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full">
                      <span className="text-forest-700 font-semibold">{resort.distance}km</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full">
                      <span>🚗</span>
                      <span className="text-forest-700 font-semibold">{resort.drivingTime} min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-14 bg-gradient-to-b from-cream to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Guest Reviews', fr: 'Avis des Clients' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((review, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300  border border-forest-50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gold-100/40 to-transparent rounded-br-full transform -translate-x-8 -translate-y-8" />
                <div className="relative">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-gold-500 text-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">&ldquo;{t(review.comment)}&rdquo;</p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-forest-100">
                    <div className="font-semibold text-forest-800">{review.name}</div>
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
      <section className="py-14 bg-white border-t border-forest-100/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-700">
              {t({ en: 'Ready to Book Your Alpine Retreat?', fr: 'Prêt à Réserver Votre Refuge Alpin ?' })}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 flex items-center justify-center gap-2">
              <span className="text-forest-700">✨</span>
              {t({ en: 'From €310 per night', fr: 'À partir de 310€ par nuit' })}
              <span className="text-forest-700">✨</span>
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
