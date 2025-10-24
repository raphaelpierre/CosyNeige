'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId?: string) => void;
  onError: (error: string) => void;
  clientSecret: string;
  billingDetails?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function PaymentForm({
  amount,
  onSuccess,
  onError,
  clientSecret,
  billingDetails
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Une erreur est survenue');
      onError(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded - pass payment intent ID to callback
      onSuccess(paymentIntent.id);
    } else {
      // Payment in another state (requires_action, processing, etc.)
      onSuccess();
    }

    setIsLoading(false);
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-slate-800">
            {t({ en: 'Total Amount', fr: 'Montant Total' })}
          </span>
          <span className="text-2xl font-bold text-slate-900">
            {formatEuro(amount)}
          </span>
        </div>
        
        <div className="text-sm text-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <span>🔒</span>
            <span>{t({ en: 'Secure payment powered by Stripe', fr: 'Paiement sécurisé par Stripe' })}</span>
          </div>
          <div className="text-xs">
            {t({ 
              en: 'Your payment information is encrypted and secure', 
              fr: 'Vos informations de paiement sont cryptées et sécurisées' 
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t({ en: 'Payment Information', fr: 'Informations de Paiement' })}
        </h3>
        
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'paypal'],
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
            defaultValues: billingDetails ? {
              billingDetails: {
                name: billingDetails.name,
                email: billingDetails.email,
                phone: billingDetails.phone,
              }
            } : undefined,
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-800">
                {t({ en: 'Payment Error', fr: 'Erreur de Paiement' })}
              </h4>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
          !stripe || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>{t({ en: 'Processing...', fr: 'Traitement...' })}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span>💳</span>
            <span>{t({ en: 'Pay Now', fr: 'Payer Maintenant' })} {formatEuro(amount)}</span>
          </div>
        )}
      </button>

      <div className="text-center text-xs text-gray-500">
        {t({ 
          en: 'By proceeding, you agree to our terms and conditions', 
          fr: 'En continuant, vous acceptez nos conditions générales' 
        })}
      </div>
    </form>
  );
}