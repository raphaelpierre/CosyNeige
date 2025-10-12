'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location, nearbyResorts, activities } from '@/lib/data/chalet';

export default function LocationPage() {
  const { t } = useLanguage();

  const nearbyServices = [
    {
      name: { en: 'Cluses', fr: 'Cluses' },
      type: { en: 'Town center', fr: 'Centre-ville' },
      distance: 4,
      description: { en: 'Shopping, restaurants, train station', fr: 'Commerces, restaurants, gare SNCF' },
      icon: '🏙️',
    },
    {
      name: { en: 'Geneva Airport', fr: 'Aéroport de Genève' },
      type: { en: 'International Airport', fr: 'Aéroport International' },
      distance: 45,
      description: { en: '45 min drive', fr: '45 min en voiture' },
      icon: '✈️',
    },
    {
      name: { en: 'Samoëns', fr: 'Samoëns' },
      type: { en: 'Village', fr: 'Village' },
      distance: 12,
      description: { en: 'Charming alpine village, markets', fr: 'Village alpin charmant, marchés' },
      icon: '🏘️',
    },
    {
      name: { en: 'Chamonix', fr: 'Chamonix' },
      type: { en: 'Mountain Resort', fr: 'Station de montagne' },
      distance: 35,
      description: { en: 'Mont-Blanc, Aiguille du Midi', fr: 'Mont-Blanc, Aiguille du Midi' },
      icon: '🏔️',
    },
  ];

  const summerActivities = activities.filter(a => a.season === 'summer');
  const winterActivities = activities.filter(a => a.season === 'winter');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Terrasse1.jpg"
            alt={t({ en: 'Mountain landscape', fr: 'Paysage montagnard' })}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t({ en: 'Location & Activities', fr: 'Localisation & Activités' })}</h1>
          <p className="text-xl md:text-2xl">{location.village}, {location.region}</p>
        </div>
      </section>

      {/* Strategic Location */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Strategic Location', fr: 'Emplacement Stratégique' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full mb-4" />
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t({
                en: 'Châtillon-sur-Cluses sits perfectly between the Arve and Giffre valleys at 732m altitude, offering easy access to 5 major ski resorts and authentic mountain experiences.',
                fr: 'Châtillon-sur-Cluses est idéalement situé entre les vallées de l\'Arve et du Giffre à 732m d\'altitude, offrant un accès facile à 5 grandes stations de ski et des expériences authentiques en montagne.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-forest-800 mb-6">
                {t({ en: 'Key Details', fr: 'Détails Clés' })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <div className="font-semibold text-forest-800">{t({ en: 'Address', fr: 'Adresse' })}</div>
                    <div className="text-gray-700">{location.village}, {location.department} ({location.postalCode})</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⛰️</div>
                  <div>
                    <div className="font-semibold text-forest-800">{t({ en: 'Altitude', fr: 'Altitude' })}</div>
                    <div className="text-gray-700">{location.altitude}m</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🗺️</div>
                  <div>
                    <div className="font-semibold text-forest-800">{t({ en: 'Region', fr: 'Région' })}</div>
                    <div className="text-gray-700">{location.region}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🌄</div>
                  <div>
                    <div className="font-semibold text-forest-800">{t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}</div>
                    <div className="text-gray-700">{t({ en: 'Arve Valley (south) & Giffre Valley (north)', fr: 'Vallée de l\'Arve (sud) & Vallée du Giffre (nord)' })}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                alt="Mountain valley view"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Ski Resorts */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Access to 5 Major Ski Resorts', fr: 'Accès à 5 Grandes Stations' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t({
                en: 'Our central location between two valleys gives you unparalleled access to diverse skiing experiences, from family-friendly slopes to expert terrain.',
                fr: 'Notre emplacement central entre deux vallées vous donne un accès incomparable à des expériences de ski variées, des pistes familiales aux terrains experts.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyResorts.map((resort, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden">
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

      {/* Nearby Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Nearby Services & Towns', fr: 'Services & Villes à Proximité' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyServices.map((service, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-300">{service.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-forest-800 group-hover:text-forest-900">{service.name.en}</h3>
                      <span className="text-sm font-semibold text-forest-700 bg-white/80 px-3 py-1 rounded-full">{service.distance} km</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{t(service.type)}</div>
                    <div className="text-sm text-gray-700">{t(service.description)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-forest-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              {t({ en: 'Find Us on the Map', fr: 'Trouvez-Nous sur la Carte' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full" />
          </div>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44343.65!2d6.5769!3d46.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64d0dc1d5623%3A0x40a7d8c6d6c3c3e0!2zQ2jDonRpbGxvbi1zdXItQ2x1c2VzLCBGcmFuY2U!5e0!3m2!1s${t({ en: 'en', fr: 'fr' })}!2sus!4v1234567890123!5m2!1s${t({ en: 'en', fr: 'fr' })}!2sus`}
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title={t({ en: 'Chalet-Balmotte810 Location Map', fr: 'Carte de localisation de Chalet-Balmotte810' })}
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              {t({
                en: 'Located in the heart of Châtillon-sur-Cluses, between the Arve and Giffre valleys',
                fr: 'Situé au cœur de Châtillon-sur-Cluses, entre les vallées de l\'Arve et du Giffre',
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>🚗</span>
                {t({ en: 'Get Directions', fr: 'Obtenir l\'Itinéraire' })}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-forest-800 border-2 border-forest-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>📍</span>
                {t({ en: 'Open in Google Maps', fr: 'Ouvrir dans Google Maps' })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Winter Activities */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              ❄️ {t({ en: 'Winter Activities', fr: 'Activités Hivernales' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t({
                en: 'From December to April, the Alps transform into a winter wonderland with endless activities for all ages.',
                fr: 'De décembre à avril, les Alpes se transforment en paradis hivernal avec des activités infinies pour tous les âges.',
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winterActivities.map((activity, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{activity.icon}</div>
                  <h3 className="text-xl font-bold text-forest-800 group-hover:text-forest-900 mb-2">{t(activity.name)}</h3>
                  <p className="text-gray-700 text-sm">{t(activity.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summer Activities */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              ☀️ {t({ en: 'Summer Activities', fr: 'Activités Estivales' })}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-forest-600 to-forest-800 mx-auto rounded-full mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t({
                en: 'From June to September, discover the beauty of the Alps with hiking, biking, and mountain adventures.',
                fr: 'De juin à septembre, découvrez la beauté des Alpes avec randonnées, VTT et aventures en montagne.',
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summerActivities.map((activity, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-forest-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-forest-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-forest-200/20 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{activity.icon}</div>
                  <h3 className="text-xl font-bold text-forest-800 group-hover:text-forest-900 mb-2">{t(activity.name)}</h3>
                  <p className="text-gray-700 text-sm">{t(activity.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t({ en: 'Ready to Explore?', fr: 'Prêt à Explorer ?' })}
          </h2>
          <p className="text-xl text-forest-100 mb-8">
            {t({
              en: 'Book your stay and discover all that the French Alps have to offer',
              fr: 'Réservez votre séjour et découvrez tout ce que les Alpes françaises ont à offrir',
            })}
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-forest-800 hover:bg-cream px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}
          </Link>
        </div>
      </section>
    </div>
  );
}
