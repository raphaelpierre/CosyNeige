'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { calculateNights, calculatePrice, formatEuro, getSeason } from '@/lib/utils';
import BookingCalendar from '@/components/ui/BookingCalendar';

interface BookingStep {
  id: number;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  completed: boolean;
}

export default function NewBookingPage() {
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
      description: { en: 'Pick your arrival and departure', fr: 'Choisissez votre arrivée et départ' },
      completed: checkIn !== '' && checkOut !== '' && isValidStay,
    },
    {
      id: 2,
      title: { en: 'Your Details', fr: 'Vos Informations' },
      description: { en: 'Tell us about yourself', fr: 'Parlez-nous de vous' },
      completed: formData.firstName !== '' && formData.lastName !== '' && formData.email !== '' && formData.phone !== '',
    },
    {
      id: 3,
      title: { en: 'Confirm', fr: 'Confirmer' },
      description: { en: 'Review and submit', fr: 'Vérifier et envoyer' },
      completed: false,
    },
  ];

  // Navigation automatique entre les étapes
  useEffect(() => {
    if (currentStep === 1 && steps[0].completed) {
      // Auto-avancer à l'étape 2 quand les dates sont validées
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn,
          checkOut,
          guests,
          totalPrice: priceCalculation?.total || 0,
        }),
      });

      if (response.ok) {
        const params = new URLSearchParams({
          checkIn,
          checkOut,
          guests: guests.toString(),
          total: priceCalculation?.total.toString() || '0',
          email: formData.email,
        });
        router.push(`/booking/confirmation?${params.toString()}`);
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
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
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Titre principal compact */}
            <div className="text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                🏔️ {t({ en: 'Alpine Booking', fr: 'Réservation Alpine' })}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t({ en: '3 easy steps', fr: '3 étapes simples' })} • 
                <span className="font-medium text-forest-700 ml-1">
                  {t(steps[currentStep - 1]?.title)}
                </span>
              </p>
            </div>

            {/* Indicateur de progression horizontal compact */}
            <div className="flex items-center justify-center lg:justify-end gap-2 sm:gap-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                      currentStep === step.id 
                        ? 'bg-forest-600 text-white border-forest-600 scale-110 shadow-lg' 
                        : step.completed
                          ? 'bg-gray-600 text-white border-gray-600'
                          : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {step.completed ? '✓' : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-6 h-0.5 mx-1 sm:mx-2 transition-colors ${
                      step.completed ? 'bg-gray-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Colonne principale - Contenu de l'étape */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              
              {/* ÉTAPE 1: Sélection des dates */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* En-tête compact */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-4xl">📅</span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {t({ en: 'Choose Your Dates', fr: 'Choisissez Vos Dates' })}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {t({ 
                        en: 'Select dates and guests for your alpine escape', 
                        fr: 'Sélectionnez dates et nombre de personnes' 
                      })}
                    </p>
                  </div>

                  {/* Layout en 2 colonnes : sélecteur personnes + calendrier */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Sélecteur de personnes compact */}
                    <div className="lg:col-span-2">
                      <div className="bg-gradient-to-br from-forest-50 to-blue-50 rounded-xl p-4 border border-forest-200 h-fit">
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-xl">👥</span>
                            <label className="text-base font-bold text-gray-800">
                              {t({ en: 'Guests', fr: 'Personnes' })}
                            </label>
                          </div>
                        </div>
                        
                        {/* Sélecteur compact */}
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md border border-gray-200 hover:border-forest-400 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-forest-600 transition-all duration-200 active:scale-95"
                          >
                            −
                          </button>
                          
                          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-forest-300 min-w-[80px]">
                            <div className="text-center">
                              <div className="text-xl font-bold text-forest-700">{guests}</div>
                              <div className="text-xs text-gray-600">
                                {t({ en: guests === 1 ? 'guest' : 'guests', fr: guests === 1 ? 'pers.' : 'pers.' })}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md border border-gray-200 hover:border-forest-400 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-forest-600 transition-all duration-200 active:scale-95"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Indication capacité */}
                        <div className="mt-3 text-center">
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



                  {/* Messages de feedback compacts */}
                  {checkIn && checkOut && nights > 0 && (
                    <div>
                      {!isValidStay ? (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-red-500 text-2xl">⚠️</span>
                            <h4 className="text-red-800 font-bold">
                              {t({ en: 'Minimum stay required', fr: 'Séjour minimum requis' })}
                            </h4>
                          </div>
                          <p className="text-red-700 text-sm mb-2">
                            {season === 'high' 
                              ? t({ en: `Need 7+ nights (selected: ${nights})`, fr: `Minimum 7 nuits (sélectionné : ${nights})` })
                              : t({ en: `Need 3+ nights (selected: ${nights})`, fr: `Minimum 3 nuits (sélectionné : ${nights})` })
                            }
                          </p>
                          <div className="text-xs text-red-600 bg-red-100 rounded-full px-3 py-1 inline-flex items-center gap-1">
                            <span>💡</span>
                            <span>{t({ en: 'Please extend dates', fr: 'Prolongez les dates' })}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-green-600 text-2xl">✅</span>
                            <h4 className="text-green-800 font-bold">
                              {t({ en: 'Perfect selection!', fr: 'Parfait !' })}
                            </h4>
                          </div>
                          <p className="text-green-700 text-sm mb-2">
                            {t({ en: `${nights} nights • ${guests} guests`, fr: `${nights} nuits • ${guests} personnes` })}
                          </p>
                          <div className="text-xs text-green-700 bg-green-100 rounded-full px-3 py-1 inline-flex items-center gap-1">
                            <span>🚀</span>
                            <span>{t({ en: 'Next step...', fr: 'Étape suivante...' })}</span>
                          </div>
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
                    <div className="text-6xl mb-4">👤</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t({ en: 'Tell us about yourself', fr: 'Parlez-nous de vous' })}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t({ en: 'We need these details to process your reservation', fr: 'Nous avons besoin de ces informations pour traiter votre réservation' })}
                    </p>
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
                          placeholder={t({ en: 'Your first name', fr: 'Votre prénom' })}
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
                          placeholder={t({ en: 'Your last name', fr: 'Votre nom' })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Email Address', fr: 'Adresse Email' })} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                        placeholder={t({ en: 'your.email@example.com', fr: 'votre.email@exemple.com' })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Phone Number', fr: 'Numéro de Téléphone' })} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                        placeholder={t({ en: '+33 6 12 34 56 78', fr: '+33 6 12 34 56 78' })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t({ en: 'Special Requests (Optional)', fr: 'Demandes Spéciales (Optionnel)' })}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent text-base"
                        placeholder={t({ en: 'Any special requests or questions?', fr: 'Des demandes spéciales ou questions ?' })}
                      />
                    </div>
                  </div>

                  {/* Suggestion de création de compte */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 text-2xl flex-shrink-0">💡</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {t({ 
                            en: 'Want to save time for future bookings?', 
                            fr: 'Envie de gagner du temps pour vos prochaines réservations ?' 
                          })}
                        </h4>
                        <p className="text-blue-800 text-sm mb-3">
                          {t({ 
                            en: 'Create an account to manage your reservations, access exclusive offers, and enjoy a personalized experience!', 
                            fr: 'Créez un compte pour gérer vos réservations, accéder aux offres exclusives et profiter d\'une expérience personnalisée !' 
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
                        <div className="mt-2">
                          <p className="text-xs text-blue-600">
                            {t({ 
                              en: '✨ Benefits: Booking history, faster checkout, exclusive discounts', 
                              fr: '✨ Avantages : Historique réservations, checkout rapide, réductions exclusives' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Back to Dates', fr: 'Retour aux Dates' })}
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!steps[1].completed}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                        steps[1].completed
                          ? 'bg-forest-600 hover:bg-forest-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {t({ en: 'Review Booking', fr: 'Vérifier la Réservation' })} →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t({ en: 'Ready to submit your booking?', fr: 'Prêt à envoyer votre réservation ?' })}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t({ en: 'Please review your details before submitting', fr: 'Veuillez vérifier vos informations avant envoi' })}
                    </p>
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
                        <div className="font-semibold">
                          {new Date(checkIn).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">{t({ en: 'Check-out:', fr: 'Départ :' })}</span>
                        <div className="font-semibold">
                          {new Date(checkOut).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
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

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      ← {t({ en: 'Edit Details', fr: 'Modifier les Infos' })}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          {t({ en: 'Submitting...', fr: 'Envoi...' })}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>🚀</span>
                          {t({ en: 'Submit Booking Request', fr: 'Envoyer la Demande' })}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar prix compacte */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-20">
              {/* En-tête compact */}
              <div className="bg-gradient-to-r from-forest-50 to-blue-50 rounded-t-xl p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
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
                <div className="space-y-6">
                  {/* Dates sélectionnées avec design premium */}
                  <div className="bg-gradient-to-br from-forest-50 via-blue-50 to-forest-50 rounded-2xl p-5 border-2 border-forest-200 relative overflow-hidden">
                    {/* Élément décoratif */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-forest-200 rounded-full opacity-20 -translate-y-10 translate-x-10"></div>
                    
                    <div className="text-center relative z-10">
                      <div className="flex items-center justify-center gap-2 text-forest-600 mb-3">
                        <span className="text-lg">📅</span>
                        <span className="text-sm font-semibold uppercase tracking-wide">
                          {t({ en: 'Your Stay', fr: 'Votre Séjour' })}
                        </span>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-forest-100 mb-3">
                        <div className="text-lg font-bold text-gray-800 mb-1">
                          {new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} 
                          <span className="mx-2 text-forest-600">→</span>
                          {new Date(checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-2xl font-black text-forest-700 mb-1">
                          {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <span className="text-sm">👥</span>
                          <span className="text-sm font-semibold">
                            {guests} {t({ en: guests === 1 ? 'guest' : 'guests', fr: guests === 1 ? 'personne' : 'personnes' })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Badge saison */}
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        season === 'high' 
                          ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {season && t({
                          en: season === 'high' ? '🔥 High Season' : '🍃 Low Season',
                          fr: season === 'high' ? '🔥 Haute Saison' : '🍃 Basse Saison'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Calcul détaillé avec design amélioré */}
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🧮</span>
                      <h4 className="font-bold text-gray-800">
                        {t({ en: 'Price Breakdown', fr: 'Détail du Prix' })}
                      </h4>
                    </div>
                    
                    {/* Ligne de prix principal avec animation */}
                    <div className="bg-white rounded-xl p-4 border-2 border-forest-100 hover:border-forest-300 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {nights} × {formatEuro(priceCalculation.basePrice / nights)}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{season === 'high' ? '🔥' : '🍃'}</span>
                            {season && t({
                              en: season === 'high' ? 'High Season Rate' : 'Low Season Rate',
                              fr: season === 'high' ? 'Tarif Haute Saison' : 'Tarif Basse Saison'
                            })}
                          </div>
                        </div>
                        <span className="font-bold text-lg text-gray-800">{formatEuro(priceCalculation.basePrice)}</span>
                      </div>
                    </div>
                    
                    {/* Frais de ménage */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🧹</span>
                          <span className="text-gray-700 font-medium">{t({ en: 'Cleaning fee', fr: 'Frais de ménage' })}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{formatEuro(priceCalculation.cleaningFee)}</span>
                      </div>
                    </div>
                    
                    {/* Total avec gradient */}
                    <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-5 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <div>
                          <span className="text-forest-100 text-sm font-medium">{t({ en: 'Total Amount', fr: 'Montant Total' })}</span>
                          <div className="font-bold text-2xl">{t({ en: 'Total', fr: 'Total' })}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-3xl">{formatEuro(priceCalculation.total)}</div>
                          <div className="text-forest-200 text-xs">
                            {t({ en: 'All inclusive', fr: 'Tout inclus' })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Informations additionnelles avec icônes */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600">ℹ️</span>
                        <span className="font-semibold text-blue-800 text-sm">{t({ en: 'Additional Info', fr: 'Infos Supplémentaires' })}</span>
                      </div>
                      <div className="space-y-2 text-xs text-blue-700">
                        <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                          <span className="flex items-center gap-2">
                            <span>🛡️</span>
                            {t({ en: 'Security deposit', fr: 'Caution' })}
                          </span>
                          <span className="font-semibold">{formatEuro(priceCalculation.depositAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                          <span className="flex items-center gap-2">
                            <span>🏛️</span>
                            {t({ en: 'Tourist tax', fr: 'Taxe de séjour' })}
                          </span>
                          <span className="font-semibold">{formatEuro(guests * nights * 2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarification saisonnière modernisée */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💡</span>
                      <h4 className="font-bold text-amber-800">{t({ en: 'Pricing Guide', fr: 'Guide Tarification' })}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-200">
                        <div className="text-orange-600 text-lg mb-1">🔥</div>
                        <div className="font-bold text-orange-800">{t({ en: 'High Season', fr: 'Haute Saison' })}</div>
                        <div className="text-orange-700 font-semibold">410€/nuit</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-200">
                        <div className="text-green-600 text-lg mb-1">🍃</div>
                        <div className="font-bold text-green-800">{t({ en: 'Low Season', fr: 'Basse Saison' })}</div>
                        <div className="text-green-700 font-semibold">310€/nuit</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  {/* État vide animé */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl opacity-30 animate-pulse"></div>
                    <div className="relative py-8 px-4">
                      <div className="text-6xl mb-4 animate-bounce">📅</div>
                      <h4 className="text-xl font-bold text-gray-700 mb-3">
                        {t({ 
                          en: 'Ready to see your price?', 
                          fr: 'Prêt à voir votre prix ?' 
                        })}
                      </h4>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        {t({ 
                          en: 'Select your dates above and watch the magic happen! Our pricing updates instantly.', 
                          fr: 'Sélectionnez vos dates ci-dessus et regardez la magie opérer ! Nos prix se mettent à jour instantanément.' 
                        })}
                      </p>
                      
                      {/* Indicateur visuel */}
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      
                      {/* Preview des prix */}
                      <div className="mt-4 space-y-2">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3 text-xs text-gray-600">
                          <div className="flex justify-between mb-1">
                            <span>🔥 Haute Saison</span>
                            <span className="font-semibold">410€/nuit</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🍃 Basse Saison</span>
                            <span className="font-semibold">310€/nuit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 px-4">
                    <div className="text-4xl mb-2 animate-bounce">📅</div>
                    <h4 className="text-lg font-bold text-gray-700 mb-2">
                      {t({ 
                        en: 'Select dates', 
                        fr: 'Sélectionnez les dates' 
                      })}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t({ 
                        en: 'Price will appear here', 
                        fr: 'Le prix apparaîtra ici' 
                      })}
                    </p>
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