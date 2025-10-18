'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location, nearbyResorts } from '@/lib/data/chalet';

export default function LocationPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero Section - Épuré et moderne */}
      <section className="relative h-[55vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/entre2vallees.webp"
            alt={t({ en: 'Mountain landscape', fr: 'Paysage montagnard' })}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-white font-semibold text-sm md:text-base">
              📍 Châtillon-sur-Cluses
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl mb-4 md:mb-6">
            {t({ en: 'Location & Info', fr: 'Localisation & Infos' })}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light drop-shadow-lg max-w-3xl mx-auto">
            {t({
              en: 'Between 2 valleys • Access to 5 resorts • Gateway to the Alps',
              fr: 'Entre 2 vallées • Accès à 5 stations • Porte des Alpes'
            })}
          </p>
        </div>
      </section>

      {/* Section 5 Stations - Style homepage */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Titre */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full text-sm md:text-base font-bold mb-3 shadow-lg">
              <span className="text-xl">⛷️</span>
              <span>{t({ en: '5 Resorts in 30min', fr: '5 Stations en 30min' })}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {t({ en: 'Unlimited Skiing', fr: 'Ski Illimité' })}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t({
                en: 'Central position = maximum variety, minimum travel time',
                fr: 'Position centrale = variété maximale, temps de trajet minimal'
              })}
            </p>
          </div>

          {/* Cartes stations - Style homepage */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {nearbyResorts.map((resort, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Badge distance */}
                <div className="absolute top-2 right-2 bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {resort.drivingTime}min
                </div>

                {/* Contenu */}
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    ⛷️
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight mb-1">
                    {resort.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>🚗</span>
                    <span className="font-semibold">{resort.distance}km</span>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-500 group-hover:w-full"
                    style={{ width: `${Math.max(20, 100 - resort.drivingTime * 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats chocs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-2xl md:text-3xl">🏔️</span>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-700">650km</div>
                <div className="text-xs md:text-sm text-gray-600">{t({ en: 'of slopes', fr: 'de pistes' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-2xl md:text-3xl">🎿</span>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-700">200+</div>
                <div className="text-xs md:text-sm text-gray-600">{t({ en: 'ski lifts', fr: 'remontées' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-2xl md:text-3xl">⏱️</span>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-700">20min</div>
                <div className="text-xs md:text-sm text-gray-600">{t({ en: 'average', fr: 'moyenne' })}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Services & Villes - Compact et moderne */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t({ en: 'Nearby', fr: 'À Proximité' })}
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              {t({ en: 'Everything you need is within reach', fr: 'Tout à portée de main' })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Cluses */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl mb-2">🏙️</div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">Cluses</h3>
              <p className="text-xs text-gray-600 mb-2">{t({ en: 'Town center', fr: 'Centre-ville' })}</p>
              <div className="inline-block bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                4 km
              </div>
            </div>

            {/* Geneva */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl mb-2">✈️</div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">Genève</h3>
              <p className="text-xs text-gray-600 mb-2">{t({ en: 'Airport', fr: 'Aéroport' })}</p>
              <div className="inline-block bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                45 km
              </div>
            </div>

            {/* Samoëns */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl mb-2">🏘️</div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">Samoëns</h3>
              <p className="text-xs text-gray-600 mb-2">{t({ en: 'Village', fr: 'Village' })}</p>
              <div className="inline-block bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                12 km
              </div>
            </div>

            {/* Chamonix */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl mb-2">🏔️</div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">Chamonix</h3>
              <p className="text-xs text-gray-600 mb-2">Mont-Blanc</p>
              <div className="inline-block bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                35 km
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps - Section moderne */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t({ en: 'Find Us', fr: 'Nous Trouver' })}
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Châtillon-sur-Cluses, Haute-Savoie
            </p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44343.65!2d6.5769!3d46.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64d0dc1d5623%3A0x40a7d8c6d6c3c3e0!2zQ2jDonRpbGxvbi1zdXItQ2x1c2VzLCBGcmFuY2U!5e0!3m2!1s${t({ en: 'en', fr: 'fr' })}!2sus!4v1234567890123!5m2!1s${t({ en: 'en', fr: 'fr' })}!2sus`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full md:h-[500px]"
              title="Location map"
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://www.google.com/maps/dir//${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl"
            >
              <span>🚗</span>
              {t({ en: 'Get Directions', fr: 'Itinéraire' })}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all"
            >
              <span>📍</span>
              Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Section Infos Pratiques - Essentiel du Guide */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t({ en: 'Practical Info', fr: 'Infos Pratiques' })}
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              {t({ en: 'Everything you need for a smooth stay', fr: 'Tout pour un séjour sans souci' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Check-in/out */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🏠</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {t({ en: 'Check-in / Check-out', fr: 'Arrivée / Départ' })}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>{t({ en: 'Arrival:', fr: 'Arrivée :' })}</strong> {t({ en: 'Sunday from 4:00 PM', fr: 'Dimanche dès 16h00' })}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>{t({ en: 'Departure:', fr: 'Départ :' })}</strong> {t({ en: 'Sunday before 10:00 AM', fr: 'Dimanche avant 10h00' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Parking */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🚗</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {t({ en: 'Parking', fr: 'Stationnement' })}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    {t({ en: '5 private spaces', fr: '5 places privées' })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t({ en: '2 covered + 3 outdoor', fr: '2 couvertes + 3 extérieures' })}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    ⚠️ {t({ en: 'Snow chains required in winter', fr: 'Chaînes obligatoires en hiver' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Shops */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🛒</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {t({ en: 'Local Shops', fr: 'Commerces' })}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Carrefour:</strong> 5 min {t({ en: 'drive', fr: 'en voiture' })}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>{t({ en: 'Bakery:', fr: 'Boulangerie :' })}</strong> 3 min
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>{t({ en: 'Pharmacy:', fr: 'Pharmacie :' })}</strong> Cluses (5 min)
                  </p>
                </div>
              </div>
            </div>

            {/* Ski Rental */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">⛷️</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {t({ en: 'Ski Rental', fr: 'Location Ski' })}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Sport 2000</strong> - Les Carroz
                  </p>
                  <p className="text-xs text-gray-600">
                    💡 {t({ en: 'Mention "Chalet-Balmotte810" for 10% off', fr: 'Mentionnez "Chalet-Balmotte810" pour -10%' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-red-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🚨</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {t({ en: 'Emergency', fr: 'Urgences' })}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>{t({ en: 'Emergency:', fr: 'Urgences :' })}</strong> 112
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>{t({ en: 'Hospital:', fr: 'Hôpital :' })}</strong> +33 4 50 47 30 00
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>{t({ en: 'Owner 24/7:', fr: 'Proprio 24h/24 :' })}</strong> +33 6 85 85 84 91
                  </p>
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">📋</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {t({ en: 'House Rules', fr: 'Règlement' })}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    🚭 {t({ en: 'Non-smoking (terrace OK)', fr: 'Non-fumeur (terrasse OK)' })}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    🔇 {t({ en: 'Quiet hours: 10PM-8AM', fr: 'Calme : 22h-8h' })}
                  </p>
                  <p className="text-sm text-gray-700">
                    👥 {t({ en: 'Max 10 guests', fr: 'Max 10 personnes' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
