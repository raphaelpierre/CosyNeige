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

      {/* Activities Section - Winter & Summer */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full text-sm md:text-base font-bold mb-3 shadow-lg">
              <span className="text-xl">🎯</span>
              <span>{t({ en: 'Year-Round', fr: 'Toute l\'Année' })}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {t({ en: 'Activities & Experiences', fr: 'Activités & Expériences' })}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t({
                en: 'Endless adventures in the French Alps, every season',
                fr: 'Aventures infinies dans les Alpes françaises, chaque saison'
              })}
            </p>
          </div>

          {/* Winter Activities */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">❄️</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t({ en: 'Winter Activities', fr: 'Activités Hiver' })}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">⛷️</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Alpine Skiing', fr: 'Ski Alpin' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: '650km slopes nearby', fr: '650km pistes à proximité' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🏂</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Snowboarding', fr: 'Snowboard' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Parks & freeride zones', fr: 'Parks & zones freeride' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🥾</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Snowshoeing', fr: 'Raquettes' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Marked trails', fr: 'Sentiers balisés' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🧗</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Ice Climbing', fr: 'Cascade de Glace' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Guided expeditions', fr: 'Sorties encadrées' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🛷</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Sledding', fr: 'Luge' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Family fun slopes', fr: 'Pistes familiales' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🎿</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Cross-Country', fr: 'Ski de Fond' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Nordic trails', fr: 'Pistes nordiques' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🐕</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Dog Sledding', fr: 'Traîneau à Chiens' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Unique experience', fr: 'Expérience unique' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">⛸️</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Ice Skating', fr: 'Patinage' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Outdoor rinks', fr: 'Patinoires extérieures' })}
                </p>
              </div>
            </div>
          </div>

          {/* Summer Activities */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">☀️</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t({ en: 'Summer Activities', fr: 'Activités Été' })}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🥾</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Hiking', fr: 'Randonnée' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: '100+ mountain trails', fr: '100+ sentiers montagne' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🚵</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Mountain Biking', fr: 'VTT' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Downhill & trails', fr: 'Descente & sentiers' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🪂</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Paragliding', fr: 'Parapente' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Tandem flights available', fr: 'Vols tandem disponibles' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🧗</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Rock Climbing', fr: 'Escalade' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Via ferrata & cliffs', fr: 'Via ferrata & falaises' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🏊</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Swimming', fr: 'Baignade' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Mountain lakes', fr: 'Lacs de montagne' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🚣</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Water Sports', fr: 'Sports Nautiques' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Kayak, rafting, SUP', fr: 'Kayak, rafting, SUP' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">⛳</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Golf', fr: 'Golf' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Mountain courses', fr: 'Parcours montagne' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🐎</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Horse Riding', fr: 'Équitation' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Trail riding', fr: 'Randonnées équestres' })}
                </p>
              </div>
            </div>
          </div>

          {/* Wellness & Spa */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">💆</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t({ en: 'Wellness & Spa', fr: 'Bien-être & Spa' })}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">♨️</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Thermal Baths', fr: 'Thermes' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'St-Gervais (20 min)', fr: 'St-Gervais (20 min)' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🧖</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Spa Centers', fr: 'Centres Spa' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Massages & treatments', fr: 'Massages & soins' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🧘</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Yoga & Wellness', fr: 'Yoga & Bien-être' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Mountain retreats', fr: 'Retraites montagne' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🌊</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Aquatic Centers', fr: 'Centres Aquatiques' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Pools & wellness', fr: 'Piscines & bien-être' })}
                </p>
              </div>
            </div>
          </div>

          {/* Leisure & Culture */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🎭</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t({ en: 'Leisure & Culture', fr: 'Loisirs & Culture' })}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🏘️</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Alpine Villages', fr: 'Villages Alpins' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Samoëns, Megève, Yvoire', fr: 'Samoëns, Megève, Yvoire' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🏔️</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Mont-Blanc', fr: 'Mont-Blanc' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Cable car, Aiguille du Midi', fr: 'Téléphérique, Aiguille du Midi' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🧀</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Farm Visits', fr: 'Fermes' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Cheese & local products', fr: 'Fromages & produits locaux' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🏰</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Castles & Museums', fr: 'Châteaux & Musées' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Historical sites', fr: 'Sites historiques' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🛍️</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Markets', fr: 'Marchés' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Local weekly markets', fr: 'Marchés hebdomadaires' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🎪</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Family Parks', fr: 'Parcs Familiaux' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Adventure & animal parks', fr: 'Parcs aventure & animaux' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🍷</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Wine Tasting', fr: 'Dégustation Vins' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Savoie vineyards', fr: 'Vignobles savoyards' })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🎵</div>
                <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                  {t({ en: 'Events & Festivals', fr: 'Événements & Festivals' })}
                </h4>
                <p className="text-xs text-gray-600">
                  {t({ en: 'Year-round cultural events', fr: 'Événements toute l\'année' })}
                </p>
              </div>
            </div>
          </div>

          {/* CTA for Exclusive Offers */}
          <div className="mt-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl border border-slate-600">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <span className="text-2xl">🎁</span>
                <span className="text-white font-semibold text-sm">
                  {t({ en: 'Exclusive Benefits', fr: 'Avantages Exclusifs' })}
                </span>
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t({
                en: 'Unlock Exclusive Local Offers & Discounts',
                fr: 'Débloquez des Offres Locales Exclusives & Réductions'
              })}
            </h3>

            <p className="text-lg text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
              {t({
                en: 'Register to access our curated selection of exclusive partnerships: ski pass discounts, restaurant deals, spa packages, activity bookings, and much more. Our local offers are constantly updated to give you the best experience.',
                fr: 'Inscrivez-vous pour accéder à notre sélection d\'offres exclusives négociées : réductions forfaits ski, tarifs préférentiels restaurants, forfaits spa, réservations d\'activités, et bien plus. Nos offres locales évoluent constamment pour vous offrir la meilleure expérience.'
              })}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-xl">✓</span>
                <span className="text-sm font-medium">{t({ en: 'Up to 15% off ski passes', fr: 'Jusqu\'à 15% sur forfaits ski' })}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-xl">✓</span>
                <span className="text-sm font-medium">{t({ en: 'Priority booking', fr: 'Réservations prioritaires' })}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-xl">✓</span>
                <span className="text-sm font-medium">{t({ en: 'Local insider tips', fr: 'Conseils locaux exclusifs' })}</span>
              </div>
            </div>

            <a
              href="/booking"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-slate-800 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>🔑</span>
              {t({ en: 'Register for Exclusive Access', fr: 'S\'inscrire pour Accès Exclusif' })}
            </a>

            <p className="text-xs text-white/70 mt-4">
              {t({
                en: 'Free registration • Instant access • Cancel anytime',
                fr: 'Inscription gratuite • Accès instantané • Sans engagement'
              })}
            </p>
          </div>
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

    </div>
  );
}
