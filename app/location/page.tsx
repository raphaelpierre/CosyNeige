'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location, nearbyResorts } from '@/lib/data/chalet';

export default function LocationPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero Section - Modern & Clean */}
      <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/entre2vallees.webp"
            alt={t({ en: 'Mountain landscape', fr: 'Paysage montagnard' })}
            fill
            className="object-cover brightness-[0.7]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2.5 mb-8 shadow-2xl">
            <span className="text-2xl">📍</span>
            <span className="text-white font-bold text-base md:text-lg tracking-wide">
              Châtillon-sur-Cluses • Haute-Savoie
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tight">
            {t({ en: 'Your Alpine Hub', fr: 'Votre Base Alpine' })}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium drop-shadow-xl max-w-4xl mx-auto mb-8 leading-relaxed">
            {t({
              en: '5 resorts within 30 min • Endless adventures',
              fr: '5 stations en 30 min • Aventures infinies'
            })}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <a
              href="#activities"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-2xl hover:scale-105"
            >
              <span>🎯</span>
              {t({ en: 'Discover Activities', fr: 'Découvrir Activités' })}
            </a>
            <a
              href="#exclusive"
              className="inline-flex items-center gap-2 bg-slate-700/90 backdrop-blur-sm hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-2xl border-2 border-white/20 hover:scale-105"
            >
              <span>✨</span>
              {t({ en: 'Exclusive Offers', fr: 'Offres Exclusives' })}
            </a>
          </div>
        </div>
      </section>

      {/* Activities Section - Winter & Summer */}
      <section id="activities" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 bg-slate-700 text-white px-6 py-3 rounded-full text-sm md:text-base font-bold mb-6 shadow-xl">
              <span className="text-2xl">🎯</span>
              <span className="tracking-wide">{t({ en: 'Year-Round Adventures', fr: 'Aventures Toute l\'Année' })}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {t({ en: 'Unlimited Experiences', fr: 'Expériences Illimitées' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t({
                en: 'From epic ski adventures to serene spa retreats, discover what makes the French Alps truly unforgettable',
                fr: 'Des aventures ski épiques aux retraites spa sereines, découvrez ce qui rend les Alpes françaises vraiment inoubliables'
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

          {/* CTA for Local Offers - Redesigned for Maximum Impact */}
          <div id="exclusive" className="mt-20 relative overflow-hidden">
            {/* Background gradient blur effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl transform -rotate-1 scale-105"></div>

            <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-600/50">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/50 rounded-full blur-3xl"></div>

              <div className="relative z-10 text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-base font-bold mb-6 md:mb-8 shadow-xl">
                  <span className="text-xl md:text-2xl">🎁</span>
                  <span className="tracking-wide uppercase">{t({ en: 'Member Benefits', fr: 'Avantages Membres' })}</span>
                </div>

                {/* Main Headline */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 leading-tight px-2">
                  {t({
                    en: 'Discover Local Partnerships',
                    fr: 'Découvrez nos Partenariats Locaux'
                  })}
                  <br />
                  <span className="bg-gradient-to-r from-cream to-amber-200 bg-clip-text text-transparent">
                    {t({
                      en: '& Special Member Offers',
                      fr: '& Offres Spéciales Membres'
                    })}
                  </span>
                </h3>

                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-10 leading-relaxed font-medium px-2">
                  {t({
                    en: 'Create a free account to access curated local deals, activity bookings, and insider travel tips to enhance your stay',
                    fr: 'Créez un compte gratuit pour accéder aux offres locales, réservations d\'activités et conseils de voyage pour enrichir votre séjour'
                  })}
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10 px-2">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎿</div>
                    <div className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t({ en: 'Ski & Activities', fr: 'Ski & Activités' })}</div>
                    <p className="text-white/80 text-xs md:text-sm">{t({ en: 'Partner deals on passes & equipment', fr: 'Offres partenaires forfaits & équipement' })}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🍽️</div>
                    <div className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t({ en: 'Dining & Wellness', fr: 'Restaurants & Bien-être' })}</div>
                    <p className="text-white/80 text-xs md:text-sm">{t({ en: 'Local restaurants & spa experiences', fr: 'Restaurants locaux & expériences spa' })}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">💡</div>
                    <div className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t({ en: 'Expert Advice', fr: 'Conseils d\'Expert' })}</div>
                    <p className="text-white/80 text-xs md:text-sm">{t({ en: 'Personalized tips & recommendations', fr: 'Conseils personnalisés & recommandations' })}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="/client/login?action=register"
                  className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-6 sm:px-8 md:px-12 py-4 md:py-5 lg:py-6 rounded-full font-black text-base sm:text-lg md:text-xl lg:text-2xl transition-all shadow-2xl hover:shadow-slate-900/50 hover:scale-105 transform border-2 border-slate-600 hover:border-slate-500"
                >
                  <span className="text-xl md:text-2xl">✨</span>
                  {t({ en: 'Create Free Account', fr: 'Créer un Compte Gratuit' })}
                </a>

                {/* Trust Signals */}
                <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-white/70 text-xs md:text-sm px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-200 text-base md:text-lg">✓</span>
                    <span>{t({ en: '100% Free', fr: '100% Gratuit' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-200 text-base md:text-lg">✓</span>
                    <span>{t({ en: 'Instant access', fr: 'Accès immédiat' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-200 text-base md:text-lg">✓</span>
                    <span>{t({ en: 'No obligation', fr: 'Sans obligation' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-200 text-base md:text-lg">✓</span>
                    <span>{t({ en: 'Cancel anytime', fr: 'Résiliation libre' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 Stations - Enhanced Professional Design */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {/* Title Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-full text-sm md:text-base font-bold mb-6 shadow-xl">
              <span className="text-2xl">⛷️</span>
              <span className="tracking-wide uppercase">{t({ en: 'Ski Paradise', fr: 'Paradis du Ski' })}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {t({ en: '5 Ski Resorts', fr: '5 Stations de Ski' })}
              <br />
              <span className="bg-gradient-to-r from-slate-600 to-slate-900 bg-clip-text text-transparent">
                {t({ en: 'Within 30 Minutes', fr: 'À Moins de 30 Minutes' })}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t({
                en: 'The chalet is ideally located to access 650km of slopes across the French Alps',
                fr: 'Le chalet est idéalement situé pour accéder à 650km de pistes dans les Alpes françaises'
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

      {/* Section Services & Villes - Modern & Clean */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 bg-slate-700 text-white px-6 py-3 rounded-full text-sm md:text-base font-bold mb-6 shadow-xl">
              <span className="text-2xl">📍</span>
              <span className="tracking-wide uppercase">{t({ en: 'Perfect Location', fr: 'Emplacement Parfait' })}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {t({ en: 'Everything Within Reach', fr: 'Tout à Portée de Main' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t({ en: 'From charming alpine villages to international airports, convenience meets adventure', fr: 'Des villages alpins charmants aux aéroports internationaux, commodité et aventure se rencontrent' })}
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

      {/* Google Maps - Professional & Modern */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-full text-sm md:text-base font-bold mb-6 shadow-xl">
              <span className="text-2xl">🗺️</span>
              <span className="tracking-wide uppercase">{t({ en: 'Easy Access', fr: 'Accès Facile' })}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {t({ en: 'Your Journey Starts Here', fr: 'Votre Voyage Commence Ici' })}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              810 Route de Balmotte • Châtillon-sur-Cluses • 74300
            </p>
            <p className="text-base text-gray-500">
              {t({ en: '45 min from Geneva Airport • Well-connected by highways', fr: '45 min de l\'Aéroport de Genève • Bien desservi par autoroutes' })}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44343.65!2d6.5769!3d46.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64d0dc1d5623%3A0x40a7d8c6d6c3c3e0!2zQ2jDonRpbGxvbi1zdXItQ2x1c2VzLCBGcmFuY2U!5e0!3m2!1s${t({ en: 'en', fr: 'fr' })}!2sus!4v1234567890123!5m2!1s${t({ en: 'en', fr: 'fr' })}!2sus`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full md:h-[550px]"
              title="Location map"
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`https://www.google.com/maps/dir//${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span className="text-xl">🚗</span>
              {t({ en: 'Get Directions', fr: 'Obtenir l\'Itinéraire' })}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all hover:scale-105"
            >
              <span className="text-xl">📍</span>
              {t({ en: 'Open in Maps', fr: 'Ouvrir dans Maps' })}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
