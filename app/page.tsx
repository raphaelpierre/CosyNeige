'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, tagline, specs, description, amenities, nearbyResorts, testimonials, galleryImages } from '@/lib/data/chalet';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920"
            alt="CosyNeige"
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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.capacity}</div>
              <div className="text-sm text-white/80">{t({ en: 'Guests', fr: 'Personnes' })}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.bedrooms}</div>
              <div className="text-sm text-white/80">{t({ en: 'Bedrooms', fr: 'Chambres' })}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.bathrooms}</div>
              <div className="text-sm text-white/80">{t({ en: 'Bathrooms', fr: 'Salles de bain' })}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{specs.surface}m²</div>
              <div className="text-sm text-white/80">{t({ en: 'Surface', fr: 'Surface' })}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Link
              href="/booking"
              className="group relative bg-gradient-to-r from-forest-700 to-forest-600 hover:from-forest-800 hover:to-forest-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-block shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">{t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
            <Link
              href="/chalet"
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-block shadow-xl hover:shadow-2xl hover:scale-105"
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
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
            {t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t(description)}
          </p>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Photo Gallery', fr: 'Galerie Photos' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {galleryImages.slice(0, 6).map((img, index) => (
              <div
                key={index}
                className="relative h-64 rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={img.url}
                  alt={t(img.alt)}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-center p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm text-center">{t(img.alt)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/gallery"
              className="group relative inline-block bg-gradient-to-r from-forest-700 to-forest-600 hover:from-forest-800 hover:to-forest-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">{t({ en: 'View Full Gallery', fr: 'Voir Toute la Galerie' })}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-gradient-to-b from-white to-cream">
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
                className="group relative flex flex-col items-center text-center p-6 bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden"
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-cream via-white to-cream">
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
                className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden"
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
      <section className="py-16 md:py-20 bg-gradient-to-b from-cream to-white">
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
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 hover:scale-105 border border-forest-50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gold-100/40 to-transparent rounded-br-full transform -translate-x-8 -translate-y-8" />
                <div className="relative">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-gold-500 text-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">"{t(review.comment)}"</p>
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              {t({ en: 'Ready to Book Your Alpine Retreat?', fr: 'Prêt à Réserver Votre Refuge Alpin ?' })}
            </h2>
            <p className="text-xl md:text-2xl text-forest-100 mb-8 flex items-center justify-center gap-2">
              <span className="text-gold-400">✨</span>
              {t({ en: 'From €1,200 per week', fr: 'À partir de 1 200€ par semaine' })}
              <span className="text-gold-400">✨</span>
            </p>
            <Link
              href="/booking"
              className="group relative inline-block bg-white text-forest-800 hover:bg-gradient-to-r hover:from-gold-100 hover:to-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-gold-500/20 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
