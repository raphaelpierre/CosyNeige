'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

function StripePaymentContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const clientSecret = searchParams.get('clientSecret');
  const bookingId = searchParams.get('bookingId');

  // Ici vous intégrerez les composants Stripe Elements
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

          {/* Placeholder pour les composants Stripe */}
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {t({ en: 'Stripe Integration in Progress', fr: 'Intégration Stripe en Cours' })}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t({ 
                  en: 'The Stripe payment form will be integrated here. For now, you can continue with bank transfer.',
                  fr: 'Le formulaire de paiement Stripe sera intégré ici. Pour l\'instant, vous pouvez continuer avec un virement bancaire.'
                })}
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push(`/booking/payment/bank-transfer?bookingId=${bookingId}`)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  🏦 {t({ en: 'Use Bank Transfer', fr: 'Utiliser le Virement' })}
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  ← {t({ en: 'Go Back', fr: 'Retour' })}
                </button>
              </div>
            </div>
          </div>

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