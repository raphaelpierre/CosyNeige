import { ChaletSpecs, Location, SkiResort, Activity, GalleryImage, Testimonial, FAQ, Translation } from '@/types';

export const chaletName = "Chalet-Balmotte810";

export const tagline: Translation = {
  en: "Your cozy mountain retreat",
  fr: "Votre refuge douillet en montagne"
};

export const specs: ChaletSpecs = {
  capacity: 10,
  bedrooms: 4,
  bathrooms: 2,
  surface: 180,
  parkingSpaces: 5
};

export const location: Location = {
  street: "810 route de Balmotte",
  village: "Châtillon-sur-Cluses",
  region: "Haute-Savoie",
  department: "Haute-Savoie",
  postalCode: "74300",
  altitude: 732,
  latitude: 46.0833,
  longitude: 6.5667
};

export const description: Translation = {
  en: "Nestled in the charming village of Châtillon-sur-Cluses, Chalet-Balmotte810 offers an authentic Savoyard experience with modern luxury. Perfectly positioned between the Arve and Giffre valleys, our chalet provides unparalleled access to multiple world-class ski resorts while maintaining the peace and charm of a traditional Alpine village. The historic setting, crowned by medieval castle ruins, creates a unique atmosphere where heritage meets contemporary comfort.",
  fr: "Niché dans le charmant village de Châtillon-sur-Cluses, Chalet-Balmotte810 offre une expérience savoyarde authentique avec un luxe moderne. Parfaitement situé entre les vallées de l'Arve et du Giffre, notre chalet offre un accès incomparable à plusieurs stations de ski de classe mondiale tout en conservant la paix et le charme d'un village alpin traditionnel. Le cadre historique, couronné par les ruines d'un château médiéval, crée une atmosphère unique où le patrimoine rencontre le confort contemporain."
};

export const amenities: { icon: string; label: Translation }[] = [
  { icon: "♨️", label: { en: "Outdoor Hot Tub", fr: "Jacuzzi Extérieur" } },
  { icon: "🔥", label: { en: "Stone Fireplace", fr: "Cheminée en Pierre" } },
  { icon: "⛷️", label: { en: "Ski Room & Boot Warmers", fr: "Local à Skis & Chauffe-chaussures" } },
  { icon: "🍳", label: { en: "Gourmet Kitchen", fr: "Cuisine Gastronomique" } },
  { icon: "🏔️", label: { en: "Mountain Views", fr: "Vue Montagne" } },
  { icon: "📶", label: { en: "High-Speed WiFi", fr: "WiFi Haut Débit" } },
  { icon: "📺", label: { en: "65\" Smart TV", fr: "Smart TV 65\"" } },
  { icon: "🚗", label: { en: "5 Parking Spaces", fr: "5 Places de Parking" } },
  { icon: "🔆", label: { en: "Heated Floors", fr: "Sols Chauffants" } },
  { icon: "🌄", label: { en: "Mountain Terrace", fr: "Terrasse Montagne" } },
  { icon: "🍖", label: { en: "Professional BBQ", fr: "BBQ Professionnel" } },
  { icon: "🧺", label: { en: "Laundry Facilities", fr: "Buanderie Équipée" } },
  { icon: "☕", label: { en: "Nespresso Machine", fr: "Machine Nespresso" } }
];

export const nearbyResorts: SkiResort[] = [
  { name: "Les Carroz (Grand Massif)", distance: 9, drivingTime: 15 },
  { name: "Les Gets (Portes du Soleil)", distance: 18, drivingTime: 25 },
  { name: "Flaine (Grand Massif)", distance: 17, drivingTime: 25 },
  { name: "Praz de Lys-Sommand", distance: 15, drivingTime: 25 },
  { name: "Morzine (Portes du Soleil)", distance: 14, drivingTime: 20 },
  { name: "Chamonix-Mont-Blanc", distance: 29, drivingTime: 35 },
  { name: "Megève (Evasion Mont-Blanc)", distance: 26, drivingTime: 30 }
];

export const activities: Activity[] = [
  {
    name: { en: "Skiing & Snowboarding", fr: "Ski & Snowboard" },
    description: { en: "Access to 5 major ski resorts within 30 minutes", fr: "Accès à 5 grandes stations de ski en 30 minutes" },
    season: "winter",
    image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800"
  },
  {
    name: { en: "Hiking", fr: "Randonnée" },
    description: { en: "Pointe d'Orchez and countless Alpine trails", fr: "Pointe d'Orchez et innombrables sentiers alpins" },
    season: "summer",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800"
  },
  {
    name: { en: "Sixt-Fer-à-Cheval", fr: "Sixt-Fer-à-Cheval" },
    description: { en: "Most beautiful village & nature reserve", fr: "Plus beau village & réserve naturelle" },
    season: "all",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    name: { en: "Mountain Biking", fr: "VTT" },
    description: { en: "Trails through valleys and forests", fr: "Sentiers à travers vallées et forêts" },
    season: "summer",
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800"
  },
  {
    name: { en: "Snowshoeing", fr: "Raquettes" },
    description: { en: "Peaceful winter walks in pristine nature", fr: "Promenades hivernales paisibles" },
    season: "winter",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800"
  },
  {
    name: { en: "Lake Annecy", fr: "Lac d'Annecy" },
    description: { en: "Crystal clear lake, 60km away", fr: "Lac cristallin à 60km" },
    season: "summer",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
  }
];

export const testimonials: Testimonial[] = [
  {
    name: "Sophie & Pierre Martin",
    location: "Lyon, France",
    rating: 5,
    comment: {
      en: "Perfect location between multiple ski resorts! The chalet is beautifully decorated and the hot tub with mountain views is incredible. We loved the authentic village atmosphere.",
      fr: "Emplacement parfait entre plusieurs stations de ski ! Le chalet est magnifiquement décoré et le jacuzzi avec vue sur les montagnes est incroyable. Nous avons adoré l'atmosphère authentique du village."
    },
    date: "February 2025"
  },
  {
    name: "James & Emma Wilson",
    location: "London, UK",
    rating: 5,
    comment: {
      en: "Outstanding chalet in a charming village. Easy access to Grand Massif and Portes du Soleil. The hot tub after skiing was heavenly. Highly recommended!",
      fr: "Chalet exceptionnel dans un village charmant. Accès facile au Grand Massif et Portes du Soleil. Le jacuzzi après le ski était divin. Hautement recommandé !"
    },
    date: "January 2025"
  }
];

export const faqs: FAQ[] = [
  {
    question: { en: "What is the best time to visit?", fr: "Quelle est la meilleure période pour visiter ?" },
    answer: {
      en: "Winter (December-April) for skiing and snowsports. Summer (June-September) for hiking and mountain activities. The strategic location between two valleys offers activities year-round.",
      fr: "Hiver (décembre-avril) pour le ski et les sports de neige. Été (juin-septembre) pour la randonnée et les activités de montagne. L'emplacement stratégique entre deux vallées offre des activités toute l'année."
    }
  },
  {
    question: { en: "How do I get there from Geneva airport?", fr: "Comment s'y rendre depuis l'aéroport de Genève ?" },
    answer: {
      en: "Châtillon-sur-Cluses is 50km from Geneva Airport (50 minutes by car). We can arrange airport transfers. Alternatively, take a train to Cluses station (7km away) and we'll arrange pickup.",
      fr: "Châtillon-sur-Cluses est à 50km de l'aéroport de Genève (50 minutes en voiture). Nous pouvons organiser des transferts aéroport. Sinon, prenez un train jusqu'à la gare de Cluses (7km) et nous organiserons le transport."
    }
  },
  {
    question: { en: "Is the chalet ski-in/ski-out?", fr: "Le chalet est-il skis aux pieds ?" },
    answer: {
      en: "The chalet is not ski-in/ski-out, but is strategically located 9-15km from 3 major ski resorts (Grand Massif, Praz de Lys, Portes du Soleil). This central position gives you flexibility to choose different resorts daily.",
      fr: "Le chalet n'est pas skis aux pieds, mais est stratégiquement situé à 9-15km de 3 grandes stations (Grand Massif, Praz de Lys, Portes du Soleil). Cette position centrale vous offre la flexibilité de choisir différentes stations chaque jour."
    }
  },
  {
    question: { en: "What's included in the rental?", fr: "Qu'est-ce qui est inclus dans la location ?" },
    answer: {
      en: "Includes: WiFi, heating, firewood, ski room with boot warmers, parking, all kitchen equipment, welcome basket. Optional extras: linen (€25/person), cleaning (€200), airport transfer.",
      fr: "Inclus : WiFi, chauffage, bois de chauffage, local à skis avec chauffe-chaussures, parking, tout l'équipement de cuisine, panier de bienvenue. Options supplémentaires : linge (25€/personne), ménage (200€), transfert aéroport."
    }
  }
];

export const galleryImages: GalleryImage[] = [
  // Exterior - Meilleures vues en premier
  { url: "/images/vuehaute_pagedegarde.webp", category: "exterior", alt: { en: "Aerial view cover photo", fr: "Vue aérienne photo de couverture" } },
  { url: "/images/ChaletPAnoramiqueVueHaut.webp", category: "exterior", alt: { en: "Chalet panoramic view from above", fr: "Vue panoramique du chalet d'en haut" } },
  { url: "/images/ChaletPAnoramique.webp", category: "exterior", alt: { en: "Wide panoramic chalet view", fr: "Vue panoramique large du chalet" } },
  { url: "/images/Chalet_Exterieur.webp", category: "exterior", alt: { en: "Chalet main exterior view", fr: "Vue extérieure principale du chalet" } },
  { url: "/images/chalet_neige_devant.webp", category: "exterior", alt: { en: "Chalet in winter with snow", fr: "Chalet en hiver avec neige" } },
  { url: "/images/chaletneigedehors.webp", category: "exterior", alt: { en: "Chalet winter view from outside", fr: "Vue hivernale du chalet de l'extérieur" } },
  { url: "/images/VueEnsemble.webp", category: "exterior", alt: { en: "Chalet overall view", fr: "Vue d'ensemble du chalet" } },
  { url: "/images/exterieur_terrase_devant.webp", category: "exterior", alt: { en: "Front terrace view", fr: "Vue terrasse devant" } },
  { url: "/images/exterieur_avant.webp", category: "exterior", alt: { en: "Front view of the chalet", fr: "Vue de face du chalet" } },
  { url: "/images/Exterieur.webp", category: "exterior", alt: { en: "Chalet exterior in summer", fr: "Extérieur du chalet en été" } },
  { url: "/images/Exterieur2.webp", category: "exterior", alt: { en: "Chalet exterior view 2", fr: "Extérieur du chalet vue 2" } },
  { url: "/images/Exterieur3.webp", category: "exterior", alt: { en: "Chalet exterior view 3", fr: "Extérieur du chalet vue 3" } },
  { url: "/images/ExterieurBalcon.webp", category: "exterior", alt: { en: "Exterior balcony with mountain view", fr: "Balcon extérieur avec vue montagne" } },
  { url: "/images/Terrasse1.webp", category: "exterior", alt: { en: "Terrace with mountain views", fr: "Terrasse avec vue montagne" } },
  { url: "/images/entre2vallees.webp", category: "exterior", alt: { en: "Between two valleys - strategic location", fr: "Entre deux vallées - position stratégique" } },

  // Wellness & Relaxation
  { url: "/images/ExteriieurJacuzi.webp", category: "wellness", alt: { en: "Outdoor hot tub with mountain views", fr: "Jacuzzi extérieur avec vue montagne" } },
  { url: "/images/jacusi.webp", category: "wellness", alt: { en: "Hot tub evening view", fr: "Jacuzzi vue soirée" } },

  // Living Room - Espaces de vie
  { url: "/images/Salon2.webp", category: "living", alt: { en: "Main living room with fireplace", fr: "Salon principal avec cheminée" } },
  { url: "/images/VueSalonBas.webp", category: "living", alt: { en: "Ground floor living room view", fr: "Vue du salon rez-de-chaussée" } },
  { url: "/images/VueSalonBasJardin.webp", category: "living", alt: { en: "Living room with garden view", fr: "Salon avec vue sur jardin" } },
  { url: "/images/Salon2_Etage.webp", category: "living", alt: { en: "Upstairs living room lounge", fr: "Salon d'étage" } },
  { url: "/images/Salon1.webp", category: "living", alt: { en: "Cozy living room atmosphere", fr: "Ambiance chaleureuse du salon" } },
  { url: "/images/Salon.webp", category: "living", alt: { en: "Living room overview", fr: "Vue d'ensemble du salon" } },
  { url: "/images/Fauteuil.webp", category: "living", alt: { en: "Cozy armchair corner", fr: "Coin fauteuil confortable" } },
  { url: "/images/FauteuilSalon.webp", category: "living", alt: { en: "Armchair in living room", fr: "Fauteuil dans le salon" } },
  { url: "/images/CouloirSalon.webp", category: "living", alt: { en: "Hallway to living room", fr: "Couloir vers le salon" } },
  { url: "/images/Hall_Etage.webp", category: "living", alt: { en: "Upstairs hallway", fr: "Hall d'étage" } },
  { url: "/images/hallEtage2.webp", category: "living", alt: { en: "Upstairs landing", fr: "Palier de l'étage" } },

  // Kitchen - Cuisine
  { url: "/images/Cuisine1.webp", category: "kitchen", alt: { en: "Kitchen with dining table", fr: "Cuisine avec table à manger" } },
  { url: "/images/Cuisine2.webp", category: "kitchen", alt: { en: "Modern fully equipped kitchen", fr: "Cuisine moderne entièrement équipée" } },
  { url: "/images/Cuisine.webp", category: "kitchen", alt: { en: "Gourmet kitchen", fr: "Cuisine gastronomique" } },
  { url: "/images/SalleAmanger.webp", category: "kitchen", alt: { en: "Dining room with large table", fr: "Salle à manger avec grande table" } },

  // Bedrooms - Chambres
  { url: "/images/Chambre4.webp", category: "bedroom", alt: { en: "Master suite with mountain view", fr: "Suite master avec vue montagne" } },
  { url: "/images/Chambre23.webp", category: "bedroom", alt: { en: "Emerald bedroom with garden view", fr: "Chambre Émeraude avec vue jardin" } },
  { url: "/images/ChambreDortoir2.webp", category: "bedroom", alt: { en: "Sapphire bedroom cozy atmosphere", fr: "Chambre Saphir ambiance cosy" } },
  { url: "/images/ChambreDortoir.webp", category: "bedroom", alt: { en: "Family dormitory three single beds", fr: "Dortoir familial trois lits simples" } },
  { url: "/images/chambre__2.webp", category: "bedroom", alt: { en: "Ruby bedroom peaceful retreat", fr: "Chambre Rubis refuge paisible" } },
  { url: "/images/Chambre3.webp", category: "bedroom", alt: { en: "Comfortable bedroom queen bed", fr: "Chambre confortable lit queen" } },

  // Bathrooms - Salles de bain
  { url: "/images/SalledeBain1.webp", category: "bathroom", alt: { en: "Prestige suite bathroom with italian shower", fr: "Salle de bain Suite Prestige avec douche italienne" } },
  { url: "/images/salleDebain_GrabnBaignire.webp", category: "bathroom", alt: { en: "Family spa bathroom with deep tub", fr: "Salle de bain Spa Familial avec grande baignoire" } },
  { url: "/images/Salledebain2.webp", category: "bathroom", alt: { en: "Bathroom with modern fixtures", fr: "Salle de bain avec équipements modernes" } }
];
