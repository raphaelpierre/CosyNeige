'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, pricing } from '@/lib/data/chalet';
import { calculateNights, calculatePrice, formatEuro, getSeason } from '@/lib/utils';
import BookingCalendar from '@/components/ui/BookingCalendar';

export default function BookingPage() {
  const { t } = useLanguage();
  const router = useRouter();
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

  const handleDateSelect = (checkInDate: Date | null, checkOutDate: Date | null) => {
    if (checkInDate) {
      setCheckIn(checkInDate.toISOString().split('T')[0]);
    }
    if (checkOutDate) {
      setCheckOut(checkOutDate.toISOString().split('T')[0]);
    }
  };

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const season = checkIn ? getSeason(new Date(checkIn)) : null;
  const priceCalculation = checkIn && checkOut ? calculatePrice(checkIn, checkOut) : null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          checkIn,
          checkOut,
          guests,
          totalPrice: priceCalculation?.total || 0,
        }),
      });

      if (response.ok) {
        // Rediriger vers la page de confirmation avec les paramètres
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
        en: 'An error occurred. Please try again later.',
        fr: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920"
            alt="Chalet booking"
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t({ en: 'Rates & Booking', fr: 'Tarifs & Réservation' })}</h1>
          <p className="text-xl md:text-2xl">{t({ en: 'Plan Your Alpine Retreat', fr: 'Planifiez Votre Séjour Alpin' })}</p>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Seasonal Rates', fr: 'Tarifs Saisonniers' })}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t({
              en: 'Our rates vary by season. Minimum stay: 7 nights.',
              fr: 'Nos tarifs varient selon la saison. Séjour minimum : 7 nuits.',
            })}
          </p>

          <div className="bg-cream rounded-lg p-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <div className="font-bold text-forest-900">{t({ en: 'High Season', fr: 'Haute Saison' })}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Christmas, New Year, February', fr: 'Noël, Nouvel An, Février' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest-900">{formatEuro(pricing.highSeason.min)}</div>
                  <div className="text-sm text-gray-600">{t({ en: 'per week', fr: 'par semaine' })}</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⛷️</span>
                  <div>
                    <div className="font-bold text-forest-900">{t({ en: 'Mid Season', fr: 'Moyenne Saison' })}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'January, March', fr: 'Janvier, Mars' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest-900">{formatEuro(pricing.midSeason.min)}</div>
                  <div className="text-sm text-gray-600">{t({ en: 'per week', fr: 'par semaine' })}</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍂</span>
                  <div>
                    <div className="font-bold text-forest-900">{t({ en: 'Low Season', fr: 'Basse Saison' })}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'April, November, early December', fr: 'Avril, Novembre, début Décembre' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest-900">{formatEuro(pricing.lowSeason.min)}</div>
                  <div className="text-sm text-gray-600">{t({ en: 'per week', fr: 'par semaine' })}</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☀️</span>
                  <div>
                    <div className="font-bold text-forest-900">{t({ en: 'Summer', fr: 'Été' })}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'June, July, August', fr: 'Juin, Juillet, Août' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest-900">{formatEuro(pricing.summerSeason.min)}</div>
                  <div className="text-sm text-gray-600">{t({ en: 'per week', fr: 'par semaine' })}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-forest-50 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-2">
              <strong>{t({ en: 'Included:', fr: 'Inclus :' })}</strong> {t({ en: 'WiFi, heating, linens, towels, end-of-stay cleaning', fr: 'WiFi, chauffage, linge, serviettes, ménage de fin de séjour' })}
            </p>
            <p className="text-gray-600 text-sm">
              {t({ en: '+ Tourist tax €2/person/night', fr: '+ Taxe de séjour 2€/personne/nuit' })}
            </p>
          </div>
        </div>
      </section>

      {/* Availability Calendar */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Availability Calendar', fr: 'Calendrier des Disponibilités' })}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t({
              en: 'Select your check-in and check-out dates. Green dates are available, red dates are already booked.',
              fr: 'Sélectionnez vos dates d\'arrivée et de départ. Les dates vertes sont disponibles, les dates rouges sont déjà réservées.',
            })}
          </p>

          <div className="max-w-xl mx-auto">
            <BookingCalendar onDateSelect={handleDateSelect} />
          </div>

          {checkIn && checkOut && (
            <div className="mt-8 bg-white rounded-lg p-6 text-center max-w-xl mx-auto">
              <h3 className="font-bold text-forest-900 mb-4">{t({ en: 'Selected Period', fr: 'Période Sélectionnée' })}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t({ en: 'Check-in', fr: 'Arrivée' })}</div>
                  <div className="font-bold text-forest-900">{new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t({ en: 'Check-out', fr: 'Départ' })}</div>
                  <div className="font-bold text-forest-900">{new Date(checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold text-forest-700">
                {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Price Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-8 text-center">
            {t({ en: 'Calculate Your Stay', fr: 'Calculez Votre Séjour' })}
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Check-in', fr: 'Arrivée' })}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Check-out', fr: 'Départ' })}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Guests', fr: 'Personnes' })}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {priceCalculation && nights >= 7 && (
              <div className="bg-forest-50 rounded-lg p-6 border-2 border-forest-700">
                <h3 className="text-xl font-bold text-forest-900 mb-4">{t({ en: 'Price Breakdown', fr: 'Détail du Prix' })}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>{nights} {t({ en: 'nights', fr: 'nuits' })} ({season && t({
                      en: season === 'high' ? 'High Season' : season === 'mid' ? 'Mid Season' : season === 'low' ? 'Low Season' : 'Summer',
                      fr: season === 'high' ? 'Haute Saison' : season === 'mid' ? 'Moyenne Saison' : season === 'low' ? 'Basse Saison' : 'Été'
                    })})</span>
                    <span className="font-semibold">{formatEuro(priceCalculation.basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t({ en: 'Cleaning fee', fr: 'Frais de ménage' })}</span>
                    <span className="font-semibold">{formatEuro(priceCalculation.cleaningFee)}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-forest-700 flex justify-between text-xl font-bold text-forest-900">
                    <span>{t({ en: 'Total', fr: 'Total' })}</span>
                    <span>{formatEuro(priceCalculation.total)}</span>
                  </div>
                  <div className="text-sm text-gray-600 pt-2">
                    + {t({ en: 'Tourist tax', fr: 'Taxe de séjour' })}: {formatEuro(guests * nights * 2)}
                  </div>
                </div>
              </div>
            )}

            {nights > 0 && nights < 7 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-800">
                {t({ en: 'Minimum stay is 7 nights', fr: 'Séjour minimum de 7 nuits' })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Request a Booking', fr: 'Demande de Réservation' })}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t({
              en: 'Fill out the form below and we will get back to you within 24 hours to confirm availability.',
              fr: 'Remplissez le formulaire ci-dessous et nous vous répondrons sous 24 heures pour confirmer la disponibilité.',
            })}
          </p>

          <form onSubmit={handleSubmit} className="bg-cream rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'First Name', fr: 'Prénom' })} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Email', fr: 'Email' })} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Message / Special Requests', fr: 'Message / Demandes Spéciales' })}
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                placeholder={t({
                  en: 'Let us know if you have any special requests or questions...',
                  fr: 'Faites-nous savoir si vous avez des demandes spéciales ou des questions...',
                })}
              />
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-forest-900 mb-2">{t({ en: 'Booking Summary', fr: 'Résumé de Réservation' })}</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>{t({ en: 'Check-in:', fr: 'Arrivée :' })}</strong> {checkIn || t({ en: 'Not selected', fr: 'Non sélectionné' })}</p>
                <p><strong>{t({ en: 'Check-out:', fr: 'Départ :' })}</strong> {checkOut || t({ en: 'Not selected', fr: 'Non sélectionné' })}</p>
                <p><strong>{t({ en: 'Guests:', fr: 'Personnes :' })}</strong> {guests}</p>
                {priceCalculation && <p><strong>{t({ en: 'Estimated Total:', fr: 'Total Estimé :' })}</strong> {formatEuro(priceCalculation.total)}</p>}
              </div>
            </div>

            {(!checkIn || !checkOut || nights < 7) && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6 text-yellow-800">
                <p className="font-semibold mb-2">
                  {t({ en: 'Complete these steps to submit your booking:', fr: 'Complétez ces étapes pour soumettre votre réservation :' })}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {!checkIn && <li>{t({ en: 'Select a check-in date', fr: 'Sélectionnez une date d\'arrivée' })}</li>}
                  {!checkOut && <li>{t({ en: 'Select a check-out date', fr: 'Sélectionnez une date de départ' })}</li>}
                  {checkIn && checkOut && nights < 7 && <li>{t({ en: 'Minimum stay is 7 nights (currently: ' + nights + ' nights)', fr: 'Séjour minimum de 7 nuits (actuellement : ' + nights + ' nuits)' })}</li>}
                </ul>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={!checkIn || !checkOut || nights < 7 || isSubmitting}
                className={`w-full px-8 py-5 rounded-xl font-bold text-xl transition-all shadow-2xl border-2 ${
                  !checkIn || !checkOut || nights < 7 || isSubmitting
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-400'
                    : 'bg-gradient-to-r from-forest-700 to-forest-600 hover:from-forest-800 hover:to-forest-700 text-white hover:shadow-forest-700/50 hover:scale-105 border-forest-800'
                }`}
              >
                {isSubmitting
                  ? t({ en: '⏳ Sending...', fr: '⏳ Envoi en cours...' })
                  : (!checkIn || !checkOut || nights < 7)
                    ? t({ en: '⚠️ Complete dates above (minimum 7 nights)', fr: '⚠️ Complétez les dates ci-dessus (minimum 7 nuits)' })
                    : t({ en: '✅ Submit Booking Request', fr: '✅ Envoyer la Demande de Réservation' })}
              </button>
            </div>

            <p className="text-xs text-gray-600 text-center mt-4">
              {t({
                en: '* This is a booking request. Your reservation will be confirmed once we verify availability and process your payment.',
                fr: '* Ceci est une demande de réservation. Votre réservation sera confirmée une fois que nous aurons vérifié la disponibilité et traité votre paiement.',
              })}
            </p>
          </form>
        </div>
      </section>

      {/* Booking Info */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-forest-900 mb-8 text-center">
            {t({ en: 'Booking Information', fr: 'Informations Réservation' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-forest-800 mb-3">📅 {t({ en: 'Check-in/Check-out', fr: 'Arrivée/Départ' })}</h3>
              <p className="text-gray-700 text-sm">{t({ en: 'Check-in: Saturday 4:00 PM', fr: 'Arrivée : Samedi 16h00' })}</p>
              <p className="text-gray-700 text-sm">{t({ en: 'Check-out: Saturday 10:00 AM', fr: 'Départ : Samedi 10h00' })}</p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-forest-800 mb-3">💳 {t({ en: 'Payment', fr: 'Paiement' })}</h3>
              <p className="text-gray-700 text-sm">{t({ en: '30% deposit at booking', fr: 'Acompte de 30% à la réservation' })}</p>
              <p className="text-gray-700 text-sm">{t({ en: 'Balance due 30 days before arrival', fr: 'Solde 30 jours avant l\'arrivée' })}</p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-forest-800 mb-3">🔒 {t({ en: 'Security Deposit', fr: 'Caution' })}</h3>
              <p className="text-gray-700 text-sm">{t({ en: '€500 refundable deposit', fr: 'Caution remboursable de 500€' })}</p>
              <p className="text-gray-700 text-sm">{t({ en: 'Returned within 7 days after departure', fr: 'Restituée sous 7 jours après le départ' })}</p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-forest-800 mb-3">❌ {t({ en: 'Cancellation', fr: 'Annulation' })}</h3>
              <p className="text-gray-700 text-sm">{t({ en: 'Free cancellation up to 60 days before', fr: 'Annulation gratuite jusqu\'à 60 jours avant' })}</p>
              <p className="text-gray-700 text-sm">{t({ en: '50% refund 30-60 days before', fr: 'Remboursement 50% entre 30-60 jours' })}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
