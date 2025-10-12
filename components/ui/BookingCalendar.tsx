'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

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
  const [loading, setLoading] = useState(true);

  // Récupérer les périodes réservées depuis l'API
  useEffect(() => {
    fetchBookedPeriods();
  }, []);

  const fetchBookedPeriods = async () => {
    try {
      const response = await fetch('/api/booked-periods');
      if (response.ok) {
        const data = await response.json();
        const periods = data.map((period: any) => ({
          start: new Date(period.startDate),
          end: new Date(period.endDate)
        }));
        setBookedPeriods(periods);
      }
    } catch (error) {
      console.error('Error fetching booked periods:', error);
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

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // Nouvelle sélection
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
      onDateSelect?.(date, null);
    } else {
      // Sélection de la date de fin
      if (date < selectedCheckIn) {
        // Si la date est avant le check-in, inverser
        setSelectedCheckOut(selectedCheckIn);
        setSelectedCheckIn(date);
        onDateSelect?.(date, selectedCheckIn);
      } else {
        setSelectedCheckOut(date);
        onDateSelect?.(selectedCheckIn, date);
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

    let className = "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ";

    if (isPast) {
      className += "text-gray-300 cursor-not-allowed";
    } else if (isBooked) {
      className += "bg-red-100 text-red-800 cursor-not-allowed";
    } else if (isSelected) {
      className += "bg-forest-700 text-white font-bold cursor-pointer";
    } else {
      className += "bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer";
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={t({ en: 'Previous month', fr: 'Mois précédent' })}
        >
          <svg className="w-6 h-6 text-forest-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-forest-900 capitalize">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={t({ en: 'Next month', fr: 'Mois suivant' })}
        >
          <svg className="w-6 h-6 text-forest-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      {/* Légende */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
          <span className="text-gray-700">{t({ en: 'Available', fr: 'Disponible' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded" />
          <span className="text-gray-700">{t({ en: 'Booked', fr: 'Réservé' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded" />
          <span className="text-gray-700">{t({ en: 'Past', fr: 'Passé' })}</span>
        </div>
      </div>
    </div>
  );
}
