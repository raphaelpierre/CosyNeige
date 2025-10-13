'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, pricing } from '@/lib/data/chalet';
import { calculateNights, calculatePrice, formatEuro, getSeason } from '@/lib/utils';
import BookingCalendar from '@/components/ui/BookingCalendar';
import DateInput from '@/components/ui/DateInput';
import FrenchDatePicker from '@/components/ui/FrenchDatePicker';

export default function BookingPage() {
  const { t, language } = useLanguage();
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
    
    // Validation des séjours minimum
    const minimumNights = season === 'high' ? 7 : 3;
    if (nights < minimumNights) {
      alert(t({
        en: `Minimum ${minimumNights} nights required for this period`,
        fr: `Minimum ${minimumNights} nuits requis pour cette période`
      }));
      return;
    }
    
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
            src="/images/ExteriieurJacuzi.jpg"
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
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Seasonal Rates', fr: 'Tarifs Saisonniers' })}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t({
              en: 'Our rates vary by season. Minimum stay: 7 nights in high season, 3 nights in low season.',
              fr: 'Nos tarifs varient selon la saison. Séjour minimum : 7 nuits en haute saison, 3 nuits en basse saison.',
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
                  <div className="text-2xl font-bold text-forest-900">{formatEuro(410)}</div>
                  <div className="text-sm text-gray-600">{t({ en: 'per night', fr: 'par nuit' })}</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍂</span>
                  <div>
                    <div className="font-bold text-forest-900">{t({ en: 'Low Season', fr: 'Basse Saison' })}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'All other periods', fr: 'Toutes les autres périodes' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest-900">{formatEuro(310)}</div>
                  <div className="text-sm text-gray-600">{t({ en: 'per night', fr: 'par nuit' })}</div>
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
      <section className="py-12 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Check Availability & Calculate Your Stay', fr: 'Vérifiez les Disponibilités et Calculez Votre Séjour' })}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {t({
              en: 'Use the calendar to select your dates and instantly see the price calculation. Green dates are available, red dates are already booked.',
              fr: 'Utilisez le calendrier pour sélectionner vos dates et voir instantanément le calcul des prix. Les dates vertes sont disponibles, les dates rouges sont déjà réservées.',
            })}
          </p>

          {/* Sélecteur du nombre de personnes */}
          <div className="mb-8 max-w-xs mx-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              👥 {t({ en: 'Number of Guests', fr: 'Nombre de Personnes' })}
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent text-center font-semibold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} {t({ en: n === 1 ? 'guest' : 'guests', fr: n === 1 ? 'personne' : 'personnes' })}</option>
              ))}
            </select>
          </div>

          <div className="max-w-2xl mx-auto">
            <BookingCalendar onDateSelect={handleDateSelect} />
          </div>

          {/* Légende des couleurs */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
              <span className="text-gray-600">{t({ en: 'Available', fr: 'Disponible' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
              <span className="text-gray-600">{t({ en: 'Booked', fr: 'Réservé' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
              <span className="text-gray-600">{t({ en: 'Selected', fr: 'Sélectionné' })}</span>
            </div>
          </div>

          {checkIn && checkOut && (
            <div className="mt-8 bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
              <h3 className="font-bold text-forest-900 mb-6 text-xl text-center">
                ✨ {t({ en: 'Selected Period & Price', fr: 'Période Sélectionnée et Prix' })}
              </h3>
              
              {/* Résumé des dates */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{t({ en: 'Check-in', fr: 'Arrivée' })}</div>
                  <div className="font-bold text-forest-900">
                    {new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{t({ en: 'Duration', fr: 'Durée' })}</div>
                  <div className="text-2xl font-bold text-forest-700">
                    {nights} {t({ en: nights === 1 ? 'night' : 'nights', fr: nights === 1 ? 'nuit' : 'nuits' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{t({ en: 'Check-out', fr: 'Départ' })}</div>
                  <div className="font-bold text-forest-900">
                    {new Date(checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Calcul des prix */}
              {priceCalculation && (
                (season === 'high' ? nights >= 7 : nights >= 3) ? (
                  <div className="bg-forest-50 rounded-lg p-6 border-2 border-forest-200">
                    <h4 className="text-lg font-bold text-forest-900 mb-4 text-center">
                      💰 {t({ en: 'Price Breakdown', fr: 'Détail du Prix' })}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>{nights} {t({ en: 'nights', fr: 'nuits' })} ({season && t({
                          en: season === 'high' ? 'High Season' : 'Low Season',
                          fr: season === 'high' ? 'Haute Saison' : 'Basse Saison'
                        })})</span>
                        <span className="font-semibold">{formatEuro(priceCalculation.basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>{t({ en: 'Cleaning fee', fr: 'Frais de ménage' })}</span>
                        <span className="font-semibold">{formatEuro(priceCalculation.cleaningFee)}</span>
                      </div>
                      <div className="pt-3 border-t-2 border-forest-300 flex justify-between text-xl font-bold text-forest-900">
                        <span>{t({ en: 'Total', fr: 'Total' })}</span>
                        <span>{formatEuro(priceCalculation.total)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 pt-2">
                        <span>{t({ en: 'Security deposit', fr: 'Caution' })}</span>
                        <span className="font-semibold">{formatEuro(priceCalculation.depositAmount)}</span>
                      </div>
                      <div className="text-sm text-gray-600 pt-2 text-center">
                        + {t({ en: 'Tourist tax', fr: 'Taxe de séjour' })}: {formatEuro(guests * nights * 2)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700 font-medium">
                      ⚠️ {season === 'high' 
                        ? t({ en: 'Minimum 7 nights required for high season', fr: 'Minimum 7 nuits requis en haute saison' })
                        : t({ en: 'Minimum 3 nights required', fr: 'Minimum 3 nuits requis' })
                      }
                    </p>
                  </div>
                )
              )}

              {/* Message d'information pour séjours trop courts */}
              {nights > 0 && !((season === 'high' ? nights >= 7 : nights >= 3)) && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4 text-center">
                  <p className="text-yellow-800 font-medium text-sm">
                    {season === 'high' 
                      ? t({ en: 'Please select at least 7 nights for high season periods', fr: 'Veuillez sélectionner au moins 7 nuits pour les périodes de haute saison' })
                      : t({ en: 'Please select at least 3 nights for your stay', fr: 'Veuillez sélectionner au moins 3 nuits pour votre séjour' })
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>



      {/* Account Creation Invitation */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t({ 
                  en: 'Create Your Account for Lightning-Fast Booking!', 
                  fr: 'Créez Votre Compte pour une Réservation Ultra-Rapide !' 
                })}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t({
                  en: 'Create your free account in 30 seconds and enjoy auto-filled forms, booking history, and exclusive member offers.',
                  fr: 'Créez votre compte gratuit en 30 secondes et profitez de formulaires pré-remplis, d\'un historique de réservations et d\'offres exclusives membres.',
                })}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">📝</span>
                  <div className="text-left">
                    <p className="font-semibold text-green-800 text-sm">
                      {t({ en: 'Auto-Fill Forms', fr: 'Formulaires Pré-remplis' })}
                    </p>
                    <p className="text-green-600 text-xs">
                      {t({ en: 'Save time on future bookings', fr: 'Gagnez du temps sur vos futures réservations' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">📚</span>
                  <div className="text-left">
                    <p className="font-semibold text-purple-800 text-sm">
                      {t({ en: 'Booking History', fr: 'Historique de Réservations' })}
                    </p>
                    <p className="text-purple-600 text-xs">
                      {t({ en: 'Track all your stays', fr: 'Suivez tous vos séjours' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">🎁</span>
                  <div className="text-left">
                    <p className="font-semibold text-yellow-800 text-sm">
                      {t({ en: 'Exclusive Offers', fr: 'Offres Exclusives' })}
                    </p>
                    <p className="text-yellow-600 text-xs">
                      {t({ en: 'Member-only discounts', fr: 'Réductions réservées aux membres' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.open('/client/login', '_blank')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    {t({ en: 'Create Free Account', fr: 'Créer un Compte Gratuit' })}
                  </span>
                </button>
                
                <p className="text-sm text-gray-500">
                  {t({ 
                    en: 'Already have an account? Sign in to auto-fill below', 
                    fr: 'Déjà un compte ? Connectez-vous pour pré-remplir ci-dessous' 
                  })}
                </p>
              </div>
              
              <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
                <span>🔒</span>
                <span>
                  {t({ 
                    en: '100% secure • No spam • Cancel anytime', 
                    fr: '100% sécurisé • Pas de spam • Annulation libre' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 bg-white">
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

            {(!checkIn || !checkOut || !((season === 'high' ? nights >= 7 : nights >= 3))) && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6 text-yellow-800">
                <p className="font-semibold mb-2">
                  {t({ en: 'Complete these steps to submit your booking:', fr: 'Complétez ces étapes pour soumettre votre réservation :' })}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {!checkIn && <li>{t({ en: 'Select a check-in date', fr: 'Sélectionnez une date d\'arrivée' })}</li>}
                  {!checkOut && <li>{t({ en: 'Select a check-out date', fr: 'Sélectionnez une date de départ' })}</li>}
                  {checkIn && checkOut && nights > 0 && !((season === 'high' ? nights >= 7 : nights >= 3)) && (
                    <li>
                      {season === 'high' 
                        ? t({ en: `Minimum stay is 7 nights in high season (currently: ${nights} nights)`, fr: `Séjour minimum de 7 nuits en haute saison (actuellement : ${nights} nuits)` })
                        : t({ en: `Minimum stay is 3 nights (currently: ${nights} nights)`, fr: `Séjour minimum de 3 nuits (actuellement : ${nights} nuits)` })
                      }
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={!checkIn || !checkOut || !((season === 'high' ? nights >= 7 : nights >= 3)) || isSubmitting}
                className={`w-full px-8 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg border-2 transform hover:scale-[1.02] ${
                  !checkIn || !checkOut || !((season === 'high' ? nights >= 7 : nights >= 3)) || isSubmitting
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed border-gray-500 opacity-75'
                    : 'bg-gray-800 hover:bg-gray-900 text-white border-gray-900 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin text-2xl">⏳</span>
                      <span>{t({ en: 'Sending...', fr: 'Envoi en cours...' })}</span>
                    </>
                  ) : (!checkIn || !checkOut || !((season === 'high' ? nights >= 7 : nights >= 3))) ? (
                    <>
                      <span className="text-2xl animate-bounce">⚠️</span>
                      <span className="text-lg">
                        {t({ 
                          en: season === 'high' ? 'Complete dates above (minimum 7 nights)' : 'Complete dates above (minimum 3 nights)', 
                          fr: season === 'high' ? 'Complétez les dates ci-dessus (minimum 7 nuits)' : 'Complétez les dates ci-dessus (minimum 3 nuits)' 
                        })}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl animate-pulse">✅</span>
                      <span>{t({ en: 'Submit Booking Request', fr: 'Envoyer la Demande de Réservation' })}</span>
                      <span className="text-2xl animate-bounce">🏔️</span>
                    </>
                  )}
                </div>
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
      <section className="py-12 bg-cream">
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
              <p className="text-gray-700 text-sm mb-2">{t({ en: '30% deposit at booking', fr: 'Acompte de 30% à la réservation' })}</p>
              <p className="text-gray-700 text-sm mb-3">{t({ en: 'Balance due 30 days before arrival', fr: 'Solde 30 jours avant l\'arrivée' })}</p>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  {t({ en: 'Payment Methods:', fr: 'Moyens de paiement :' })}
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">💎</span>
                    <span>{t({ en: 'Secure online payment via Stripe', fr: 'Paiement en ligne sécurisé via Stripe' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🏦</span>
                    <span>{t({ en: 'Bank transfer (contact us for details)', fr: 'Virement bancaire (nous contacter pour les détails)' })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg text-forest-800 mb-3">🔒 {t({ en: 'Security Deposit', fr: 'Caution' })}</h3>
              <p className="text-gray-700 text-sm">{t({ en: '€1,500 refundable deposit', fr: 'Caution remboursable de 1 500€' })}</p>
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
