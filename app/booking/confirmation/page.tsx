'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';

function BookingConfirmationContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<{
    id?: string;
    firstName?: string;
    lastName?: string;
    email: string | null;
    checkIn: string;
    checkOut: string;
    guests: string | null;
    total: string | null;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const total = searchParams.get('total');
    const email = searchParams.get('email');
    const payment = searchParams.get('paymentMethod');

    if (!bookingId && (!checkIn || !checkOut)) {
      router.push('/booking');
      return;
    }

    if (payment) {
      setPaymentMethod(payment);
    }

    setBookingData({ id: bookingId || undefined, checkIn: checkIn || '', checkOut: checkOut || '', guests, total, email });
  }, [searchParams, router]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const nights = bookingData.checkIn && bookingData.checkOut
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 3600 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 animate-in zoom-in duration-500 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t({ en: 'Booking Confirmed!', fr: 'Réservation Confirmée !' })}
          </h1>
          <p className="text-xl text-gray-600 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {t({
              en: 'Thank you for booking with Chalet Balmotte 810',
              fr: 'Merci pour votre réservation au Chalet Balmotte 810'
            })}
          </p>
          {bookingData.id && (
            <div className="mt-4 inline-block bg-slate-50 border-2 border-slate-300 rounded-xl px-6 py-3">
              <div className="text-sm text-slate-800 mb-1">
                {t({ en: 'Booking Reference', fr: 'Référence de Réservation' })}
              </div>
              <div className="font-mono text-2xl font-bold text-slate-900">
                #{bookingData.id.substring(0, 8).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Main Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">

          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-cream rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              {t({ en: 'Booking Summary', fr: 'Résumé de Réservation' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">📅 {t({ en: 'Check-in', fr: 'Arrivée' })}</div>
                <div className="font-bold text-slate-900">{formatDate(bookingData.checkIn)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {t({ en: 'From 4:00 PM', fr: 'À partir de 16h00' })}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">📅 {t({ en: 'Check-out', fr: 'Départ' })}</div>
                <div className="font-bold text-slate-900">{formatDate(bookingData.checkOut)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {t({ en: 'Before 10:00 AM', fr: 'Avant 10h00' })}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">🌙 {t({ en: 'Duration', fr: 'Durée' })}</div>
                <div className="font-bold text-slate-900">
                  {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">👥 {t({ en: 'Guests', fr: 'Personnes' })}</div>
                <div className="font-bold text-slate-900">{bookingData.guests || '—'}</div>
              </div>
              {bookingData.total && (
                <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">💰 {t({ en: 'Total Amount', fr: 'Montant Total' })}</div>
                  <div className="font-bold text-2xl text-slate-900">{bookingData.total}€</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t({ en: '30% paid - Balance due 30 days before arrival', fr: '30% payé - Solde dû 30 jours avant l\'arrivée' })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Confirmation */}
          {bookingData.email && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📧</span>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2">
                    {t({ en: 'Confirmation Email Sent', fr: 'Email de Confirmation Envoyé' })}
                  </h4>
                  <p className="text-blue-800 text-sm mb-3">
                    {t({
                      en: `A detailed confirmation has been sent to ${bookingData.email}`,
                      fr: `Une confirmation détaillée a été envoyée à ${bookingData.email}`
                    })}
                  </p>
                  <p className="text-blue-700 text-xs">
                    {t({
                      en: 'Please check your inbox (and spam folder) for booking details and payment receipt.',
                      fr: 'Veuillez vérifier votre boîte de réception (et spams) pour les détails et le reçu de paiement.'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps Timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🗓️</span>
              {t({ en: 'Next Steps', fr: 'Prochaines Étapes' })}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border-l-4 border-green-500">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">
                    {t({ en: 'Booking Confirmed', fr: 'Réservation Confirmée' })}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {paymentMethod === 'bank' ? t({
                      en: 'Your booking is confirmed. Please complete the bank transfer to secure your dates.',
                      fr: 'Votre réservation est confirmée. Veuillez effectuer le virement bancaire pour sécuriser vos dates.'
                    }) : t({
                      en: 'Your 30% deposit has been received. Your dates are now secured!',
                      fr: 'Votre acompte de 30% a été reçu. Vos dates sont maintenant sécurisées !'
                    })}
                  </p>
                </div>
              </div>

              {paymentMethod === 'bank' && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg border-l-4 border-yellow-500">
                  <span className="text-3xl flex-shrink-0">🏦</span>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">
                      {t({ en: 'Bank Transfer Pending', fr: 'Virement Bancaire en Attente' })}
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {t({
                        en: 'Please check your email for bank transfer details. Processing takes 2-3 business days.',
                        fr: 'Veuillez consulter votre email pour les coordonnées bancaires. Le traitement prend 2-3 jours ouvrables.'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border-l-4 border-blue-500">
                <span className="text-3xl flex-shrink-0">📱</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    {t({ en: 'Expect Our Call Within 48h', fr: 'Attendez Notre Appel Sous 48h' })}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {t({
                      en: 'We\'ll contact you to finalize details and answer any questions.',
                      fr: 'Nous vous contacterons pour finaliser les détails et répondre à vos questions.'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg border-l-4 border-yellow-500">
                <span className="text-3xl flex-shrink-0">💰</span>
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">
                    {t({ en: 'Balance Payment (30 days before)', fr: 'Paiement du Solde (30 jours avant)' })}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {t({
                      en: 'You\'ll receive a reminder email 30 days before check-in for the remaining balance.',
                      fr: 'Vous recevrez un rappel par email 30 jours avant l\'arrivée pour le solde restant.'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border-l-4 border-purple-500">
                <span className="text-3xl flex-shrink-0">🏔️</span>
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">
                    {t({ en: 'Welcome to the Alps!', fr: 'Bienvenue dans les Alpes !' })}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {t({
                      en: 'Arrive anytime after 4 PM on check-in day. Full details in your guest guide.',
                      fr: 'Arrivée après 16h le jour de votre arrivée. Tous les détails dans votre guide voyageur.'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6">
            <h4 className="font-bold text-gray-900 mb-4">
              {t({ en: 'Quick Actions', fr: 'Actions Rapides' })}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Chalet Balmotte 810 Stay')}&dates=${bookingData.checkIn.replace(/-/g, '')}/${bookingData.checkOut.replace(/-/g, '')}&details=${encodeURIComponent('Your stay at Chalet Balmotte 810')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 hover:border-slate-400 rounded-lg font-semibold text-slate-800 transition-all hover:shadow-md"
              >
                <span>📅</span>
                {t({ en: 'Add to Calendar', fr: 'Ajouter au Calendrier' })}
              </a>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 hover:border-slate-400 rounded-lg font-semibold text-slate-800 transition-all hover:shadow-md"
              >
                <span>🖨️</span>
                {t({ en: 'Print Confirmation', fr: 'Imprimer Confirmation' })}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-slate-700/50 border-2 border-slate-800 hover:scale-105"
          >
            <span className="text-2xl">🏠</span>
            <span>{t({ en: 'Back to Home', fr: 'Retour Accueil' })}</span>
            <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>
          </Link>

          <Link
            href="/guide"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 border-2 border-blue-600 hover:scale-105"
          >
            <span className="text-2xl">📖</span>
            <span>{t({ en: 'View Guest Guide', fr: 'Voir Guide Voyageur' })}</span>
            <span className="group-hover:translate-x-1 transition-transform">✨</span>
          </Link>
        </div>

        {/* Useful Information Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-800 rounded-2xl p-8 text-white mb-8">
          <h3 className="font-bold text-2xl mb-6 text-center">
            {t({ en: 'Useful Information', fr: 'Informations Utiles' })}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>📍</span>
                {t({ en: 'Getting There', fr: 'Comment Venir' })}
              </h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• {t({ en: 'Address: 810 route de Balmotte, Châtillon-sur-Cluses, 74300', fr: 'Adresse : 810 route de Balmotte, Châtillon-sur-Cluses, 74300' })}</li>
                <li>• {t({ en: '1h from Geneva Airport', fr: '1h de l\'Aéroport de Genève' })}</li>
                <li>• {t({ en: '5 parking spaces available', fr: '5 places de parking disponibles' })}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>⛷️</span>
                {t({ en: 'Nearby Ski Resorts', fr: 'Stations de Ski Proches' })}
              </h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Les Carroz - 15 min</li>
                <li>• Flaine - 25 min</li>
                <li>• Les Gets - 25 min</li>
                <li>• Morzine - 20 min</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-slate-100">
          <h3 className="font-bold text-xl mb-4 text-slate-900">
            {t({ en: 'Questions?', fr: 'Des Questions ?' })}
          </h3>
          <p className="mb-4 text-gray-700">
            {t({
              en: 'Feel free to contact us anytime',
              fr: 'N\'hésitez pas à nous contacter'
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:contact@chalet-balmotte810.com"
              className="flex items-center gap-2 text-slate-800 hover:text-slate-900 font-semibold transition-colors"
            >
              <span>📧</span>
              <span>contact@chalet-balmotte810.com</span>
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a
              href="tel:+33685858491"
              className="flex items-center gap-2 text-slate-800 hover:text-slate-900 font-semibold transition-colors"
            >
              <span>📞</span>
              <span>+33 6 85 85 84 91</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
