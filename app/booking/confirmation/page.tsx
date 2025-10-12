'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName } from '@/lib/data/chalet';

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

  useEffect(() => {
    // Récupérer les données de réservation depuis les paramètres URL
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const total = searchParams.get('total');
    const email = searchParams.get('email');

    if (!checkIn || !checkOut) {
      // Si pas de données, rediriger vers la page de réservation
      router.push('/booking');
      return;
    }

    setBookingData({ checkIn, checkOut, guests, total, email });
  }, [searchParams, router]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 animate-in zoom-in duration-500">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-forest-900 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t({ en: 'Booking Request Received!', fr: 'Demande de Réservation Reçue !' })}
          </h1>
          <p className="text-xl text-gray-600 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {t({
              en: 'Thank you for your interest in staying at CosyNeige',
              fr: 'Merci pour votre intérêt pour un séjour à CosyNeige'
            })}
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <div className="border-l-4 border-forest-700 pl-6 mb-8">
            <h2 className="text-2xl font-bold text-forest-900 mb-2">
              {t({ en: 'What happens next?', fr: 'Et maintenant ?' })}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t({
                en: 'We have received your booking request and will review it shortly. You will receive a confirmation email within 24 hours.',
                fr: 'Nous avons reçu votre demande de réservation et allons l\'examiner prochainement. Vous recevrez un email de confirmation sous 24 heures.',
              })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-forest-50 to-cream rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-forest-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              {t({ en: 'Booking Summary', fr: 'Résumé de Réservation' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">📅 {t({ en: 'Check-in', fr: 'Arrivée' })}</div>
                <div className="font-bold text-forest-900">
                  {new Date(bookingData.checkIn).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">📅 {t({ en: 'Check-out', fr: 'Départ' })}</div>
                <div className="font-bold text-forest-900">
                  {new Date(bookingData.checkOut).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">👥 {t({ en: 'Guests', fr: 'Personnes' })}</div>
                <div className="font-bold text-forest-900">{bookingData.guests}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">💰 {t({ en: 'Estimated Total', fr: 'Total Estimé' })}</div>
                <div className="font-bold text-forest-900">{bookingData.total || '0'}€</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📧</span>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">
                  {t({ en: 'Confirmation Email', fr: 'Email de Confirmation' })}
                </h4>
                <p className="text-blue-800 text-sm">
                  {t({
                    en: `A confirmation email has been sent to ${bookingData.email}. Please check your inbox (and spam folder).`,
                    fr: `Un email de confirmation a été envoyé à ${bookingData.email}. Veuillez vérifier votre boîte de réception (et vos spams).`,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-forest-50 to-transparent rounded-lg">
              <span className="text-3xl flex-shrink-0">1️⃣</span>
              <div>
                <h4 className="font-semibold text-forest-900 mb-1">
                  {t({ en: 'Availability Check', fr: 'Vérification Disponibilité' })}
                </h4>
                <p className="text-gray-700 text-sm">
                  {t({
                    en: 'We will verify that the dates are available and not already booked.',
                    fr: 'Nous allons vérifier que les dates sont disponibles et non déjà réservées.',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-forest-50 to-transparent rounded-lg">
              <span className="text-3xl flex-shrink-0">2️⃣</span>
              <div>
                <h4 className="font-semibold text-forest-900 mb-1">
                  {t({ en: 'Email Confirmation', fr: 'Confirmation par Email' })}
                </h4>
                <p className="text-gray-700 text-sm">
                  {t({
                    en: 'You will receive an email with booking details and payment instructions.',
                    fr: 'Vous recevrez un email avec les détails de réservation et les instructions de paiement.',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-forest-50 to-transparent rounded-lg">
              <span className="text-3xl flex-shrink-0">3️⃣</span>
              <div>
                <h4 className="font-semibold text-forest-900 mb-1">
                  {t({ en: 'Payment & Final Confirmation', fr: 'Paiement & Confirmation Finale' })}
                </h4>
                <p className="text-gray-700 text-sm">
                  {t({
                    en: 'Once payment is received (30% deposit), your booking is confirmed!',
                    fr: 'Une fois le paiement reçu (acompte de 30%), votre réservation est confirmée !',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-forest-700 to-forest-600 hover:from-forest-800 hover:to-forest-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span>{t({ en: 'Back to Home', fr: 'Retour Accueil' })}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            href="/guide"
            className="inline-flex items-center gap-2 bg-white hover:bg-forest-50 border-2 border-forest-700 text-forest-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>📖</span>
            <span>{t({ en: 'Guest Guide', fr: 'Guide Voyageur' })}</span>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center p-6 bg-gradient-to-r from-forest-700 to-forest-800 rounded-2xl text-white">
          <h3 className="font-bold text-xl mb-2">
            {t({ en: 'Questions?', fr: 'Des Questions ?' })}
          </h3>
          <p className="mb-4">
            {t({
              en: 'Feel free to contact us if you have any questions about your booking.',
              fr: 'N\'hésitez pas à nous contacter si vous avez des questions sur votre réservation.',
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:info@chaletlessires.com" className="flex items-center gap-2 hover:text-cream transition-colors">
              <span>📧</span>
              <span>info@chaletlessires.com</span>
            </a>
            <a href="tel:+33XXXXXXXXX" className="flex items-center gap-2 hover:text-cream transition-colors">
              <span>📞</span>
              <span>+33 (0)X XX XX XX XX</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
