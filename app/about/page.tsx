'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location, specs } from '@/lib/data/chalet';

export default function AboutPage() {
  const { t } = useLanguage();

  const timeline = [
    {
      year: '2018',
      title: { en: 'Construction Completed', fr: 'Construction Achevée' },
      description: { en: 'CosyNeige is built with traditional Savoyard architecture, using local materials and craftsmanship to honor the Alpine heritage.', fr: 'Le CosyNeige est construit avec une architecture savoyarde traditionnelle, utilisant des matériaux locaux et un savoir-faire artisanal pour honorer l\'héritage alpin.' },
    },
    {
      year: '2019',
      title: { en: 'First Guests', fr: 'Premiers Hôtes' },
      description: { en: 'We welcome our first guests and begin sharing the magic of this special location with families and friends from around the world.', fr: 'Nous accueillons nos premiers hôtes et commençons à partager la magie de cet endroit spécial avec des familles et amis du monde entier.' },
    },
    {
      year: '2023',
      title: { en: 'Complete Renovation', fr: 'Rénovation Complète' },
      description: { en: 'Full interior renovation adds modern luxury amenities including sauna, hot tub, and smart home technology while preserving authentic charm.', fr: 'Rénovation intérieure complète ajoutant des équipements de luxe modernes incluant sauna, jacuzzi et domotique tout en préservant le charme authentique.' },
    },
    {
      year: '2025',
      title: { en: 'Welcoming You', fr: 'Vous Accueillons' },
      description: { en: 'Today, we continue to provide exceptional Alpine experiences, combining traditional hospitality with contemporary comfort.', fr: 'Aujourd\'hui, nous continuons de fournir des expériences alpines exceptionnelles, combinant hospitalité traditionnelle et confort contemporain.' },
    },
  ];

  const values = [
    {
      icon: '🏔️',
      title: { en: 'Authenticity', fr: 'Authenticité' },
      description: { en: 'We preserve the true spirit of the Alps while offering modern comfort. Every detail honors Savoyard traditions.', fr: 'Nous préservons l\'esprit authentique des Alpes tout en offrant un confort moderne. Chaque détail honore les traditions savoyardes.' },
    },
    {
      icon: '🌿',
      title: { en: 'Sustainability', fr: 'Durabilité' },
      description: { en: 'Committed to eco-friendly practices: energy-efficient heating, local suppliers, and respect for our mountain environment.', fr: 'Engagés dans des pratiques écologiques : chauffage économe, fournisseurs locaux, et respect de notre environnement montagnard.' },
    },
    {
      icon: '❤️',
      title: { en: 'Hospitality', fr: 'Hospitalité' },
      description: { en: 'Your comfort and happiness are our priority. We\'re available to ensure your stay is unforgettable.', fr: 'Votre confort et bonheur sont notre priorité. Nous sommes disponibles pour assurer que votre séjour soit inoubliable.' },
    },
    {
      icon: '⭐',
      title: { en: 'Excellence', fr: 'Excellence' },
      description: { en: 'From pristine cleanliness to quality furnishings, we maintain the highest standards in every aspect.', fr: 'De la propreté impeccable au mobilier de qualité, nous maintenons les plus hauts standards dans chaque aspect.' },
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1920"
            alt="About CosyNeige"
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t({ en: 'Our Story', fr: 'Notre Histoire' })}</h1>
          <p className="text-xl md:text-2xl leading-relaxed">
            {t({
              en: 'A passion for the Alps, a commitment to excellence, and a love for sharing this special place',
              fr: 'Une passion pour les Alpes, un engagement envers l\'excellence, et l\'amour de partager ce lieu spécial',
            })}
          </p>
        </div>
      </section>

      {/* Owner's Message */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
                alt="The Alps"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
                {t({ en: 'Welcome from the Owners', fr: 'Bienvenue des Propriétaires' })}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t({
                  en: 'Growing up in the French Alps, we have always been captivated by the beauty and tranquility of the mountains. When we discovered Châtillon-sur-Cluses, nestled between two valleys with its medieval charm and strategic location, we knew we had found something special.',
                  fr: 'Ayant grandi dans les Alpes françaises, nous avons toujours été captivés par la beauté et la tranquillité des montagnes. Quand nous avons découvert Châtillon-sur-Cluses, niché entre deux vallées avec son charme médiéval et son emplacement stratégique, nous savions avoir trouvé quelque chose de spécial.',
                })}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t({
                  en: 'In 2018, we built CosyNeige with one goal: to create a place where families and friends could experience the authentic Alps while enjoying modern luxury. Every room, every amenity was chosen with care to ensure your comfort and create lasting memories.',
                  fr: 'En 2018, nous avons construit le CosyNeige avec un objectif : créer un lieu où familles et amis pourraient vivre l\'expérience des Alpes authentiques tout en profitant du luxe moderne. Chaque pièce, chaque équipement a été choisi avec soin pour assurer votre confort et créer des souvenirs durables.',
                })}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t({
                  en: 'We hope CosyNeige becomes your home in the mountains, a place you return to year after year. Welcome to our Alpine retreat.',
                  fr: 'Nous espérons que le CosyNeige deviendra votre maison dans les montagnes, un lieu où vous reviendrez année après année. Bienvenue dans notre refuge alpin.',
                })}
              </p>
              <p className="text-xl font-semibold text-forest-800 mt-6">
                — {t({ en: 'The Moreau Family', fr: 'La Famille Moreau' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 text-center">
            {t({ en: 'Our Journey', fr: 'Notre Parcours' })}
          </h2>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                <div className="absolute left-0 top-0 w-6 h-6 bg-forest-700 rounded-full border-4 border-cream" />
                {index < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-forest-300" />
                )}
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-forest-700 mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold text-forest-900 mb-3">{t(item.title)}</h3>
                  <p className="text-gray-700 leading-relaxed">{t(item.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Our Commitment to You', fr: 'Notre Engagement Envers Vous' })}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t({
              en: 'These values guide everything we do at CosyNeige',
              fr: 'Ces valeurs guident tout ce que nous faisons au CosyNeige',
            })}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-cream rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-forest-800 mb-4">{t(value.title)}</h3>
                <p className="text-gray-700 leading-relaxed">{t(value.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Highlight */}
      <section className="py-16 bg-forest-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t({ en: 'Why Châtillon-sur-Cluses?', fr: 'Pourquoi Châtillon-sur-Cluses ?' })}
              </h2>
              <p className="text-forest-100 text-lg leading-relaxed mb-6">
                {t({
                  en: 'This charming village of 1,200 residents sits at 732m altitude, crowned by medieval castle ruins that watch over the valley. Unlike crowded resort towns, Châtillon has preserved its authentic character and local community.',
                  fr: 'Ce charmant village de 1 200 habitants se trouve à 732m d\'altitude, couronné par les ruines d\'un château médiéval qui veillent sur la vallée. Contrairement aux stations bondées, Châtillon a préservé son caractère authentique et sa communauté locale.',
                })}
              </p>
              <p className="text-forest-100 text-lg leading-relaxed mb-6">
                {t({
                  en: 'The strategic position between the Arve and Giffre valleys means you can reach 5 major ski resorts in 15-35 minutes. You get the best of both worlds: peaceful village life and access to world-class skiing.',
                  fr: 'La position stratégique entre les vallées de l\'Arve et du Giffre signifie que vous pouvez atteindre 5 grandes stations de ski en 15-35 minutes. Vous profitez du meilleur des deux mondes : vie de village paisible et accès au ski de classe mondiale.',
                })}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-forest-700 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{specs.capacity}</div>
                  <div className="text-sm text-forest-100">{t({ en: 'Guest Capacity', fr: 'Capacité' })}</div>
                </div>
                <div className="bg-forest-700 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{specs.surface}m²</div>
                  <div className="text-sm text-forest-100">{t({ en: 'Living Space', fr: 'Surface Habitable' })}</div>
                </div>
                <div className="bg-forest-700 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">5</div>
                  <div className="text-sm text-forest-100">{t({ en: 'Nearby Resorts', fr: 'Stations Proches' })}</div>
                </div>
                <div className="bg-forest-700 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">732m</div>
                  <div className="text-sm text-forest-100">{t({ en: 'Altitude', fr: 'Altitude' })}</div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
                alt="Châtillon village"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-12">
            {t({ en: 'Recognition & Awards', fr: 'Reconnaissances & Distinctions' })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-5xl mb-4">⭐</div>
              <div className="text-2xl font-bold text-forest-800 mb-2">5.0</div>
              <div className="text-sm text-gray-600">{t({ en: 'Average Guest Rating', fr: 'Note Moyenne des Hôtes' })}</div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-lg font-bold text-forest-800 mb-2">
                {t({ en: 'Superhost 2024', fr: 'Superhôte 2024' })}
              </div>
              <div className="text-sm text-gray-600">{t({ en: 'Excellence in Hospitality', fr: 'Excellence en Hospitalité' })}</div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-5xl mb-4">💚</div>
              <div className="text-lg font-bold text-forest-800 mb-2">
                {t({ en: 'Eco-Certified', fr: 'Éco-Certifié' })}
              </div>
              <div className="text-sm text-gray-600">{t({ en: 'Sustainable Tourism', fr: 'Tourisme Durable' })}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Meet the Team', fr: 'Rencontrez l\'Équipe' })}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t({
              en: 'The people who ensure your stay is perfect',
              fr: 'Les personnes qui assurent que votre séjour soit parfait',
            })}
          </p>

          <div className="bg-cream rounded-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👨‍👩‍👧‍👦</div>
                <div>
                  <h3 className="text-xl font-bold text-forest-800 mb-2">
                    {t({ en: 'The Moreau Family - Owners', fr: 'La Famille Moreau - Propriétaires' })}
                  </h3>
                  <p className="text-gray-700">
                    {t({
                      en: 'Passionate about the Alps and dedicated to providing exceptional guest experiences.',
                      fr: 'Passionnés par les Alpes et dévoués à offrir des expériences exceptionnelles aux hôtes.',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-4xl">🧹</div>
                <div>
                  <h3 className="text-xl font-bold text-forest-800 mb-2">
                    {t({ en: 'Marie - Housekeeping Manager', fr: 'Marie - Responsable Ménage' })}
                  </h3>
                  <p className="text-gray-700">
                    {t({
                      en: 'Ensures the chalet is immaculate and welcoming for every arrival.',
                      fr: 'S\'assure que le chalet est impeccable et accueillant à chaque arrivée.',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-4xl">🔧</div>
                <div>
                  <h3 className="text-xl font-bold text-forest-800 mb-2">
                    {t({ en: 'Jean-Luc - Maintenance', fr: 'Jean-Luc - Maintenance' })}
                  </h3>
                  <p className="text-gray-700">
                    {t({
                      en: 'Local expert who keeps everything running smoothly year-round.',
                      fr: 'Expert local qui assure que tout fonctionne parfaitement toute l\'année.',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t({ en: 'Experience CosyNeige', fr: 'Découvrez le CosyNeige' })}
          </h2>
          <p className="text-xl text-forest-100 mb-8">
            {t({
              en: 'We look forward to welcoming you to our Alpine home',
              fr: 'Nous avons hâte de vous accueillir dans notre maison alpine',
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-block bg-white text-forest-800 hover:bg-cream px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {t({ en: 'Book Your Stay', fr: 'Réservez Votre Séjour' })}
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-forest-700 hover:bg-forest-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-white"
            >
              {t({ en: 'Contact Us', fr: 'Nous Contacter' })}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
