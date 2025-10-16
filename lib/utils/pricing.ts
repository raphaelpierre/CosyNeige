// Nouvelles fonctions de pricing basées sur la base de données

export interface SeasonPeriod {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  seasonType: string;
  pricePerNight: number;
  minimumStay: number;
  sundayToSunday: boolean;
  year: number;
  isActive: boolean;
}

export interface PricingSettings {
  cleaningFee: number;
  linenPerPerson: number;
  depositAmount: number;
  defaultHighSeasonPrice: number;
  defaultLowSeasonPrice: number;
  defaultMinimumStay: number;
  highSeasonMinimumStay: number;
}

// Cache pour les saisons (éviter trop d'appels à la DB)
let seasonsCache: SeasonPeriod[] | null = null;
let pricingSettingsCache: PricingSettings | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour récupérer les saisons depuis l'API
export async function fetchSeasons(): Promise<{ seasons: SeasonPeriod[], pricingSettings: PricingSettings }> {
  const now = Date.now();

  // Utiliser le cache si valide
  if (seasonsCache && pricingSettingsCache && (now - lastFetch) < CACHE_DURATION) {
    return { seasons: seasonsCache, pricingSettings: pricingSettingsCache };
  }

  try {
    const response = await fetch('/api/seasons', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seasons');
    }

    const data = await response.json();
    seasonsCache = data.seasons;
    pricingSettingsCache = data.pricingSettings;
    lastFetch = now;

    return { seasons: data.seasons, pricingSettings: data.pricingSettings };
  } catch (error) {
    console.error('Error fetching seasons:', error);

    // Fallback aux valeurs par défaut
    if (seasonsCache && pricingSettingsCache) {
      return { seasons: seasonsCache, pricingSettings: pricingSettingsCache };
    }

    // Valeurs par défaut si aucun cache
    return {
      seasons: [],
      pricingSettings: {
        cleaningFee: 700,
        linenPerPerson: 25,
        depositAmount: 1500,
        defaultHighSeasonPrice: 410,
        defaultLowSeasonPrice: 310,
        defaultMinimumStay: 3,
        highSeasonMinimumStay: 7
      }
    };
  }
}

// Trouver la saison pour une date donnée
export function findSeasonForDate(date: Date | string, seasons: SeasonPeriod[]): SeasonPeriod | null {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  for (const season of seasons) {
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);

    if (dateObj >= startDate && dateObj <= endDate) {
      return season;
    }
  }

  return null;
}

// Obtenir le prix pour une date donnée
export function getPriceForDate(
  date: Date | string,
  seasons: SeasonPeriod[],
  pricingSettings: PricingSettings
): number {
  const season = findSeasonForDate(date, seasons);

  if (season) {
    return season.pricePerNight;
  }

  // Par défaut, utiliser le prix basse saison
  return pricingSettings.defaultLowSeasonPrice;
}

// Calculer le nombre de nuits
export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  const diff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculer le prix total avec détails nuit par nuit
export function calculatePriceWithSeasons(
  checkIn: Date | string,
  checkOut: Date | string,
  seasons: SeasonPeriod[],
  pricingSettings: PricingSettings
): {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  depositAmount: number;
  total: number;
  breakdown: Array<{ date: string; season: string; price: number; periodName?: string }>;
} {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;

  let basePrice = 0;
  const breakdown: Array<{ date: string; season: string; price: number; periodName?: string }> = [];

  for (let i = 0; i < nights; i++) {
    const currentNight = new Date(checkInDate);
    currentNight.setDate(checkInDate.getDate() + i);

    const season = findSeasonForDate(currentNight, seasons);
    const price = season ? season.pricePerNight : pricingSettings.defaultLowSeasonPrice;

    basePrice += price;
    breakdown.push({
      date: currentNight.toISOString().split('T')[0],
      season: season ? season.seasonType : 'low',
      price: price,
      periodName: season?.name
    });
  }

  const cleaningFee = pricingSettings.cleaningFee;
  const depositAmount = pricingSettings.depositAmount;
  const total = basePrice + cleaningFee;

  return { nights, basePrice, cleaningFee, depositAmount, total, breakdown };
}

// Vérifier si une période contient des jours de haute saison
export function containsHighSeasonDays(
  checkIn: Date | string,
  checkOut: Date | string,
  seasons: SeasonPeriod[]
): boolean {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;

  for (let i = 0; i < nights; i++) {
    const currentNight = new Date(checkInDate);
    currentNight.setDate(checkInDate.getDate() + i);

    const season = findSeasonForDate(currentNight, seasons);
    if (season && season.seasonType === 'high') {
      return true;
    }
  }

  return false;
}

// Vérifier si une date est un dimanche
export function isSunday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getDay() === 0;
}

// Valider les dates de réservation selon les règles
export function validateBookingDatesWithSeasons(
  checkIn: Date | string,
  checkOut: Date | string,
  seasons: SeasonPeriod[],
  pricingSettings: PricingSettings
): {
  isValid: boolean;
  error?: string;
  errorFr?: string;
} {
  const nights = calculateNights(checkIn, checkOut);
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;

  // Vérifier chaque nuit pour trouver les règles applicables
  let hasHighSeason = false;
  let requiresSundayToSunday = false;

  for (let i = 0; i < nights; i++) {
    const currentNight = new Date(checkInDate);
    currentNight.setDate(checkInDate.getDate() + i);

    const season = findSeasonForDate(currentNight, seasons);
    if (season) {
      if (season.seasonType === 'high') {
        hasHighSeason = true;
      }
      if (season.sundayToSunday) {
        requiresSundayToSunday = true;
      }
    }
  }

  // Déterminer le séjour minimum selon la saison
  const minimumStay = hasHighSeason
    ? pricingSettings.highSeasonMinimumStay
    : pricingSettings.defaultMinimumStay;

  // Vérification du séjour minimum
  if (nights < minimumStay) {
    return {
      isValid: false,
      error: `Minimum stay of ${minimumStay} nights required for this period`,
      errorFr: `Séjour minimum de ${minimumStay} nuits requis pour cette période`
    };
  }

  // Vérification dimanche à dimanche
  if (requiresSundayToSunday) {
    const checkInIsSunday = isSunday(checkInDate);
    const checkOutIsSunday = isSunday(checkOutDate);

    if (!checkInIsSunday || !checkOutIsSunday) {
      return {
        isValid: false,
        error: 'This period requires Sunday to Sunday bookings',
        errorFr: 'Cette période nécessite des réservations du dimanche au dimanche'
      };
    }
  }

  return { isValid: true };
}

// Invalider le cache (utile après mise à jour des saisons)
export function invalidateCache() {
  seasonsCache = null;
  pricingSettingsCache = null;
  lastFetch = 0;
}
