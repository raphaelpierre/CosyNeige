'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

function BankTransferContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState<string | null>(null);

  const bookingId = searchParams.get('bookingId');
  const deposit = parseFloat(searchParams.get('deposit') || '0');

  const bankDetails = {
    bankName: 'Crédit Agricole',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'AGRIFRPP',
    accountName: 'Chalet Les Sires SARL',
    reference: `CHALET-${bookingId}`,
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const confirmPayment = async () => {
    try {
      // Marquer la réservation comme "en attente de paiement"
      const response = await fetch(`/api/reservations/${bookingId}/payment-pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        router.push(`/booking/confirmation?bookingId=${bookingId}&paymentMethod=bank`);
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(t({
        en: 'An error occurred. Please contact us directly.',
        fr: 'Une erreur s\'est produite. Veuillez nous contacter directement.'
      }));
    }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🏦 {t({ en: 'Bank Transfer Payment', fr: 'Paiement par Virement' })}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t({ en: 'Payment Instructions', fr: 'Instructions de Paiement' })}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {t({ en: 'Follow these steps to complete your payment', fr: 'Suivez ces étapes pour finaliser votre paiement' })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t({ en: 'Copy bank details', fr: 'Copiez les coordonnées bancaires' })}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t({ 
                        en: 'Use the bank details provided to make your transfer',
                        fr: 'Utilisez les coordonnées bancaires fournies pour effectuer votre virement'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t({ en: 'Make the transfer', fr: 'Effectuez le virement' })}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t({ 
                        en: 'Transfer the exact amount with the reference provided',
                        fr: 'Transférez le montant exact avec la référence fournie'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t({ en: 'Confirm payment', fr: 'Confirmez le paiement' })}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t({ 
                        en: 'Click the confirmation button below after making the transfer',
                        fr: 'Cliquez sur le bouton de confirmation ci-dessous après avoir effectué le virement'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800 text-sm">
                      {t({ en: 'Important', fr: 'Important' })}
                    </h4>
                    <p className="text-yellow-700 text-xs mt-1">
                      {t({ 
                        en: 'The reference is essential for identifying your payment. Processing takes 2-3 business days.',
                        fr: 'La référence est essentielle pour identifier votre paiement. Le traitement prend 2-3 jours ouvrables.'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coordonnées bancaires */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                🏦 {t({ en: 'Bank Details', fr: 'Coordonnées Bancaires' })}
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t({ en: 'Amount to transfer', fr: 'Montant à virer' })}
                    </label>
                    <button
                      onClick={() => copyToClipboard(deposit.toString(), 'amount')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copied === 'amount' ? '✅' : '📋'}
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatEuro(deposit)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t({ en: 'Bank name', fr: 'Nom de la banque' })}
                    </label>
                    <button
                      onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copied === 'bank' ? '✅' : '📋'}
                    </button>
                  </div>
                  <div className="font-mono text-gray-900">{bankDetails.bankName}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">IBAN</label>
                    <button
                      onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copied === 'iban' ? '✅' : '📋'}
                    </button>
                  </div>
                  <div className="font-mono text-gray-900 break-all">{bankDetails.iban}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">BIC/SWIFT</label>
                    <button
                      onClick={() => copyToClipboard(bankDetails.bic, 'bic')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copied === 'bic' ? '✅' : '📋'}
                    </button>
                  </div>
                  <div className="font-mono text-gray-900">{bankDetails.bic}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t({ en: 'Account name', fr: 'Nom du compte' })}
                    </label>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountName, 'account')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copied === 'account' ? '✅' : '📋'}
                    </button>
                  </div>
                  <div className="font-mono text-gray-900">{bankDetails.accountName}</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-blue-700">
                      ⚠️ {t({ en: 'Payment reference', fr: 'Référence de paiement' })}
                    </label>
                    <button
                      onClick={() => copyToClipboard(bankDetails.reference, 'reference')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copied === 'reference' ? '✅' : '📋'}
                    </button>
                  </div>
                  <div className="font-mono font-bold text-blue-900 text-lg">
                    {bankDetails.reference}
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    {t({ 
                      en: 'This reference is mandatory for payment identification',
                      fr: 'Cette référence est obligatoire pour l\'identification du paiement'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={confirmPayment}
                  className="w-full px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>✅</span>
                    {t({ en: 'I have made the transfer', fr: 'J\'ai effectué le virement' })}
                  </span>
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  {t({ 
                    en: 'We will verify your payment within 2-3 business days',
                    fr: 'Nous vérifierons votre paiement sous 2-3 jours ouvrables'
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

export default function BankTransferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    }>
      <BankTransferContent />
    </Suspense>
  );
}