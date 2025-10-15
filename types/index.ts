// Language types
export type Language = 'en' | 'fr';

export interface Translation {
  en: string;
  fr: string;
}

// Chalet data types
export interface ChaletSpecs {
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  parkingSpaces: number;
}

export interface Location {
  street?: string;
  village: string;
  region: string;
  department?: string;
  postalCode?: string;
  altitude: number;
  latitude: number;
  longitude: number;
}

export interface SkiResort {
  name: string;
  distance: number;
  drivingTime: number;
}

export interface Activity {
  name: Translation;
  description: Translation;
  season: 'summer' | 'winter' | 'all';
  image: string;
  icon?: string;
}

export interface Pricing {
  highSeason: { min: number; max: number };
  midSeason: { min: number; max: number };
  lowSeason: { min: number; max: number };
  summerSeason: { min: number; max: number };
  cleaningFee: number;
  linenPerPerson: number;
  depositAmount?: number;
  minimumStay: { highSeason: number; other: number };
}

export interface GalleryImage {
  url: string;
  category: 'exterior' | 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'wellness' | 'terrace' | 'winter' | 'summer' | 'local';
  alt: Translation;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: Translation;
  date: string;
}

export interface FAQ {
  question: Translation;
  answer: Translation;
}

export interface BookingRequest {
  checkIn: Date;
  checkOut: Date;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  paymentStatus?: string;
  stripePaymentId?: string;
  depositAmount?: number;
  message?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  fromUserId?: string;
  fromEmail: string;
  fromName: string;
  isFromAdmin: boolean;
  read: boolean;
  replyTo?: string;
  createdAt: string;
  // Additional fields for admin interface compatibility
  name?: string;
  email?: string;
  message?: string;
  date?: string;
}
