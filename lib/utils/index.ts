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

// Calculate total price for a booking based on dates - Updated pricing with night-by-night calculation
export function calculatePrice(checkIn: Date | string, checkOut: Date | string): {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  depositAmount: number;
  total: number;
  breakdown: Array<{ date: string; season: string; price: number }>; // Détail nuit par nuit
} {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;

  // Calculate price night by night to handle cross-season bookings
  let basePrice = 0;
  const breakdown: Array<{ date: string; season: string; price: number }> = [];

  for (let i = 0; i < nights; i++) {
    const currentNight = new Date(checkInDate);
    currentNight.setDate(checkInDate.getDate() + i);

    const season = getSeason(currentNight);
    const pricePerNight = season === 'high' ? 410 : 310;

    basePrice += pricePerNight;
    breakdown.push({
      date: currentNight.toISOString().split('T')[0],
      season: season,
      price: pricePerNight
    });
  }

  const cleaningFee = pricing.cleaningFee;
  const depositAmount = pricing.depositAmount || 1500;
  const total = basePrice + cleaningFee;

  return { nights, basePrice, cleaningFee, depositAmount, total, breakdown };
}

// Format date for display
export function formatDate(date: Date, locale: 'en' | 'fr' = 'fr'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Check if a date is Sunday (0 = Sunday)
export function isSunday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getDay() === 0;
}

// Check if a booking period contains any high season days
export function containsHighSeasonDays(checkIn: Date | string, checkOut: Date | string): boolean {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;

  for (let i = 0; i < nights; i++) {
    const currentNight = new Date(checkInDate);
    currentNight.setDate(checkInDate.getDate() + i);

    if (getSeason(currentNight) === 'high') {
      return true;
    }
  }
  return false;
}

// Validate booking dates according to high season rules
export function validateBookingDates(
  checkIn: Date | string,
  checkOut: Date | string
): {
  isValid: boolean;
  error?: string;
  errorFr?: string;
} {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  const hasHighSeasonDays = containsHighSeasonDays(checkIn, checkOut);

  // Rule 1: If booking contains high season days, minimum 7 nights
  if (hasHighSeasonDays && nights < 7) {
    return {
      isValid: false,
      error: 'Bookings during holiday periods require a minimum of 7 nights',
      errorFr: 'Les réservations pendant les périodes de vacances nécessitent un minimum de 7 nuits'
    };
  }

  // Rule 2: If booking contains high season days, must be Sunday to Sunday
  if (hasHighSeasonDays) {
    const checkInIsSunday = isSunday(checkInDate);
    const checkOutIsSunday = isSunday(checkOutDate);

    if (!checkInIsSunday || !checkOutIsSunday) {
      return {
        isValid: false,
        error: 'Holiday period bookings must run from Sunday to Sunday',
        errorFr: 'Les réservations pendant les vacances doivent se faire du dimanche au dimanche'
      };
    }
  }

  // Rule 3: Low season minimum 3 nights
  if (!hasHighSeasonDays && nights < 3) {
    return {
      isValid: false,
      error: 'Minimum stay of 3 nights required',
      errorFr: 'Séjour minimum de 3 nuits requis'
    };
  }

  return { isValid: true };
}

// Class name utility
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
