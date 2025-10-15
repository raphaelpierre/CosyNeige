'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { formatEuro } from '@/lib/utils';
import {
  fetchSeasons,
  calculatePriceWithSeasons,
  validateBookingDatesWithSeasons,
  calculateNights,
  type SeasonPeriod,
  type PricingSettings
} from '@/lib/utils/pricing';
import BookingCalendar from '@/components/ui/BookingCalendar';
import StripeProvider from '@/components/payment/StripeProvider';
import PaymentForm from '@/components/payment/PaymentForm';

interface BookingStep {
  id: number;
  title: { en: string; fr: string };
  completed: boolean;
}

export default function BookingPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // États principaux
  const [currentStep, setCurrentStep] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<SeasonPeriod[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true);

  // Calculs automatiques
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const priceCalculation = checkIn && checkOut && seasons.length > 0 && pricingSettings
    ? calculatePriceWithSeasons(checkIn, checkOut, seasons, pricingSettings)
    : null;

  // Validation: si les saisons ne sont pas encore chargées, on considère comme valide temporairement
  // pour ne pas bloquer l'utilisateur pendant le chargement
  const validation = checkIn && checkOut
    ? (seasons.length > 0 && pricingSettings
        ? validateBookingDatesWithSeasons(checkIn, checkOut, seasons, pricingSettings)
        : { isValid: true } // Temporairement valide pendant le chargement
      )
    : { isValid: false };
  const isValidStay = validation.isValid;

  // Définition des étapes (3 au lieu de 4)
  const steps: BookingStep[] = [
    {
      id: 1,
      title: { en: 'Dates & Guests', fr: 'Dates & Personnes' },
      completed: checkIn !== '' && checkOut !== '' && isValidStay,
    },
    {
      id: 2,
      title: { en: 'Your Details', fr: 'Vos Informations' },
      completed: formData.firstName !== '' && formData.lastName !== '' && formData.email !== '' && formData.phone !== '' && !formErrors.email && !formErrors.phone,
    },
    {
      id: 3,
      title: { en: 'Payment', fr: 'Paiement' },
      completed: false,
    },
  ];

  // Validation email temps réel
  const validateEmail = (email: string) => {
    if (!email) {
      setFormErrors(prev => ({ ...prev, email: '' }));
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setFormErrors(prev => ({
        ...prev,
        email: t({ en: 'Invalid email format', fr: 'Format email invalide' })
      }));
    } else {
      setFormErrors(prev => ({ ...prev, email: '' }));
    }
  };

  // Validation téléphone temps réel
  const validatePhone = (phone: string) => {
    if (!phone) {
      setFormErrors(prev => ({ ...prev, phone: '' }));
      return;
    }
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setFormErrors(prev => ({
        ...prev,
        phone: t({ en: 'Invalid phone format', fr: 'Format téléphone invalide' })
      }));
    } else {
      setFormErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Charger les saisons au montage du composant
  useEffect(() => {
    const loadSeasons = async () => {
      try {
        setIsLoadingSeasons(true);
        const { seasons: loadedSeasons, pricingSettings: loadedPricingSettings } = await fetchSeasons();
        setSeasons(loadedSeasons);
        setPricingSettings(loadedPricingSettings);
      } catch (error) {
        console.error('Error loading seasons:', error);
      } finally {
        setIsLoadingSeasons(false);
      }
    };

    loadSeasons();
  }, []);

  // Navigation automatique étape 1 → 2
  useEffect(() => {
    if (currentStep === 1 && steps[0].completed) {
      setTimeout(() => setCurrentStep(2), 300);
    }
  }, [steps[0].completed, currentStep]);

  const handleDateSelect = (checkInDate: Date | null, checkOutDate: Date | null) => {
    if (checkInDate) {
      // Format local date without timezone offset
      const year = checkInDate.getFullYear();
      const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkInDate.getDate()).padStart(2, '0');
      setCheckIn(`${year}-${month}-${day}`);
    }
    if (checkOutDate) {
      // Format local date without timezone offset
      const year = checkOutDate.getFullYear();
      const month = String(checkOutDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkOutDate.getDate()).padStart(2, '0');
      setCheckOut(`${year}-${month}-${day}`);
    }
  };

  const handleCreateReservationAndPayment = async () => {
    setIsSubmitting(true);

    try {
      // Créer d'abord la réservation
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn,
          checkOut,
          guests,
          totalPrice: priceCalculation?.total || 0,
          depositAmount: Math.round((priceCalculation?.total || 0) * 0.3),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newBookingId = result.id;
        setBookingId(newBookingId);

        // Créer le Payment Intent pour Stripe
        const paymentResponse = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: newBookingId,
            amount: Math.round((priceCalculation?.total || 0) * 0.3) * 100,
            currency: 'eur',
          }),
        });

        if (paymentResponse.ok) {
          const { clientSecret: newClientSecret } = await paymentResponse.json();
          setClientSecret(newClientSecret);
          setTimeout(() => setCurrentStep(3), 500);
        } else {
          throw new Error('Failed to create payment intent');
        }
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(t({
        en: 'An error occurred. Please try again.',
        fr: 'Une erreur s\'est produite. Veuillez réessayer.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-forest-50">
      {/* Header compact avec progression */}
      <section className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                🏔️ {t({ en: 'Book Your Stay', fr: 'Réservez Votre Séjour' })}
              </h1>
              <p className="text-gray-600 text-xs">
                {t({ en: '3 easy steps', fr: '3 étapes simples' })} •
                <span className="font-medium text-forest-700 ml-1">
                  {t(steps[currentStep - 1]?.title)}
                </span>
              </p>
            </div>

            {/* Stepper horizontal */}
            <div className="flex items-center justify-center lg:justify-end gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                      currentStep === step.id
                        ? 'bg-forest-600 text-white border-forest-600 scale-110'
                        : step.completed
                          ? 'bg-slate-600 text-white border-slate-600'
                          : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {step.completed ? '✓' : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 transition-colors ${
                      step.completed ? 'bg-slate-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Colonne principale */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">

              {/* ÉTAPE 1: Dates & Invités */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-3xl">🗓️</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t({ en: 'Choose Your Dates', fr: 'Choisissez Vos Dates' })}
                      </h3>
                    </div>
                  </div>

                  {/* Section Tarifs et Conditions */}
                  <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">💵</span>
                      <h4 className="text-lg font-bold text-gray-900">
                        {t({ en: 'Rates & Conditions', fr: 'Tarifs & Conditions' })}
                      </h4>
                    </div>

                    {pricingSettings && !isLoadingSeasons ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="text-sm text-gray-600 mb-1">
                              {t({ en: 'Holiday periods', fr: 'Périodes de vacances' })}
                            </div>
                            <div className="text-2xl font-bold text-blue-900 mb-2">
                              {formatEuro(pricingSettings.defaultHighSeasonPrice)} / {t({ en: 'night', fr: 'nuit' })}
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              {seasons
                                .filter(s => s.seasonType === 'high' && s.isActive)
                                .slice(0, 3)
                                .map((season, index) => {
                                  const start = new Date(season.startDate);
                                  const end = new Date(season.endDate);
                                  return (
                                    <div key={index}>
                                      • {season.name} ({start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })})
                                    </div>
                                  );
                                })}
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-green-100">
                            <div className="text-sm text-gray-600 mb-1">
                              {t({ en: 'Other periods', fr: 'Autres périodes' })}
                            </div>
                            <div className="text-2xl font-bold text-green-900 mb-2">
                              {formatEuro(pricingSettings.defaultLowSeasonPrice)} / {t({ en: 'night', fr: 'nuit' })}
                            </div>
                            <div className="text-xs text-gray-600">
                              {t({ en: 'All other dates throughout the year', fr: 'Toutes les autres dates de l\'année' })}
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="text-sm font-semibold text-yellow-900 mb-2">
                            📋 {t({ en: 'Booking Conditions', fr: 'Conditions de Réservation' })}
                          </div>
                          <div className="text-sm text-yellow-800 space-y-1">
                            <div>
                              ✓ {t({
                                en: 'Holiday periods: Sunday to Sunday booking may be required',
                                fr: 'Périodes vacances : Réservation dimanche au dimanche possible'
                              })}
                            </div>
                            <div>
                              ✓ {t({
                                en: `Minimum stay: ${pricingSettings.defaultMinimumStay} nights (varies by period)`,
                                fr: `Séjour minimum : ${pricingSettings.defaultMinimumStay} nuits (varie selon période)`
                              })}
                            </div>
                            <div>
                              ✓ {t({ en: `Cleaning fee: ${formatEuro(pricingSettings.cleaningFee)}`, fr: `Frais de ménage : ${formatEuro(pricingSettings.cleaningFee)}` })}
                            </div>
                            <div>
                              ✓ {t({ en: `Security deposit: ${formatEuro(pricingSettings.depositAmount)}`, fr: `Caution : ${formatEuro(pricingSettings.depositAmount)}` })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-spin text-3xl mb-2">⏳</div>
                        <p className="text-gray-600">{t({ en: 'Loading rates...', fr: 'Chargement des tarifs...' })}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Sélecteur personnes */}
                    <div className="lg:col-span-2">
                      <div className="bg-forest-50 rounded-xl p-4 border border-forest-200 h-fit">
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">👥</span>
                            <label className="font-bold text-gray-800">
                              {t({ en: 'Guests', fr: 'Personnes' })}
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 hover:border-forest-400 flex items-center justify-center font-bold text-gray-600 hover:text-forest-600 transition-all active:scale-95"
                            aria-label="Decrease guests"
                          >
                            −
                          </button>

                          <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-forest-300 min-w-[70px]">
                            <div className="text-center">
                              <div className="font-bold text-forest-700">{guests}</div>
                              <div className="text-xs text-gray-600">
                                {t({ en: guests === 1 ? 'guest' : 'guests', fr: guests === 1 ? 'pers.' : 'pers.' })}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 hover:border-forest-400 flex items-center justify-center font-bold text-gray-600 hover:text-forest-600 transition-all active:scale-95"
                            aria-label="Increase guests"
                          >
                            +
                          </button>
                        </div>

                        <div className="mt-2 text-center">
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {t({ en: 'Max 10', fr: 'Max 10' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Calendrier */}
                    <div className="lg:col-span-3">
                      <BookingCalendar onDateSelect={handleDateSelect} />
                    </div>
                  </div>

                  {/* Feedback messages */}
                  {checkIn && checkOut && nights > 0 && (
                    <div>
                      {!isValidStay ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-red-500 text-xl">⚠️</span>
                            <h4 className="text-red-800 font-bold">
                              {t({ en: 'Invalid booking period', fr: 'Période de réservation invalide' })}
                            </h4>
                          </div>
                          <p className="text-red-700 text-sm">
                            {t({
                              en: validation.error || 'Invalid dates',
                              fr: validation.errorFr || 'Dates invalides'
                            })}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-slate-600 text-xl">✅</span>
                            <h4 className="text-slate-800 font-bold">
                              {t({ en: 'Perfect selection!', fr: 'Parfait !' })}
                            </h4>
                          </div>
                          <p className="text-slate-700 text-sm">
                            {t({ en: `${nights} nights • ${guests} guests`, fr: `${nights} nuits • ${guests} personnes` })}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 2: Informations + Résumé (fusionné) */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-3xl">👤</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t({ en: 'Your Information', fr: 'Vos Informations' })}
                      </h3>
                    </div>
                  </div>

                  {/* Formulaire */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t({ en: 'First Name', fr: 'Prénom' })} *
                        </label>
                        <input
                          type="text"
                          required
                          name="given-name"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                          placeholder={t({ en: 'John', fr: 'Jean' })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t({ en: 'Last Name', fr: 'Nom' })} *
                        </label>
                        <input
                          type="text"
                          required
                          name="family-name"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                          placeholder={t({ en: 'Doe', fr: 'Dupont' })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Email', fr: 'Email' })} *
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          validateEmail(e.target.value);
                        }}
                        onBlur={(e) => validateEmail(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john.doe@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-600 text-sm mt-1">❌ {formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Phone', fr: 'Téléphone' })} *
                      </label>
                      <input
                        type="tel"
                        required
                        name="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          validatePhone(e.target.value);
                        }}
                        onBlur={(e) => validatePhone(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+33 6 12 34 56 78"
                      />
                      {formErrors.phone && (
                        <p className="text-red-600 text-sm mt-1">❌ {formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Special Requests', fr: 'Demandes Spéciales' })} ({t({ en: 'optional', fr: 'optionnel' })})
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                        placeholder={t({ en: 'Any special requests or requirements...', fr: 'Demandes spéciales ou besoins particuliers...' })}
                      />
                    </div>
                  </div>

                  {/* Résumé réservation intégré */}
                  <div className="bg-forest-50 rounded-xl p-6 border-2 border-forest-200">
                    <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      📋 {t({ en: 'Booking Summary', fr: 'Résumé de Réservation' })}
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-gray-600 text-xs block mb-1">{t({ en: 'Check-in', fr: 'Arrivée' })}</span>
                        <div className="font-bold text-forest-900">{checkIn}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-gray-600 text-xs block mb-1">{t({ en: 'Check-out', fr: 'Départ' })}</span>
                        <div className="font-bold text-forest-900">{checkOut}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-gray-600 text-xs block mb-1">{t({ en: 'Duration', fr: 'Durée' })}</span>
                        <div className="font-bold text-forest-900">
                          {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-gray-600 text-xs block mb-1">{t({ en: 'Guests', fr: 'Personnes' })}</span>
                        <div className="font-bold text-forest-900">{guests}</div>
                      </div>
                    </div>

                    {priceCalculation && (
                      <div className="mt-4 bg-white rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{nights} {t({ en: 'nights', fr: 'nuits' })}</span>
                            <span className="font-semibold">{formatEuro(priceCalculation.basePrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t({ en: 'Cleaning fee', fr: 'Frais de ménage' })}</span>
                            <span className="font-semibold">{formatEuro(priceCalculation.cleaningFee)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-lg font-bold text-forest-900">
                            <span>{t({ en: 'Total', fr: 'Total' })}</span>
                            <span>{formatEuro(priceCalculation.total)}</span>
                          </div>
                          <div className="bg-yellow-50 rounded p-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-yellow-800">{t({ en: 'Deposit (30%)', fr: 'Acompte (30%)' })}</span>
                              <span className="font-bold text-yellow-900">{formatEuro(priceCalculation.total * 0.3)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestion compte */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 text-xl flex-shrink-0">💡</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {t({
                            en: 'Want faster bookings next time?',
                            fr: 'Envie de réserver plus vite la prochaine fois ?'
                          })}
                        </h4>
                        <p className="text-blue-800 text-sm mb-3">
                          {t({
                            en: 'Create an account to save your info and track bookings!',
                            fr: 'Créez un compte pour sauvegarder vos infos et suivre vos réservations !'
                          })}
                        </p>
                        <button
                          onClick={() => router.push('/client/login?action=register')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                        >
                          {t({ en: 'Create Account', fr: 'Créer un Compte' })}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Back', fr: 'Retour' })}
                    </button>
                    <button
                      onClick={handleCreateReservationAndPayment}
                      disabled={!steps[1].completed || isSubmitting}
                      className={`flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                        steps[1].completed && !isSubmitting
                          ? 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          {t({ en: 'Processing...', fr: 'Traitement...' })}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>💳</span>
                          {t({ en: 'Continue to Payment', fr: 'Continuer vers le Paiement' })}
                          <span>→</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3: Paiement */}
              {currentStep === 3 && clientSecret && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-3xl">💳</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t({ en: 'Secure Payment', fr: 'Paiement Sécurisé' })}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {t({
                        en: 'Pay your 30% deposit securely',
                        fr: 'Payez votre acompte de 30% en toute sécurité'
                      })}
                    </p>
                  </div>

                  {/* Résumé paiement */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      💰 {t({ en: 'Payment Summary', fr: 'Résumé du Paiement' })}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <strong>{t({ en: 'Guest:', fr: 'Client :' })}</strong> {formData.firstName} {formData.lastName}
                      </div>
                      <div>
                        <strong>{t({ en: 'Dates:', fr: 'Dates :' })}</strong> {checkIn} → {checkOut}
                      </div>
                      <div>
                        <strong>{t({ en: 'Total stay:', fr: 'Total séjour :' })}</strong> {formatEuro(priceCalculation?.total || 0)}
                      </div>
                      <div className="text-lg font-bold text-blue-900">
                        <strong>{t({ en: 'Deposit now:', fr: 'Acompte maintenant :' })}</strong> {formatEuro(Math.round((priceCalculation?.total || 0) * 0.3))}
                      </div>
                    </div>

                    <div className="p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
                      ℹ️ {t({
                        en: 'Remaining balance due 30 days before arrival.',
                        fr: 'Solde restant dû 30 jours avant l\'arrivée.'
                      })}
                    </div>
                  </div>

                  {/* Formulaire Stripe */}
                  <StripeProvider clientSecret={clientSecret}>
                    <PaymentForm
                      amount={Math.round((priceCalculation?.total || 0) * 0.3)}
                      clientSecret={clientSecret}
                      onSuccess={() => {
                        router.push(`/booking/confirmation?bookingId=${bookingId}`);
                      }}
                      onError={(error) => {
                        console.error('Payment error:', error);
                        alert(t({
                          en: 'Payment failed. Please try again.',
                          fr: 'Échec du paiement. Veuillez réessayer.'
                        }));
                      }}
                    />
                  </StripeProvider>

                  {/* Option virement */}
                  <div className="pt-6 border-t text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      {t({
                        en: 'Or pay by bank transfer',
                        fr: 'Ou payez par virement bancaire'
                      })}
                    </p>
                    <button
                      onClick={() => router.push(`/booking/payment/bank-transfer?bookingId=${bookingId}&deposit=${Math.round((priceCalculation?.total || 0) * 0.3)}`)}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <span>🏦</span>
                      {t({ en: 'Pay by Bank Transfer', fr: 'Payer par Virement' })}
                    </button>
                  </div>

                  {/* Bouton retour */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Back', fr: 'Retour' })}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar prix (desktop) */}
          <div className="hidden xl:block xl:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-20">
              <div className="bg-forest-50 rounded-t-xl p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <h3 className="font-bold text-gray-900">
                      {t({ en: 'Price', fr: 'Prix' })}
                    </h3>
                  </div>
                  {checkIn && checkOut && isValidStay && priceCalculation && (
                    <div className="bg-slate-600 text-white rounded-full px-2 py-1 text-xs font-semibold">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                {checkIn && checkOut && isValidStay && priceCalculation ? (
                  <div className="space-y-4">
                    <div className="bg-forest-50 rounded-lg p-4 border border-forest-200">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                          {checkIn} → {checkOut}
                        </div>
                        <div className="text-lg font-bold text-forest-700">
                          {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {guests} {t({ en: guests === 1 ? 'guest' : 'guests', fr: guests === 1 ? 'personne' : 'personnes' })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {nights} × {formatEuro(priceCalculation.basePrice / nights)}
                        </span>
                        <span className="font-semibold">{formatEuro(priceCalculation.basePrice)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t({ en: 'Cleaning', fr: 'Ménage' })}</span>
                        <span className="font-semibold">{formatEuro(priceCalculation.cleaningFee)}</span>
                      </div>

                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold text-lg">{t({ en: 'Total', fr: 'Total' })}</span>
                        <span className="font-bold text-xl text-forest-700">{formatEuro(priceCalculation.total)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1 pt-3 border-t">
                      <div className="flex justify-between">
                        <span>{t({ en: 'Deposit', fr: 'Caution' })}</span>
                        <span>{formatEuro(priceCalculation.depositAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t({ en: 'Tourist tax', fr: 'Taxe séjour' })}</span>
                        <span>{formatEuro(guests * nights * 2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">📅</div>
                    <p className="text-sm text-gray-600">
                      {t({
                        en: 'Select dates to see price',
                        fr: 'Sélectionnez les dates'
                      })}
                    </p>
                  </div>
                )}

                {/* Info importante */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span>ℹ️</span>
                    <span>{t({ en: '30% deposit required', fr: 'Acompte 30% requis' })}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✅</span>
                    <span>{t({ en: 'Free cancellation 60d', fr: 'Annulation gratuite 60j' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Prix (Mobile) */}
      {checkIn && checkOut && isValidStay && priceCalculation && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-forest-200 shadow-2xl z-30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-600">
                {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })} • {guests} {t({ en: guests === 1 ? 'guest' : 'guests', fr: 'pers.' })}
              </div>
              <div className="text-2xl font-bold text-forest-700">
                {formatEuro(priceCalculation.total)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">{t({ en: 'Deposit', fr: 'Acompte' })}</div>
              <div className="text-lg font-bold text-yellow-700">
                {formatEuro(priceCalculation.total * 0.3)}
              </div>
            </div>
          </div>
          {currentStep === 1 && steps[0].completed && (
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg font-bold transition-colors"
            >
              {t({ en: 'Continue', fr: 'Continuer' })} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
