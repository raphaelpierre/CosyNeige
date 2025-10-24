'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import StripeProvider from '@/components/payment/StripeProvider';
import PaymentForm from '@/components/payment/PaymentForm';

function StripePaymentContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientSecret = searchParams.get('clientSecret');
  const bookingId = searchParams.get('bookingId');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const email = searchParams.get('email') || '';
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const phone = searchParams.get('phone') || '';

  const handleSuccess = async (paymentIntentId?: string) => {
    // Update reservation status in database
    if (bookingId && paymentIntentId) {
      try {
        await fetch(`/api/reservations/${bookingId}/confirm-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId }),
        });
        console.log('✅ Reservation status updated');
      } catch (error) {
        console.error('Failed to update reservation:', error);
        // Continue to confirmation anyway - webhook will handle it
      }
    }
    router.push(`/booking/confirmation?bookingId=${bookingId}&paymentMethod=stripe`);
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
  };

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {t({ en: 'Invalid payment session', fr: 'Session de paiement invalide' })}
          </h1>
          <button
            onClick={() => router.push('/booking/payment')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold"
          >
            {t({ en: 'Back to payment', fr: 'Retour au paiement' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              💳 {t({ en: 'Stripe Payment', fr: 'Paiement Stripe' })}
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t({ en: 'Secure Payment with Stripe', fr: 'Paiement Sécurisé avec Stripe' })}
            </h2>
            <p className="text-gray-600">
              {t({
                en: 'Complete your payment safely and securely',
                fr: 'Finalisez votre paiement en toute sécurité'
              })}
            </p>
          </div>

          {/* Stripe Payment Form */}
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm
              amount={amount}
              clientSecret={clientSecret}
              onSuccess={handleSuccess}
              onError={handleError}
              billingDetails={{
                name: `${firstName} ${lastName}`,
                email,
                phone,
              }}
            />
          </StripeProvider>

          {/* Indicateurs de sécurité */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>SSL {t({ en: 'Encrypted', fr: 'Crypté' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>PCI DSS</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💳</span>
                <span>3D Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StripePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    }>
      <StripePaymentContent />
    </Suspense>
  );
}