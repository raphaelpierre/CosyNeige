'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { fetchSeasons, findSeasonForDate, type SeasonPeriod, type PricingSettings } from '@/lib/utils/pricing';

interface BookedPeriod {
  start: Date;
  end: Date;
}

interface BookingCalendarProps {
  onDateSelect?: (checkIn: Date | null, checkOut: Date | null) => void;
}

export default function BookingCalendar({ onDateSelect }: BookingCalendarProps) {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);
  const [bookedPeriods, setBookedPeriods] = useState<BookedPeriod[]>([]);
  const [seasons, setSeasons] = useState<SeasonPeriod[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSelectMessage, setAutoSelectMessage] = useState<string | null>(null);

  // Récupérer les périodes réservées et les saisons depuis l'API
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBookedPeriods(), loadSeasons()]);
    };
    loadData();
  }, []);

  const fetchBookedPeriods = async () => {
    try {
      const response = await fetch('/api/booked-periods');
      if (response.ok) {
        const data = await response.json();
        const periods = data.map((period: { startDate: string; endDate: string }) => ({
          start: new Date(period.startDate),
          end: new Date(period.endDate)
        }));
        setBookedPeriods(periods);
      }
    } catch (error) {
      console.error('Error fetching booked periods:', error);
    }
  };

  const loadSeasons = async () => {
    try {
      const { seasons: loadedSeasons, pricingSettings: loadedPricingSettings } = await fetchSeasons();
      setSeasons(loadedSeasons);
      setPricingSettings(loadedPricingSettings);
    } catch (error) {
      console.error('Error loading seasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateBooked = (date: Date) => {
    return bookedPeriods.some(period => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const start = new Date(period.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(period.end);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedCheckIn) return false;
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const checkIn = new Date(selectedCheckIn);
    checkIn.setHours(0, 0, 0, 0);

    if (!selectedCheckOut) {
      return checkDate.getTime() === checkIn.getTime();
    }

    const checkOut = new Date(selectedCheckOut);
    checkOut.setHours(0, 0, 0, 0);
    return checkDate >= checkIn && checkDate <= checkOut;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date) || isDateBooked(date)) return;

    // Créer une copie de la date pour éviter les problèmes de fuseau horaire
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Si on clique sur la date de check-in déjà sélectionnée, tout effacer
    if (selectedCheckIn && localDate.getTime() === selectedCheckIn.getTime()) {
      setSelectedCheckIn(null);
      setSelectedCheckOut(null);
      onDateSelect?.(null, null);
      setAutoSelectMessage(null);
      return;
    }

    // Si on clique sur la date de check-out déjà sélectionnée, l'effacer seulement
    if (selectedCheckOut && localDate.getTime() === selectedCheckOut.getTime()) {
      setSelectedCheckOut(null);
      onDateSelect?.(selectedCheckIn, null);
      setAutoSelectMessage(null);
      return;
    }

    // Si les deux dates sont sélectionnées, permettre de modifier le checkout
    if (selectedCheckIn && selectedCheckOut) {
      const checkIn = new Date(selectedCheckIn);
      checkIn.setHours(0, 0, 0, 0);
      const clickDate = new Date(localDate);
      clickDate.setHours(0, 0, 0, 0);

      // Si on clique après le check-in, mettre à jour le check-out
      if (clickDate > checkIn) {
        setSelectedCheckOut(localDate);
        onDateSelect?.(selectedCheckIn, localDate);
        setAutoSelectMessage(null);
        return;
      } else {
        // Si on clique avant le check-in, recommencer une nouvelle sélection
        setSelectedCheckIn(localDate);
        setAutoSelectMessage(null);

        // Auto-sélectionner le séjour minimum selon la saison
        if (pricingSettings) {
          const season = findSeasonForDate(localDate, seasons);
          const isHighSeason = season?.seasonType === 'high';
          const minimumStay = isHighSeason
            ? pricingSettings.highSeasonMinimumStay
            : pricingSettings.defaultMinimumStay;

          const autoCheckOut = new Date(localDate);
          autoCheckOut.setDate(localDate.getDate() + minimumStay);
          setSelectedCheckOut(autoCheckOut);
          onDateSelect?.(localDate, autoCheckOut);

          // Afficher le message d'auto-sélection
          const seasonName = isHighSeason
            ? t({ en: 'high season', fr: 'haute saison' })
            : t({ en: 'low season', fr: 'basse saison' });
          setAutoSelectMessage(
            t({
              en: `${minimumStay} nights automatically selected (${seasonName} - minimum stay)`,
              fr: `${minimumStay} nuits sélectionnées automatiquement (${seasonName} - séjour minimum)`
            })
          );
          setTimeout(() => setAutoSelectMessage(null), 5000);
        } else {
          setSelectedCheckOut(null);
          onDateSelect?.(localDate, null);
        }
        return;
      }
    }

    if (!selectedCheckIn) {
      // Première sélection : check-in
      setSelectedCheckIn(localDate);

      // Auto-sélectionner le séjour minimum selon la saison
      if (pricingSettings) {
        const season = findSeasonForDate(localDate, seasons);
        const isHighSeason = season?.seasonType === 'high';
        const minimumStay = isHighSeason
          ? pricingSettings.highSeasonMinimumStay
          : pricingSettings.defaultMinimumStay;

        const autoCheckOut = new Date(localDate);
        autoCheckOut.setDate(localDate.getDate() + minimumStay);
        setSelectedCheckOut(autoCheckOut);
        onDateSelect?.(localDate, autoCheckOut);

        // Afficher le message d'auto-sélection
        const seasonName = isHighSeason
          ? t({ en: 'high season', fr: 'haute saison' })
          : t({ en: 'low season', fr: 'basse saison' });
        setAutoSelectMessage(
          t({
            en: `${minimumStay} nights automatically selected (${seasonName} - minimum stay)`,
            fr: `${minimumStay} nuits sélectionnées automatiquement (${seasonName} - séjour minimum)`
          })
        );
        // Masquer le message après 5 secondes
        setTimeout(() => setAutoSelectMessage(null), 5000);
      } else {
        setSelectedCheckOut(null);
        onDateSelect?.(localDate, null);
      }
    } else if (!selectedCheckOut) {
      // Deuxième sélection : check-out
      if (localDate < selectedCheckIn) {
        // Si la date est avant le check-in, inverser
        setSelectedCheckOut(selectedCheckIn);
        setSelectedCheckIn(localDate);
        onDateSelect?.(localDate, selectedCheckIn);
        setAutoSelectMessage(null);
      } else {
        setSelectedCheckOut(localDate);
        onDateSelect?.(selectedCheckIn, localDate);
        setAutoSelectMessage(null);
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });

  const weekDays = language === 'fr'
    ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];

  // Espaces vides avant le premier jour
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isBooked = isDateBooked(date);
    const isPast = isPastDate(date);
    const isSelected = isDateSelected(date);

    let className = "aspect-square flex items-center justify-center rounded-lg text-sm md:text-xs lg:text-sm font-medium transition-colors touch-manipulation min-h-[44px] md:min-h-[32px] lg:min-h-[36px] ";

    if (isPast) {
      className += "text-gray-300 cursor-not-allowed";
    } else if (isBooked) {
      className += "bg-red-100 text-red-800 cursor-not-allowed";
    } else if (isSelected) {
      className += "bg-blue-500 text-white font-extrabold cursor-pointer active:scale-95 ring-2 ring-blue-600 ring-offset-2 shadow-lg";
    } else {
      className += "bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer active:bg-green-200 active:scale-95";
    }

    days.push(
      <div
        key={day}
        className={className}
        onClick={() => handleDateClick(date)}
        title={isBooked ? t({ en: 'Booked', fr: 'Réservé' }) : t({ en: 'Available', fr: 'Disponible' })}
      >
        {day}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-3 lg:p-4">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between mb-4 md:mb-2 lg:mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-3 md:p-1.5 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation active:scale-95"
          aria-label={t({ en: 'Previous month', fr: 'Mois précédent' })}
        >
          <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg md:text-sm lg:text-base font-bold text-slate-900 capitalize">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="p-3 md:p-1.5 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation active:scale-95"
          aria-label={t({ en: 'Next month', fr: 'Mois suivant' })}
        >
          <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Message d'auto-sélection */}
      {autoSelectMessage && (
        <div className="mb-4 md:mb-2 lg:mb-3 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm md:text-xs lg:text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{autoSelectMessage}</span>
          </div>
        </div>
      )}

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 md:gap-1 lg:gap-1.5 mb-1 md:mb-1 lg:mb-1.5">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-xs md:text-[10px] lg:text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 md:gap-1 lg:gap-1.5">
        {days}
      </div>

      {/* Légende */}
      <div className="mt-6 md:mt-3 lg:mt-4 pt-6 md:pt-3 lg:pt-4 border-t border-gray-200 flex flex-wrap gap-3 md:gap-1.5 lg:gap-2 justify-center text-sm md:text-[10px] lg:text-xs">
        <div className="flex items-center gap-2 md:gap-1">
          <div className="w-4 h-4 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-green-50 border border-green-200 rounded" />
          <span className="text-gray-700">{t({ en: 'Available', fr: 'Disponible' })}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-1">
          <div className="w-4 h-4 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-blue-500 border-2 border-blue-600 rounded shadow-sm relative">
            <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[6px] lg:text-[7px] text-white font-bold">✓</span>
          </div>
          <span className="text-gray-700 font-semibold">{t({ en: 'Selected', fr: 'Sélectionné' })}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-1">
          <div className="w-4 h-4 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-red-100 border border-red-200 rounded" />
          <span className="text-gray-700">{t({ en: 'Booked', fr: 'Réservé' })}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-1">
          <div className="w-4 h-4 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-gray-100 border border-gray-200 rounded" />
          <span className="text-gray-700">{t({ en: 'Past', fr: 'Passé' })}</span>
        </div>
      </div>
    </div>
  );
}
