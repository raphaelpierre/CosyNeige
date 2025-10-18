'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';
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
  const { user, isAuthenticated } = useAuth();

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
  const [validationError, setValidationError] = useState<{ error: string; errorFr: string } | null>(null);

  // Calculs automatiques
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const priceCalculation = checkIn && checkOut && seasons.length > 0 && pricingSettings
    ? calculatePriceWithSeasons(checkIn, checkOut, seasons, pricingSettings, guests)
    : null;

  // Calculer les jours avant l'arrivée
  const daysUntilCheckIn = checkIn
    ? Math.ceil((new Date(checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Déterminer le montant à payer maintenant
  const requiresFullPayment = daysUntilCheckIn < 30;
  const depositAmount = priceCalculation
    ? (requiresFullPayment ? priceCalculation.total : Math.round(priceCalculation.total * 0.3))
    : 0;

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

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Pre-fill form data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && currentStep === 2) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user, currentStep]);

  // Pas de navigation automatique - l'utilisateur contrôle le workflow

  const handleDateSelect = (checkInDate: Date | null, checkOutDate: Date | null) => {
    // Formater ou réinitialiser les dates
    const formattedCheckIn = checkInDate
      ? `${checkInDate.getFullYear()}-${String(checkInDate.getMonth() + 1).padStart(2, '0')}-${String(checkInDate.getDate()).padStart(2, '0')}`
      : '';

    const formattedCheckOut = checkOutDate
      ? `${checkOutDate.getFullYear()}-${String(checkOutDate.getMonth() + 1).padStart(2, '0')}-${String(checkOutDate.getDate()).padStart(2, '0')}`
      : '';

    // Mettre à jour les deux dates ensemble
    setCheckIn(formattedCheckIn);
    setCheckOut(formattedCheckOut);

    // Valider les dates et stocker l'erreur si invalide
    if (formattedCheckIn && formattedCheckOut && seasons.length > 0 && pricingSettings) {
      const validation = validateBookingDatesWithSeasons(formattedCheckIn, formattedCheckOut, seasons, pricingSettings);
      if (!validation.isValid) {
        setValidationError({ error: validation.error || '', errorFr: validation.errorFr || '' });
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
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
          depositAmount: depositAmount,
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
            amount: depositAmount * 100,
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
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">🗓️</span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {t({ en: 'Choose Your Dates', fr: 'Choisissez Vos Dates' })}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {t({
                        en: 'Select your arrival and departure dates to check availability',
                        fr: 'Sélectionnez vos dates d\'arrivée et de départ pour voir les disponibilités'
                      })}
                    </p>
                  </div>

                  {/* Zone centrale des messages de statut - Visible pour tous */}
                  {validationError && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-red-500 text-4xl sm:text-5xl">⚠️</span>
                        <div className="flex-1">
                          <h4 className="text-red-800 font-bold text-lg sm:text-xl">
                            {t({ en: 'Invalid Booking Period', fr: 'Période de Réservation Invalide' })}
                          </h4>
                        </div>
                      </div>
                      <p className="text-red-700 text-sm sm:text-base font-medium">
                        {t({
                          en: validationError.error,
                          fr: validationError.errorFr
                        })}
                      </p>
                    </div>
                  )}

                  {checkIn && checkOut && nights > 0 && !validationError && isValidStay && priceCalculation && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 sm:p-6 shadow-lg animate-in fade-in zoom-in-95 duration-300">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                          <span className="text-green-600 text-4xl sm:text-5xl animate-bounce">✅</span>
                          <div>
                            <h4 className="text-green-900 font-bold text-lg sm:text-xl mb-1">
                              {t({ en: 'Dates Available!', fr: 'Dates Disponibles !' })}
                            </h4>
                            <p className="text-green-800 text-sm sm:text-base font-semibold">
                              {t({ en: `${nights} nights • ${guests} guests`, fr: `${nights} nuits • ${guests} pers.` })}
                            </p>
                            <div className="mt-2">
                              <span className="text-2xl sm:text-3xl font-black text-green-900">{formatEuro(priceCalculation.total)}</span>
                              <span className="text-sm sm:text-base text-green-700 ml-2">{t({ en: 'total', fr: 'au total' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bouton Continuer - Desktop uniquement, mobile utilise bottom sheet */}
                        <div className="hidden sm:flex flex-shrink-0">
                          <button
                            onClick={() => setCurrentStep(2)}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 active:scale-98 border-2 border-green-700"
                          >
                            <span>{t({ en: 'Continue', fr: 'Continuer' })}</span>
                            <span className="text-xl">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grille calendrier + widgets - Côte à côte sur desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Calendrier - 2 colonnes sur desktop */}
                    <div className="lg:col-span-2">
                      <BookingCalendar onDateSelect={handleDateSelect} />
                    </div>

                    {/* Colonne de droite - Widget tarifs uniquement */}
                    <div className="lg:col-span-1 space-y-4">

                      {/* Widget Tarifs et Conditions - Toujours visible */}
                      {pricingSettings && !isLoadingSeasons && (
                        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">💵</span>
                            <h4 className="text-sm font-bold text-gray-900">
                              {t({ en: 'Rates & Conditions', fr: 'Tarifs & Conditions' })}
                            </h4>
                          </div>

                          {/* Tarifs compacts */}
                          <div className="space-y-2 mb-3">
                            <div className="bg-white rounded-lg p-2 border-l-4 border-blue-600 shadow-sm">
                              <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-lg font-black text-blue-900">
                                  {formatEuro(pricingSettings.defaultHighSeasonPrice)}
                                </span>
                                <span className="text-xs text-gray-600">/ {t({ en: 'night', fr: 'nuit' })}</span>
                              </div>
                              <div className="text-xs font-semibold text-blue-800 mb-1">
                                {t({ en: 'Holiday Periods', fr: 'Périodes de Vacances' })}
                              </div>
                              <div className="text-[10px] text-gray-600">
                                {seasons
                                  .filter(s => s.seasonType === 'high' && s.isActive)
                                  .slice(0, 2)
                                  .map((season, index) => (
                                    <div key={index}>• {season.name}</div>
                                  ))}
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-2 border-l-4 border-green-600 shadow-sm">
                              <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-lg font-black text-green-900">
                                  {formatEuro(pricingSettings.defaultLowSeasonPrice)}
                                </span>
                                <span className="text-xs text-gray-600">/ {t({ en: 'night', fr: 'nuit' })}</span>
                              </div>
                              <div className="text-xs font-semibold text-green-800 mb-1">
                                {t({ en: 'Other Periods', fr: 'Autres Périodes' })}
                              </div>
                              <div className="text-[10px] text-gray-600">
                                {t({ en: 'All other dates', fr: 'Toutes autres dates' })}
                              </div>
                            </div>
                          </div>

                          {/* Conditions importantes - compact */}
                          <div className="bg-white rounded-lg p-2 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm">📋</span>
                              <div className="text-xs font-bold text-gray-900">
                                {t({ en: 'Important Info', fr: 'Infos Importantes' })}
                              </div>
                            </div>
                            <div className="space-y-1 text-[10px] text-gray-700">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 flex-shrink-0">✓</span>
                                <span>
                                  {t({
                                    en: `Min. ${pricingSettings.defaultMinimumStay} nights`,
                                    fr: `Min. ${pricingSettings.defaultMinimumStay} nuits`
                                  })}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 flex-shrink-0">✓</span>
                                <span>
                                  {t({
                                    en: `Cleaning: ${formatEuro(pricingSettings.cleaningFee)}`,
                                    fr: `Ménage: ${formatEuro(pricingSettings.cleaningFee)}`
                                  })}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 flex-shrink-0">✓</span>
                                <span>
                                  {t({
                                    en: `Tourist tax: ${formatEuro(pricingSettings.touristTaxPerPersonPerNight)}/pers./night`,
                                    fr: `Taxe de séjour: ${formatEuro(pricingSettings.touristTaxPerPersonPerNight)}/pers./nuit`
                                  })}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 flex-shrink-0">✓</span>
                                <span>
                                  {t({
                                    en: `Deposit: ${formatEuro(pricingSettings.depositAmount)}`,
                                    fr: `Caution: ${formatEuro(pricingSettings.depositAmount)}`
                                  })}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 flex-shrink-0">✓</span>
                                <span>
                                  {t({
                                    en: '30% deposit required',
                                    fr: 'Acompte 30% requis'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sélecteur personnes - COMPACT et sous le calendrier */}
                  <div className="bg-forest-50 rounded-lg p-2 sm:p-3 border border-forest-200">
                    <div className="flex flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">👥</span>
                        <label className="font-bold text-gray-800 text-xs sm:text-sm">
                          {t({ en: 'Guests', fr: 'Personnes' })}
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 hover:border-forest-400 flex items-center justify-center font-bold text-base text-gray-600 hover:text-forest-600 transition-all active:scale-95 touch-manipulation"
                          aria-label="Decrease guests"
                        >
                          −
                        </button>

                        <div className="bg-white rounded-lg px-2 py-1 shadow-sm border border-forest-300 min-w-[50px]">
                          <div className="text-center">
                            <div className="font-bold text-sm text-forest-700">{guests}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => setGuests(Math.min(10, guests + 1))}
                          className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 hover:border-forest-400 flex items-center justify-center font-bold text-base text-gray-600 hover:text-forest-600 transition-all active:scale-95 touch-manipulation"
                          aria-label="Increase guests"
                        >
                          +
                        </button>

                        <span className="text-[10px] text-gray-500 ml-1">
                          {t({ en: '(max 10)', fr: '(max 10)' })}
                        </span>
                      </div>
                    </div>
                  </div>

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

                  {/* Invitation à se connecter - Seulement si NON connecté */}
                  {!isAuthenticated && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-4 sm:p-6 shadow-md">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl">
                            🔐
                          </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">
                            {t({
                              en: 'Already have an account?',
                              fr: 'Vous avez déjà un compte ?'
                            })}
                          </h4>
                          <p className="text-slate-700 text-sm mb-3">
                            {t({
                              en: 'Sign in to automatically fill your information and track your booking!',
                              fr: 'Connectez-vous pour remplir automatiquement vos informations et suivre votre réservation !'
                            })}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => {
                                // Sauvegarder les données actuelles dans localStorage pour les restaurer après connexion
                                localStorage.setItem('booking-temp', JSON.stringify({
                                  checkIn,
                                  checkOut,
                                  guests,
                                  returnTo: '/booking'
                                }));
                                router.push('/client/login?returnTo=/booking');
                              }}
                              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                              {t({ en: '🔑 Sign In', fr: '🔑 Se Connecter' })}
                            </button>
                            <button
                              onClick={() => {
                                // Sauvegarder les données actuelles dans localStorage
                                localStorage.setItem('booking-temp', JSON.stringify({
                                  checkIn,
                                  checkOut,
                                  guests,
                                  returnTo: '/booking'
                                }));
                                router.push('/client/login?action=register&returnTo=/booking');
                              }}
                              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 rounded-lg font-semibold text-sm transition-colors"
                            >
                              {t({ en: '✨ Create Account', fr: '✨ Créer un Compte' })}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message de bienvenue si connecté */}
                  {isAuthenticated && user && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-md">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👋</span>
                        <div>
                          <p className="font-bold text-green-900">
                            {t({ en: `Welcome back, ${user.firstName}!`, fr: `Bon retour, ${user.firstName} !` })}
                          </p>
                          <p className="text-sm text-green-700">
                            {t({
                              en: 'Your information has been pre-filled.',
                              fr: 'Vos informations ont été pré-remplies.'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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
                          <div className="flex justify-between">
                            <span>{t({ en: 'Tourist tax', fr: 'Taxe de séjour' })}</span>
                            <span className="font-semibold">{formatEuro(priceCalculation.touristTax)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-lg font-bold text-forest-900">
                            <span>{t({ en: 'Total', fr: 'Total' })}</span>
                            <span>{formatEuro(priceCalculation.total)}</span>
                          </div>
                          <div className="bg-yellow-50 rounded p-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-yellow-800">{t({
                                en: requiresFullPayment ? 'Full payment' : 'Deposit (30%)',
                                fr: requiresFullPayment ? 'Paiement complet' : 'Acompte (30%)'
                              })}</span>
                              <span className="font-bold text-yellow-900">{formatEuro(depositAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-base"
                    >
                      ← {t({ en: 'Back', fr: 'Retour' })}
                    </button>
                    <button
                      onClick={handleCreateReservationAndPayment}
                      disabled={!steps[1].completed || isSubmitting}
                      className={`w-full sm:flex-1 px-6 py-4 rounded-lg font-bold text-base sm:text-lg transition-all ${
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
                          <span className="hidden sm:inline">{t({ en: 'Continue to Payment', fr: 'Continuer vers le Paiement' })}</span>
                          <span className="sm:hidden">{t({ en: 'Payment', fr: 'Paiement' })}</span>
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
                        en: requiresFullPayment ? 'Pay the full amount securely' : 'Pay your 30% deposit securely',
                        fr: requiresFullPayment ? 'Payez le montant complet en toute sécurité' : 'Payez votre acompte de 30% en toute sécurité'
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
                        <strong>{t({
                          en: requiresFullPayment ? 'Full payment now:' : 'Deposit now:',
                          fr: requiresFullPayment ? 'Paiement complet maintenant :' : 'Acompte maintenant :'
                        })}</strong> {formatEuro(depositAmount)}
                      </div>
                    </div>

                    <div className="p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
                      ℹ️ {requiresFullPayment
                        ? t({
                            en: `Arrival in ${daysUntilCheckIn} days: full payment required now.`,
                            fr: `Arrivée dans ${daysUntilCheckIn} jours : paiement complet requis maintenant.`
                          })
                        : t({
                            en: 'Remaining balance due 30 days before arrival.',
                            fr: 'Solde restant dû 30 jours avant l\'arrivée.'
                          })
                      }
                    </div>
                  </div>

                  {/* Formulaire Stripe */}
                  <StripeProvider clientSecret={clientSecret}>
                    <PaymentForm
                      amount={depositAmount}
                      clientSecret={clientSecret}
                      billingDetails={{
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone,
                      }}
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
                      onClick={() => router.push(`/booking/payment/bank-transfer?bookingId=${bookingId}&deposit=${depositAmount}`)}
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
                      className="w-full sm:w-auto px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-base"
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

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t({ en: 'Tourist tax', fr: 'Taxe de séjour' })}</span>
                        <span className="font-semibold">{formatEuro(priceCalculation.touristTax)}</span>
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
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-forest-200 shadow-2xl z-30 p-4 pb-6 safe-area-bottom">
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
              <div className="text-xs text-gray-600">{t({
                en: requiresFullPayment ? 'Payment' : 'Deposit',
                fr: requiresFullPayment ? 'Paiement' : 'Acompte'
              })}</div>
              <div className="text-lg font-bold text-yellow-700">
                {formatEuro(depositAmount)}
              </div>
            </div>
          </div>
          {currentStep === 1 && steps[0].completed && (
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-4 rounded-lg font-bold transition-colors text-base active:scale-98 touch-manipulation"
            >
              {t({ en: 'Continue', fr: 'Continuer' })} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
