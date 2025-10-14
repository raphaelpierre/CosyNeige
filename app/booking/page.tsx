'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { calculateNights, calculatePrice, formatEuro, getSeason } from '@/lib/utils';
import BookingCalendar from '@/components/ui/BookingCalendar';
import StripeProvider from '@/components/payment/StripeProvider';
import PaymentForm from '@/components/payment/PaymentForm';

interface BookingStep {
  id: number;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Calculs automatiques
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const season = checkIn ? getSeason(new Date(checkIn)) : null;
  const priceCalculation = checkIn && checkOut ? calculatePrice(checkIn, checkOut) : null;
  const minimumNights = season === 'high' ? 7 : 3;
  const isValidStay = nights >= minimumNights;

  // Définition des étapes
  const steps: BookingStep[] = [
    {
      id: 1,
      title: { en: 'Select Dates', fr: 'Choisir les Dates' },
      description: { en: 'Pick your dates', fr: 'Choisissez vos dates' },
      completed: checkIn !== '' && checkOut !== '' && isValidStay,
    },
    {
      id: 2,
      title: { en: 'Your Details', fr: 'Vos Informations' },
      description: { en: 'Your information', fr: 'Vos informations' },
      completed: formData.firstName !== '' && formData.lastName !== '' && formData.email !== '' && formData.phone !== '',
    },
    {
      id: 3,
      title: { en: 'Confirm', fr: 'Confirmer' },
      description: { en: 'Review booking', fr: 'Vérifier réservation' },
      completed: bookingId !== null,
    },
    {
      id: 4,
      title: { en: 'Payment', fr: 'Paiement' },
      description: { en: 'Secure payment', fr: 'Paiement sécurisé' },
      completed: false,
    },
  ];

  // Navigation automatique entre les étapes
  useEffect(() => {
    if (currentStep === 1 && steps[0].completed) {
      setTimeout(() => setCurrentStep(2), 300);
    }
  }, [steps[0].completed, currentStep]);



  const handleDateSelect = (checkInDate: Date | null, checkOutDate: Date | null) => {
    if (checkInDate) {
      setCheckIn(checkInDate.toISOString().split('T')[0]);
    }
    if (checkOutDate) {
      setCheckOut(checkOutDate.toISOString().split('T')[0]);
    }
  };

  const handleCreateReservation = async () => {
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
            amount: Math.round((priceCalculation?.total || 0) * 0.3) * 100, // Stripe utilise les centimes
            currency: 'eur',
          }),
        });

        if (paymentResponse.ok) {
          const { clientSecret: newClientSecret } = await paymentResponse.json();
          setClientSecret(newClientSecret);
          // Petite pause pour que l'utilisateur voie la confirmation, puis passer au paiement
          setTimeout(() => setCurrentStep(4), 800);
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
      {/* En-tête compacté avec progression intégrée */}
      <section className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Titre principal compact */}
            <div className="text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                🏔️ {t({ en: 'Alpine Booking', fr: 'Réservation Alpine' })}
              </h1>
              <p className="text-gray-600 text-xs">
                {t({ en: '3 easy steps', fr: '3 étapes simples' })} • 
                <span className="font-medium text-forest-700 ml-1">
                  {t(steps[currentStep - 1]?.title)}
                </span>
              </p>
            </div>

            {/* Indicateur de progression horizontal */}
            <div className="flex items-center justify-center lg:justify-end gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                      currentStep === step.id 
                        ? 'bg-forest-600 text-white border-forest-600 scale-110' 
                        : step.completed
                          ? 'bg-gray-600 text-white border-gray-600'
                          : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {step.completed ? '✓' : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 transition-colors ${
                      step.completed ? 'bg-gray-600' : 'bg-gray-300'
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
              
              {/* ÉTAPE 1: Sélection des dates */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-3xl">📅</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t({ en: 'Choose Your Dates', fr: 'Choisissez Vos Dates' })}
                      </h3>
                    </div>
                  </div>

                  {/* Layout en 2 colonnes : sélecteur personnes + calendrier */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    
                    {/* Sélecteur de personnes compact */}
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
                        
                        {/* Sélecteur */}
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 hover:border-forest-400 flex items-center justify-center font-bold text-gray-600 hover:text-forest-600 transition-all active:scale-95"
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

                  {/* Messages de feedback */}
                  {checkIn && checkOut && nights > 0 && (
                    <div>
                      {!isValidStay ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-red-500 text-xl">⚠️</span>
                            <h4 className="text-red-800 font-bold">
                              {t({ en: 'Minimum stay required', fr: 'Séjour minimum requis' })}
                            </h4>
                          </div>
                          <p className="text-red-700 text-sm">
                            {season === 'high' 
                              ? t({ en: `Need 7+ nights (selected: ${nights})`, fr: `Minimum 7 nuits (sélectionné : ${nights})` })
                              : t({ en: `Need 3+ nights (selected: ${nights})`, fr: `Minimum 3 nuits (sélectionné : ${nights})` })
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-green-600 text-xl">✅</span>
                            <h4 className="text-green-800 font-bold">
                              {t({ en: 'Perfect selection!', fr: 'Parfait !' })}
                            </h4>
                          </div>
                          <p className="text-green-700 text-sm">
                            {t({ en: `${nights} nights • ${guests} guests`, fr: `${nights} nuits • ${guests} personnes` })}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 2: Informations personnelles */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-3xl">👤</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t({ en: 'Your Information', fr: 'Vos Informations' })}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t({ en: 'First Name', fr: 'Prénom' })} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t({ en: 'Last Name', fr: 'Nom' })} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Phone', fr: 'Téléphone' })} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Special Requests', fr: 'Demandes Spéciales' })} (optionnel)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                      />
                    </div>
                  </div>

                  {/* Suggestion de création de compte */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 text-xl flex-shrink-0">💡</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {t({ 
                            en: 'Want to save time for future bookings?', 
                            fr: 'Envie de gagner du temps pour vos prochaines réservations ?' 
                          })}
                        </h4>
                        <p className="text-blue-800 text-sm mb-3">
                          {t({ 
                            en: 'Create an account to manage your reservations and access exclusive offers!', 
                            fr: 'Créez un compte pour gérer vos réservations et accéder aux offres exclusives !' 
                          })}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => router.push('/client/login?action=register')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <span>🎯</span>
                            {t({ en: 'Create Account', fr: 'Créer un Compte' })}
                          </button>
                          <button
                            onClick={() => router.push('/client/login')}
                            className="px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <span>🔑</span>
                            {t({ en: 'Already have an account?', fr: 'Déjà un compte ?' })}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur de progression du formulaire */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {t({ en: 'Form Progress', fr: 'Progression du Formulaire' })}
                      </span>
                      <span className={`font-bold ${steps[1].completed ? 'text-green-600' : 'text-orange-600'}`}>
                        {steps[1].completed ? 
                          t({ en: 'Complete ✓', fr: 'Complet ✓' }) : 
                          t({ en: 'Incomplete', fr: 'Incomplet' })
                        }
                      </span>
                    </div>
                    {!steps[1].completed && (
                      <p className="text-xs text-gray-600 mt-1">
                        {t({ 
                          en: 'Please fill: First name, Last name, Email, and Phone', 
                          fr: 'Veuillez remplir : Prénom, Nom, E-mail et Téléphone' 
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Back', fr: 'Retour' })}
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!steps[1].completed}
                      className={`flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all transform ${
                        steps[1].completed
                          ? 'bg-gray-600 hover:bg-gray-700 text-white hover:scale-[1.02] shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      title={!steps[1].completed ? t({ en: 'Please fill all required fields', fr: 'Veuillez remplir tous les champs requis' }) : ''}
                    >
                      {steps[1].completed ? (
                        <span className="flex items-center justify-center gap-2">
                          <span>✨</span>
                          {t({ en: 'Review Booking', fr: 'Vérifier la Réservation' })}
                          <span>→</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>📝</span>
                          {t({ en: 'Complete Form', fr: 'Remplir le Formulaire' })}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-3xl">✅</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t({ en: 'Review & Submit', fr: 'Vérifier & Envoyer' })}
                      </h3>
                    </div>
                  </div>

                  {/* Résumé de la réservation */}
                  <div className="bg-forest-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {t({ en: 'Booking Summary', fr: 'Résumé de Réservation' })}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t({ en: 'Guest:', fr: 'Client :' })}</span>
                        <div className="font-semibold">{formData.firstName} {formData.lastName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t({ en: 'Email:', fr: 'Email :' })}</span>
                        <div className="font-semibold">{formData.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t({ en: 'Check-in:', fr: 'Arrivée :' })}</span>
                        <div className="font-semibold">{checkIn}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t({ en: 'Check-out:', fr: 'Départ :' })}</span>
                        <div className="font-semibold">{checkOut}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t({ en: 'Duration:', fr: 'Durée :' })}</span>
                        <div className="font-semibold">
                          {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t({ en: 'Guests:', fr: 'Personnes :' })}</span>
                        <div className="font-semibold">{guests}</div>
                      </div>
                    </div>
                    
                    {formData.message && (
                      <div>
                        <span className="text-gray-600">{t({ en: 'Special requests:', fr: 'Demandes spéciales :' })}</span>
                        <div className="font-semibold italic">&quot;{formData.message}&quot;</div>
                      </div>
                    )}
                  </div>

                  {/* Informations de paiement */}
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <h4 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
                      💳 {t({ en: 'Payment Information', fr: 'Informations de Paiement' })}
                    </h4>
                    
                    {priceCalculation && (
                      <div className="space-y-4">
                        {/* Prix détaillé */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            💰 {t({ en: 'Price Breakdown', fr: 'Détail des Prix' })}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>{nights} {t({ en: 'nights', fr: 'nuits' })} ({season && t({
                                en: season === 'high' ? 'High Season' : 'Low Season',
                                fr: season === 'high' ? 'Haute Saison' : 'Basse Saison'
                              })})</span>
                              <span className="font-semibold">{formatEuro(priceCalculation.basePrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t({ en: 'Cleaning fee', fr: 'Frais de ménage' })}</span>
                              <span className="font-semibold">{formatEuro(priceCalculation.cleaningFee)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between text-lg font-bold text-blue-900">
                              <span>{t({ en: 'Total Amount', fr: 'Montant Total' })}</span>
                              <span>{formatEuro(priceCalculation.total)}</span>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 mt-3 border border-yellow-200">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-yellow-800">{t({ en: 'Deposit (30%)', fr: 'Acompte (30%)' })}</span>
                                <span className="font-bold text-yellow-900">{formatEuro(priceCalculation.total * 0.3)}</span>
                              </div>
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-yellow-700">{t({ en: 'Remaining balance', fr: 'Solde restant' })}</span>
                                <span className="font-semibold text-yellow-800">{formatEuro(priceCalculation.total * 0.7)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Options de paiement */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Paiement Stripe */}
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">💳</span>
                              <h6 className="font-bold text-blue-800">Stripe Payment</h6>
                            </div>
                            <div className="space-y-2 text-sm text-blue-700">
                              <p className="font-medium">{t({ en: 'Secure online payment', fr: 'Paiement en ligne sécurisé' })}</p>
                              <ul className="space-y-1 text-xs">
                                <li>• {t({ en: 'Credit/Debit cards', fr: 'Cartes de crédit/débit' })}</li>
                                <li>• {t({ en: 'Instant confirmation', fr: 'Confirmation instantanée' })}</li>
                                <li>• {t({ en: 'SSL encrypted', fr: 'Chiffrement SSL' })}</li>
                              </ul>
                              <div className="bg-green-50 rounded p-2 mt-3 border border-green-200">
                                <p className="text-green-800 text-xs font-medium">
                                  ✅ {t({ en: 'Recommended for instant booking', fr: 'Recommandé pour réservation immédiate' })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Virement bancaire */}
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🏦</span>
                              <h6 className="font-bold text-blue-800">{t({ en: 'Bank Transfer', fr: 'Virement Bancaire' })}</h6>
                            </div>
                            <div className="space-y-2 text-sm text-blue-700">
                              <p className="font-medium">{t({ en: 'Traditional bank transfer', fr: 'Virement bancaire traditionnel' })}</p>
                              <div className="text-xs space-y-1">
                                <div><strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123</div>
                                <div><strong>BIC:</strong> AGRIFRPP</div>
                                <div><strong>{t({ en: 'Beneficiary', fr: 'Bénéficiaire' })}:</strong> Chalet Les Sires</div>
                                <div><strong>{t({ en: 'Reference', fr: 'Référence' })}:</strong> {formData.lastName}-{checkIn}</div>
                              </div>
                              <div className="bg-orange-50 rounded p-2 mt-3 border border-orange-200">
                                <p className="text-orange-800 text-xs">
                                  ⏱️ {t({ en: 'Booking confirmed upon receipt (2-3 days)', fr: 'Réservation confirmée à réception (2-3 jours)' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Conditions de paiement */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h6 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            📋 {t({ en: 'Payment Terms', fr: 'Conditions de Paiement' })}
                          </h6>
                          <ul className="text-xs text-gray-700 space-y-1">
                            <li>• {t({ en: '30% deposit required at booking', fr: '30% d\'acompte requis à la réservation' })}</li>
                            <li>• {t({ en: 'Balance due 30 days before arrival', fr: 'Solde dû 30 jours avant l\'arrivée' })}</li>
                            <li>• {t({ en: 'Security deposit: €1,500 (refundable)', fr: 'Caution : 1 500€ (remboursable)' })}</li>
                            <li>• {t({ en: 'Tourist tax: €2/person/night (paid on-site)', fr: 'Taxe de séjour : 2€/personne/nuit (payée sur place)' })}</li>
                            <li>• {t({ en: 'Free cancellation up to 60 days before', fr: 'Annulation gratuite jusqu\'à 60 jours avant' })}</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Edit', fr: 'Modifier' })}
                    </button>
                    <button
                      onClick={handleCreateReservation}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          {t({ en: 'Submitting...', fr: 'Envoi...' })}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>�</span>
                          {t({ en: 'Continue to Payment', fr: 'Continuer vers le Paiement' })}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4: Paiement */}
              {currentStep === 4 && clientSecret && (
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
                        en: 'Pay your deposit securely with Stripe', 
                        fr: 'Payez votre acompte en toute sécurité avec Stripe' 
                      })}
                    </p>
                  </div>

                  {/* Résumé de paiement */}
                  <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      💰 {t({ en: 'Payment Summary', fr: 'Résumé du Paiement' })}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>{t({ en: 'Guest:', fr: 'Client :' })}</strong> {formData.firstName} {formData.lastName}
                      </div>
                      <div>
                        <strong>{t({ en: 'Dates:', fr: 'Dates :' })}</strong> {checkIn} → {checkOut}
                      </div>
                      <div>
                        <strong>{t({ en: 'Total stay:', fr: 'Total séjour :' })}</strong> {formatEuro(priceCalculation?.total || 0)}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        <strong>{t({ en: 'Deposit (30%):', fr: 'Acompte (30%) :' })}</strong> {formatEuro(Math.round((priceCalculation?.total || 0) * 0.3))}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
                      ℹ️ {t({ 
                        en: 'The remaining balance will be due 30 days before your arrival.',
                        fr: 'Le solde restant sera dû 30 jours avant votre arrivée.'
                      })}
                    </div>
                  </div>

                  {/* Formulaire de paiement Stripe */}
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

                  {/* Option virement bancaire */}
                  <div className="mt-8 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        {t({ 
                          en: 'Or pay by bank transfer if you prefer',
                          fr: 'Ou payez par virement bancaire si vous préférez'
                        })}
                      </p>
                      <button
                        onClick={() => router.push(`/booking/payment/bank-transfer?bookingId=${bookingId}&deposit=${Math.round((priceCalculation?.total || 0) * 0.3)}`)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        <span>🏦</span>
                        {t({ en: 'Pay by Bank Transfer', fr: 'Payer par Virement' })}
                      </button>
                    </div>
                  </div>

                  {/* Bouton retour */}
                  <div className="flex justify-start pt-4">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Back to Review', fr: 'Retour à la Vérification' })}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar prix compacte */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-20">
              {/* En-tête */}
              <div className="bg-forest-50 rounded-t-xl p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <h3 className="font-bold text-gray-900">
                      {t({ en: 'Price', fr: 'Prix' })}
                    </h3>
                  </div>
                  {checkIn && checkOut && isValidStay && priceCalculation && (
                    <div className="bg-green-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                      ✓
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {checkIn && checkOut && isValidStay && priceCalculation ? (
                  <div className="space-y-4">
                    {/* Dates sélectionnées */}
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

                    {/* Calcul */}
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

                    {/* Infos */}
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

                {/* Méthodes de paiement */}
                {checkIn && checkOut && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      💳 {t({ en: 'Payment Methods', fr: 'Méthodes de Paiement' })}
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600">💳</span>
                          <span className="font-medium text-blue-900">Stripe</span>
                        </div>
                        <p className="text-blue-700 text-xs">
                          {t({ 
                            en: 'Secure online payment • Instant confirmation', 
                            fr: 'Paiement sécurisé • Confirmation instantanée' 
                          })}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600">🏦</span>
                          <span className="font-medium text-green-900">
                            {t({ en: 'Bank Transfer', fr: 'Virement Bancaire' })}
                          </span>
                        </div>
                        <div className="text-green-700 text-xs space-y-1">
                          <p className="font-mono text-xs">IBAN: FR76 1234 **** *890</p>
                          <p>{t({ en: 'Reference: CHALET-[ID]', fr: 'Référence: CHALET-[ID]' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informations importantes */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span>ℹ️</span>
                    <span>{t({ en: '30% deposit required', fr: 'Acompte 30% requis' })}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📞</span>
                    <span>{t({ en: 'Contact within 24h', fr: 'Contact sous 24h' })}</span>
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
    </div>
  );
}