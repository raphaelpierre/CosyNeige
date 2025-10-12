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

// Get season based on date
export function getSeason(date: Date | string): 'high' | 'mid' | 'low' | 'summer' {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth() + 1; // 1-12
  const day = dateObj.getDate();

  // High season: December 15 - January 7, February
  if (month === 12 && day >= 15) return 'high';
  if (month === 1 && day <= 7) return 'high';
  if (month === 2) return 'high';

  // Summer season: June, July, August
  if (month === 6 || month === 7 || month === 8) return 'summer';

  // Mid season: January (after 7th), March
  if (month === 1 && day > 7) return 'mid';
  if (month === 3) return 'mid';

  // Low season: April, November, early December
  return 'low';
}

// Calculate total price for a booking based on dates
export function calculatePrice(checkIn: Date | string, checkOut: Date | string): {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  total: number;
} {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const season = getSeason(checkInDate);

  // Get price per week based on season
  let pricePerWeek: number;
  switch (season) {
    case 'high':
      pricePerWeek = pricing.highSeason.min;
      break;
    case 'mid':
      pricePerWeek = pricing.midSeason.min;
      break;
    case 'low':
      pricePerWeek = pricing.lowSeason.min;
      break;
    case 'summer':
      pricePerWeek = pricing.summerSeason.min;
      break;
  }

  // Calculate base price (prorated by week)
  const weeks = nights / 7;
  const basePrice = Math.round(pricePerWeek * weeks);
  const cleaningFee = pricing.cleaningFee;
  const total = basePrice + cleaningFee;

  return { nights, basePrice, cleaningFee, total };
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
