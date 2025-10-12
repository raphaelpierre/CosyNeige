import { ChaletSpecs, Location, SkiResort, Activity, Pricing, GalleryImage, Testimonial, FAQ, Translation } from '@/types';

export const chaletName = "Chalet-Balmotte810";

export const tagline: Translation = {
  en: "Your cozy mountain retreat",
  fr: "Votre refuge douillet en montagne"
};

export const specs: ChaletSpecs = {
  capacity: 10,
  bedrooms: 4,
  bathrooms: 2,
  surface: 250,
  parkingSpaces: 2
};

export const location: Location = {
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
  { icon: "🔥", label: { en: "Wood Fireplace", fr: "Cheminée à Bois" } },
  { icon: "⛷️", label: { en: "Ski Room", fr: "Local à Skis" } },
  { icon: "🍳", label: { en: "Gourmet Kitchen", fr: "Cuisine Gastronomique" } },
  { icon: "🏔️", label: { en: "Mountain Views", fr: "Vue Montagne" } },
  { icon: "📶", label: { en: "High-Speed WiFi", fr: "WiFi Haut Débit" } },
  { icon: "📺", label: { en: "Smart TV", fr: "Smart TV" } },
  { icon: "🚗", label: { en: "2 Parking Spaces", fr: "2 Places de Parking" } },
  { icon: "🔆", label: { en: "Heated Floors", fr: "Sols Chauffants" } },
  { icon: "🌄", label: { en: "Terrace", fr: "Terrasse" } },
  { icon: "🍖", label: { en: "BBQ Area", fr: "Espace Barbecue" } }
];

export const nearbyResorts: SkiResort[] = [
  { name: "Le Grand Massif (Les Carroz)", distance: 9, drivingTime: 15 },
  { name: "Les Gets", distance: 18, drivingTime: 25 },
  { name: "Flaine", distance: 17, drivingTime: 25 },
  { name: "Praz de Lys-Sommand", distance: 15, drivingTime: 25 },
  { name: "Morzine/Avoriaz", distance: 14, drivingTime: 20 },
  { name: "Chamonix-Mont-Blanc", distance: 29, drivingTime: 35 },
  { name: "Megève", distance: 26, drivingTime: 30 }
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

export const pricing: Pricing = {
  highSeason: { min: 2200, max: 2800 },
  midSeason: { min: 1600, max: 2000 },
  lowSeason: { min: 1200, max: 1400 },
  summerSeason: { min: 1800, max: 2200 },
  cleaningFee: 200,
  linenPerPerson: 25,
  minimumStay: { highSeason: 7, other: 3 }
};

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
      en: "Outstanding chalet in a charming village. Easy access to Grand Massif and Morzine. The hot tub after skiing was heavenly. Highly recommended!",
      fr: "Chalet exceptionnel dans un village charmant. Accès facile au Grand Massif et Morzine. Le jacuzzi après le ski était divin. Hautement recommandé !"
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
      en: "The chalet is not ski-in/ski-out, but is strategically located 9-15km from 3 major ski resorts (Grand Massif, Praz de Lys, Morzine). This central position gives you flexibility to choose different resorts daily.",
      fr: "Le chalet n'est pas skis aux pieds, mais est stratégiquement situé à 9-15km de 3 grandes stations (Grand Massif, Praz de Lys, Morzine). Cette position centrale vous offre la flexibilité de choisir différentes stations chaque jour."
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
  // Exterior
  { url: "/images/chalet_neige_devant.jpeg", category: "exterior", alt: { en: "Chalet-Balmotte810 exterior in winter", fr: "Chalet-Balmotte810 - Extérieur en hiver" } },
  { url: "/images/ChaletPAnoramique.jpg", category: "exterior", alt: { en: "Chalet panoramic view", fr: "Vue panoramique du chalet" } },
  { url: "/images/Chalet_Exterieur.jpg", category: "exterior", alt: { en: "Chalet exterior view", fr: "Vue extérieure du chalet" } },
  { url: "/images/Exterieur.jpg", category: "exterior", alt: { en: "Chalet exterior", fr: "Extérieur du chalet" } },
  { url: "/images/ExterieurBalcon.jpg", category: "exterior", alt: { en: "Exterior balcony view", fr: "Vue extérieure du balcon" } },
  { url: "/images/bclon Exterieur.jpg", category: "exterior", alt: { en: "Balcony exterior", fr: "Balcon extérieur" } },

  // Living Room
  { url: "/images/Salon.jpg", category: "living", alt: { en: "Living room", fr: "Salon" } },
  { url: "/images/Fauteuil.jpg", category: "living", alt: { en: "Armchair in living area", fr: "Fauteuil dans le salon" } },
  { url: "/images/FauteuilSalon.jpg", category: "living", alt: { en: "Living room armchair", fr: "Fauteuil du salon" } },
  { url: "/images/CouloirSalon.jpg", category: "living", alt: { en: "Hallway to living room", fr: "Couloir vers le salon" } },

  // Kitchen
  { url: "/images/Cuisine.jpg", category: "kitchen", alt: { en: "Gourmet kitchen", fr: "Cuisine gastronomique" } },
  { url: "/images/Cuisine2.jpg", category: "kitchen", alt: { en: "Kitchen dining area", fr: "Coin repas de la cuisine" } },

  // Bedrooms
  { url: "/images/Chambre3.jpg", category: "bedroom", alt: { en: "Bedroom 3", fr: "Chambre 3" } },
  { url: "/images/ChambreDortoir.jpg", category: "bedroom", alt: { en: "Dormitory bedroom", fr: "Chambre dortoir" } },
  { url: "/images/ChambreDortoir2.jpg", category: "bedroom", alt: { en: "Dormitory bedroom view 2", fr: "Chambre dortoir vue 2" } },

  // Bathrooms
  { url: "/images/SalledeBain1.jpg", category: "bathroom", alt: { en: "Bathroom 1", fr: "Salle de bain 1" } },
  { url: "/images/Salledebain2.jpg", category: "bathroom", alt: { en: "Bathroom 2", fr: "Salle de bain 2" } },

  // Interior Details
  { url: "/images/Hall_Etage.jpg", category: "living", alt: { en: "Upstairs hallway", fr: "Hall d'étage" } },
  { url: "/images/hallEtage2.jpg", category: "living", alt: { en: "Upstairs hallway view 2", fr: "Hall d'étage vue 2" } },

  // Wellness (keeping hot tub from Unsplash as real image not available)
  { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200", category: "wellness", alt: { en: "Hot tub with mountain views", fr: "Jacuzzi avec vue montagne" } },

  // Winter Activities
  { url: "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1200", category: "winter", alt: { en: "Skiing nearby", fr: "Ski à proximité" } },

  // Summer Activities
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", category: "summer", alt: { en: "Summer mountain landscape", fr: "Paysage de montagne en été" } },

  // Local Area
  { url: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1200", category: "local", alt: { en: "French Alps village", fr: "Village des Alpes françaises" } }
];
