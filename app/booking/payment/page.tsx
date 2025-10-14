'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

function PaymentPageContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'bank' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Récupération des paramètres
  const bookingId = searchParams.get('bookingId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const total = parseFloat(searchParams.get('total') || '0');
  const deposit = parseFloat(searchParams.get('deposit') || '0');
  const email = searchParams.get('email');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    try {
      // Ici vous intégrerez la logique Stripe
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount: deposit * 100, // Stripe utilise les centimes
          currency: 'eur',
        }),
      });

      const { clientSecret } = await response.json();
      
      // Redirection vers le formulaire Stripe
      router.push(`/booking/payment/stripe?clientSecret=${clientSecret}&bookingId=${bookingId}`);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      alert(t({
        en: 'Payment initialization failed. Please try again.',
        fr: 'Échec de l\'initialisation du paiement. Veuillez réessayer.'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransfer = () => {
    // Redirection vers les instructions de virement
    router.push(`/booking/payment/bank-transfer?bookingId=${bookingId}&deposit=${deposit}`);
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {t({ en: 'Invalid booking', fr: 'Réservation invalide' })}
          </h1>
          <button
            onClick={() => router.push('/booking')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold"
          >
            {t({ en: 'Back to booking', fr: 'Retour à la réservation' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header simplifié */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🏔️ {t({ en: 'Payment - Chalet Les Sires', fr: 'Paiement - Chalet Les Sires' })}
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← {t({ en: 'Back', fr: 'Retour' })}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Résumé de réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📋 {t({ en: 'Booking Summary', fr: 'Résumé de Réservation' })}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t({ en: 'Guest', fr: 'Client' })}</span>
                  <span className="font-medium">{firstName} {lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t({ en: 'Dates', fr: 'Dates' })}</span>
                  <span className="font-medium">{checkIn} → {checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t({ en: 'Guests', fr: 'Voyageurs' })}</span>
                  <span className="font-medium">{guests} {t({ en: 'person(s)', fr: 'personne(s)' })}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t({ en: 'Total stay', fr: 'Total séjour' })}</span>
                  <span className="font-medium">{formatEuro(total)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>{t({ en: 'Deposit (30%)', fr: 'Acompte (30%)' })}</span>
                  <span>{formatEuro(deposit)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t({ en: 'Remaining', fr: 'Restant' })}</span>
                  <span>{formatEuro(total - deposit)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  ℹ️ {t({ 
                    en: 'The remaining balance will be due 30 days before your arrival.',
                    fr: 'Le solde restant sera dû 30 jours avant votre arrivée.'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                💳 {t({ en: 'Choose Payment Method', fr: 'Choisissez Votre Méthode de Paiement' })}
              </h3>

              <div className="space-y-4">
                
                {/* Option Stripe */}
                <div 
                  onClick={() => setSelectedMethod('stripe')}
                  className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    selectedMethod === 'stripe' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        selectedMethod === 'stripe' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedMethod === 'stripe' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">💳</span>
                        <h4 className="text-lg font-semibold text-gray-900">Stripe</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          {t({ en: 'Recommended', fr: 'Recommandé' })}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {t({ 
                          en: 'Pay securely online with your credit card. Instant confirmation.',
                          fr: 'Payez en ligne de manière sécurisée avec votre carte de crédit. Confirmation instantanée.'
                        })}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          🔒 {t({ en: 'Secure SSL', fr: 'SSL Sécurisé' })}
                        </span>
                        <span className="flex items-center gap-1">
                          ⚡ {t({ en: 'Instant', fr: 'Instantané' })}
                        </span>
                        <span className="flex items-center gap-1">
                          💳 Visa, Mastercard, AMEX
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option Virement Bancaire */}
                <div 
                  onClick={() => setSelectedMethod('bank')}
                  className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    selectedMethod === 'bank' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        selectedMethod === 'bank' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {selectedMethod === 'bank' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🏦</span>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {t({ en: 'Bank Transfer', fr: 'Virement Bancaire' })}
                        </h4>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {t({ 
                          en: 'Pay by bank transfer. Processing takes 2-3 business days.',
                          fr: 'Payez par virement bancaire. Traitement sous 2-3 jours ouvrables.'
                        })}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          🏦 SEPA
                        </span>
                        <span className="flex items-center gap-1">
                          📋 {t({ en: 'Instructions provided', fr: 'Instructions fournies' })}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ 2-3 {t({ en: 'days', fr: 'jours' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton de confirmation */}
              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={selectedMethod === 'stripe' ? handleStripePayment : handleBankTransfer}
                  disabled={!selectedMethod || isProcessing}
                  className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all transform ${
                    selectedMethod && !isProcessing
                      ? 'bg-gray-600 hover:bg-gray-700 text-white hover:scale-[1.02] shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {t({ en: 'Processing...', fr: 'Traitement...' })}
                    </span>
                  ) : selectedMethod ? (
                    <span className="flex items-center justify-center gap-2">
                      {selectedMethod === 'stripe' ? '💳' : '🏦'}
                      {selectedMethod === 'stripe' 
                        ? t({ en: 'Pay with Stripe', fr: 'Payer avec Stripe' })
                        : t({ en: 'Get Bank Details', fr: 'Obtenir les Coordonnées Bancaires' })
                      }
                      <span>→</span>
                    </span>
                  ) : (
                    t({ en: 'Select a payment method', fr: 'Sélectionnez une méthode de paiement' })
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  🔒 {t({ 
                    en: 'Your payment is secured and encrypted. Your data is protected.',
                    fr: 'Votre paiement est sécurisé et crypté. Vos données sont protégées.'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}