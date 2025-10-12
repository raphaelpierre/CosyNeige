import { pricing } from '@/lib/data/chalet';

// Calculate number of nights between two dates
export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  const diff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Format currency in Euros
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Get season based on date - Updated periods
export function getSeason(date: Date | string): 'high' | 'mid' | 'low' | 'summer' {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth() + 1; // 1-12
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  // High season: Vacances de Noël (Dec 20 - Jan 7), Février (all month), Pâques (variable dates)
  // Vacances de Noël
  if (month === 12 && day >= 20) return 'high';
  if (month === 1 && day <= 7) return 'high';
  
  // Février (all month)
  if (month === 2) return 'high';
  
  // Pâques (approximation: around late March/early April)
  // For simplicity, considering last week of March and first 2 weeks of April as Easter period
  if (month === 3 && day >= 24) return 'high';
  if (month === 4 && day <= 14) return 'high';

  // Basse saison: Le reste
  return 'low';
}

// Calculate total price for a booking based on dates - Updated pricing
export function calculatePrice(checkIn: Date | string, checkOut: Date | string): {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  depositAmount: number;
  total: number;
} {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const season = getSeason(checkInDate);

  // Get price per night based on season
  let pricePerNight: number;
  switch (season) {
    case 'high':
      pricePerNight = 410; // 410€ par nuit en haute saison
      break;
    case 'mid':
    case 'low':
    case 'summer':
    default:
      pricePerNight = 310; // 310€ par nuit en basse saison (le reste)
      break;
  }

  // Calculate base price (per night)
  const basePrice = pricePerNight * nights;
  const cleaningFee = pricing.cleaningFee;
  const depositAmount = pricing.depositAmount || 1500;
  const total = basePrice + cleaningFee;

  return { nights, basePrice, cleaningFee, depositAmount, total };
}

// Format date for display
export function formatDate(date: Date, locale: 'en' | 'fr' = 'fr'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Class name utility
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
