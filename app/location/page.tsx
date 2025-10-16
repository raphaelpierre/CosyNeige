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

  const summerActivities = activities.filter(a => a.season === 'summer' || a.season === 'all');
  const winterActivities = activities.filter(a => a.season === 'winter');

  return (
    <div>
      {/* Hero Section Full Height */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/entre2vallees.webp"
            alt={t({ en: 'Mountain landscape', fr: 'Paysage montagnard' })}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">{t({ en: 'Location & Activities', fr: 'Localisation & Activités' })}</h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light mb-6">
            {location.village}, {location.region}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full">
              <span className="text-white font-semibold">📍 732m {t({ en: 'altitude', fr: 'd\'altitude' })}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full">
              <span className="text-white font-semibold">🏔️ {t({ en: 'Between two valleys', fr: 'Entre deux vallées' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Location */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Strategic Location', fr: 'Emplacement Stratégique' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t({
                en: 'Châtillon-sur-Cluses sits perfectly between the Arve and Giffre valleys at 732m altitude, offering easy access to 5 major ski resorts and authentic mountain experiences.',
                fr: 'Châtillon-sur-Cluses est idéalement situé entre les vallées de l\'Arve et du Giffre à 732m d\'altitude, offrant un accès facile à 5 grandes stations de ski et des expériences authentiques en montagne.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {t({ en: 'Key Details', fr: 'Détails Clés' })}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl">📍</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">{t({ en: 'Address', fr: 'Adresse' })}</div>
                    <div className="text-gray-700">
                      {location.street && <>{location.street}, </>}
                      {location.village}, {location.department} ({location.postalCode})
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl">⛰️</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">{t({ en: 'Altitude', fr: 'Altitude' })}</div>
                    <div className="text-gray-700">{location.altitude}m</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl">🗺️</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">{t({ en: 'Region', fr: 'Région' })}</div>
                    <div className="text-gray-700">{location.region}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl">🌄</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">{t({ en: 'Between Two Valleys', fr: 'Entre Deux Vallées' })}</div>
                    <div className="text-gray-700">{t({ en: 'Arve Valley (south) & Giffre Valley (north)', fr: 'Vallée de l\'Arve (sud) & Vallée du Giffre (nord)' })}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/ExterieurBalcon.webp"
                alt="Mountain valley view"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ski Resorts - Visual Map */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: '5 Resorts Around You', fr: '5 Stations Autour de Vous' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t({
                en: 'Strategic position = maximum ski variety in minimum time',
                fr: 'Position stratégique = variété maximale en un minimum de temps',
              })}
            </p>
          </div>

          {/* Carte visuelle radiale */}
          <div className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
            {/* Pattern de fond montagne */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }} />
            </div>

            {/* Chalet au centre */}
            <div className="relative flex flex-col items-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-white rounded-full p-6 md:p-8 shadow-2xl">
                  <div className="text-4xl md:text-6xl">🏔️</div>
                </div>
              </div>
              <div className="mt-4 bg-white/10 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full">
                <span className="text-white font-bold text-lg md:text-xl">{chaletName}</span>
              </div>
              <div className="mt-2 text-white/80 text-sm">📍 Châtillon-sur-Cluses</div>
            </div>

            {/* Stations en cercle autour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              {nearbyResorts.map((resort, index) => (
                <div key={index} className="group relative">
                  {/* Ligne de connexion visuelle (desktop uniquement) */}
                  <div className="hidden lg:block absolute bottom-full left-1/2 w-0.5 h-8 md:h-12 bg-gradient-to-t from-white/40 to-transparent -translate-x-1/2" />

                  {/* Carte station */}
                  <div className="relative bg-white rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform">⛷️</div>
                      <h3 className="font-bold text-sm md:text-base text-gray-900 mb-3 leading-tight">
                        {resort.name}
                      </h3>

                      {/* Distance et temps */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
                          <span className="text-xs md:text-sm font-bold text-slate-700">{resort.distance}km</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-full px-3 py-1.5">
                          <span className="text-xs">🚗</span>
                          <span className="text-xs md:text-sm font-bold">{resort.drivingTime} min</span>
                        </div>
                      </div>

                      {/* Barre de proximité */}
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 group-hover:to-green-700"
                          style={{ width: `${Math.max(30, 100 - resort.drivingTime * 3)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats en bas */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
                <span className="text-white font-semibold">⏱️ {t({ en: 'Average: 20min', fr: 'Moyenne: 20min' })}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
                <span className="text-white font-semibold">🎿 650km {t({ en: 'of slopes', fr: 'de pistes' })}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
                <span className="text-white font-semibold">🏔️ 5 {t({ en: 'domains', fr: 'domaines' })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Nearby Services & Towns', fr: 'Services & Villes à Proximité' })}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t({ en: 'Everything you need is within reach', fr: 'Tout ce dont vous avez besoin est à portée de main' })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyServices.map((service, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-200/20 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-300">{service.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900">{t(service.name)}</h3>
                      <span className="text-sm font-semibold text-slate-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">{service.distance} km</span>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t({ en: 'Find Us on the Map', fr: 'Trouvez-Nous sur la Carte' })}
            </h2>
            <p className="text-lg text-gray-600">
              {t({
                en: 'Located in the heart of Châtillon-sur-Cluses, between the Arve and Giffre valleys',
                fr: 'Situé au cœur de Châtillon-sur-Cluses, entre les vallées de l\'Arve et du Giffre',
              })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
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
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://www.google.com/maps/dir//${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>🚗</span>
                {t({ en: 'Get Directions', fr: 'Obtenir l\'Itinéraire' })}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                <span>📍</span>
                {t({ en: 'Open in Google Maps', fr: 'Ouvrir dans Google Maps' })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Winter Activities with Photos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ❄️ {t({ en: 'Winter Activities', fr: 'Activités Hivernales' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t({
                en: 'From December to April, the Alps transform into a winter wonderland with endless activities for all ages.',
                fr: 'De décembre à avril, les Alpes se transforment en paradis hivernal avec des activités infinies pour tous les âges.',
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winterActivities.map((activity, index) => (
              <div key={index} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={t(activity.name)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{t(activity.name)}</h3>
                    <p className="text-sm text-white/90">{t(activity.description)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summer Activities with Photos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ☀️ {t({ en: 'Summer Activities', fr: 'Activités Estivales' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t({
                en: 'From June to September, discover the beauty of the Alps with hiking, biking, and mountain adventures.',
                fr: 'De juin à septembre, découvrez la beauté des Alpes avec randonnées, VTT et aventures en montagne.',
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summerActivities.map((activity, index) => (
              <div key={index} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={t(activity.name)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{t(activity.name)}</h3>
                    <p className="text-sm text-white/90">{t(activity.description)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {t({ en: 'Ready to Explore?', fr: 'Prêt à Explorer ?' })}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            {t({
              en: 'Book your stay and discover all that the French Alps have to offer',
              fr: 'Réservez votre séjour et découvrez tout ce que les Alpes françaises ont à offrir',
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>📅</span>
              {t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}
            </Link>
            <Link
              href="/chalet"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              {t({ en: 'Discover the Chalet', fr: 'Découvrir le Chalet' })}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
