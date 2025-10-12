'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { formatEuro } from '@/lib/utils';
import { Reservation } from '@/types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  fromName: string;
  isFromAdmin: boolean;
  read: boolean;
  replyTo?: string;
  createdAt: string;
}

export default function ClientDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'messages'>('overview');
  const [loading, setLoading] = useState(true);

  // Message form state
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', content: '', replyTo: '' });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Récupérer l'utilisateur
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/client/login');
        return;
      }
      const userData = await userRes.json();
      setUser(userData);

      // Récupérer les réservations
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const allReservations = await resRes.json();
        // Filtrer les réservations de l'utilisateur
        const userReservations = allReservations.filter(
          (r: Reservation) => r.email === userData.email
        );
        setReservations(userReservations);
      }

      // Récupérer les messages
      const msgRes = await fetch('/api/messages');
      if (msgRes.ok) {
        const messagesData = await msgRes.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMessage(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageForm),
      });

      if (response.ok) {
        alert(t({ en: 'Message sent!', fr: 'Message envoyé !' }));
        setMessageForm({ subject: '', content: '', replyTo: '' });
        setShowMessageForm(false);
        fetchUserData(); // Recharger les messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t({ en: 'Error sending message', fr: 'Erreur lors de l\'envoi du message' }));
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-700"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingReservations = reservations.filter(r =>
    new Date(r.checkIn) > new Date() && r.status !== 'cancelled'
  );
  const pastReservations = reservations.filter(r =>
    new Date(r.checkIn) <= new Date() || r.status === 'cancelled'
  );
  const unreadMessages = messages.filter(m => !m.read && m.isFromAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-700 to-forest-800 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t({ en: 'Welcome back,', fr: 'Bon retour,' })} {user.firstName}!
              </h1>
              <p className="text-forest-100">
                {t({ en: 'Manage your reservations and messages', fr: 'Gérez vos réservations et messages' })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                {t({ en: 'Home', fr: 'Accueil' })}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                {t({ en: 'Logout', fr: 'Déconnexion' })}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-forest-700">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📅</div>
              <div>
                <div className="text-3xl font-bold text-forest-900">{upcomingReservations.length}</div>
                <div className="text-gray-600">{t({ en: 'Upcoming Bookings', fr: 'Réservations à Venir' })}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="text-4xl">✉️</div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{unreadMessages.length}</div>
                <div className="text-gray-600">{t({ en: 'Unread Messages', fr: 'Messages Non Lus' })}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold-500">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <div className="text-3xl font-bold text-gold-600">{reservations.length}</div>
                <div className="text-gray-600">{t({ en: 'Total Bookings', fr: 'Total Réservations' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-forest-700 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Overview', fr: 'Aperçu' })}
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'reservations'
                ? 'bg-forest-700 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Reservations', fr: 'Réservations' })} ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all relative ${
              activeTab === 'messages'
                ? 'bg-forest-700 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Messages', fr: 'Messages' })} ({messages.length})
            {unreadMessages.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Upcoming Reservations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-forest-900 mb-6">
                {t({ en: 'Upcoming Reservations', fr: 'Prochaines Réservations' })}
              </h2>
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600 mb-6">
                    {t({ en: 'No upcoming reservations', fr: 'Aucune réservation à venir' })}
                  </p>
                  <Link
                    href="/booking"
                    className="inline-block bg-forest-700 hover:bg-forest-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {t({ en: 'Book Now', fr: 'Réserver Maintenant' })}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.slice(0, 3).map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:border-forest-700 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              reservation.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">{t({ en: 'Check-in:', fr: 'Arrivée :' })}</span>
                              <div className="font-semibold text-forest-900">
                                {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">{t({ en: 'Check-out:', fr: 'Départ :' })}</span>
                              <div className="font-semibold text-forest-900">
                                {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">
                            {reservation.guests} {t({ en: 'guests', fr: 'personnes' })}
                          </div>
                          <div className="text-2xl font-bold text-forest-900">
                            {formatEuro(reservation.totalPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-forest-900">
                  {t({ en: 'Recent Messages', fr: 'Messages Récents' })}
                </h2>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-forest-700 hover:text-forest-900 font-semibold"
                >
                  {t({ en: 'View All', fr: 'Voir Tout' })} →
                </button>
              </div>
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✉️</div>
                  <p className="text-gray-600">
                    {t({ en: 'No messages yet', fr: 'Aucun message pour le moment' })}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className={`border-2 rounded-lg p-4 ${
                        !message.read && message.isFromAdmin
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {message.isFromAdmin ? '🏔️' : '👤'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-forest-900">
                              {message.isFromAdmin ? 'chalet-cozy-balmotte.com' : message.fromName}
                            </span>
                            {!message.read && message.isFromAdmin && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                {t({ en: 'NEW', fr: 'NOUVEAU' })}
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-gray-900 mb-1">{message.subject}</div>
                          <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(message.createdAt).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-forest-900">
                {t({ en: 'All Reservations', fr: 'Toutes les Réservations' })}
              </h2>
              <Link
                href="/booking"
                className="bg-forest-700 hover:bg-forest-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                + {t({ en: 'New Booking', fr: 'Nouvelle Réservation' })}
              </Link>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-600 text-lg mb-6">
                  {t({ en: 'No reservations yet', fr: 'Aucune réservation pour le moment' })}
                </p>
                <Link
                  href="/booking"
                  className="inline-block bg-forest-700 hover:bg-forest-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t({ en: 'Book Now', fr: 'Réserver Maintenant' })}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-forest-800 text-lg mb-3">
                  {t({ en: 'Upcoming', fr: 'À Venir' })}
                </h3>
                {upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-forest-700 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                            reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {t({ en: 'Booked on', fr: 'Réservé le' })}{' '}
                            {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-forest-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">
                              {t({ en: 'Check-in', fr: 'Arrivée' })}
                            </div>
                            <div className="font-bold text-forest-900">
                              {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="bg-forest-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">
                              {t({ en: 'Check-out', fr: 'Départ' })}
                            </div>
                            <div className="font-bold text-forest-900">
                              {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="bg-forest-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">
                              {t({ en: 'Guests', fr: 'Personnes' })}
                            </div>
                            <div className="font-bold text-forest-900">{reservation.guests}</div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:text-right border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">
                        <div className="text-sm text-gray-600 mb-2">
                          {t({ en: 'Total Price', fr: 'Prix Total' })}
                        </div>
                        <div className="text-3xl font-bold text-forest-900 mb-4">
                          {formatEuro(reservation.totalPrice)}
                        </div>
                        <button
                          onClick={() => {
                            setMessageForm({
                              subject: `Question about reservation ${reservation.id}`,
                              content: '',
                              replyTo: ''
                            });
                            setShowMessageForm(true);
                            setActiveTab('messages');
                          }}
                          className="w-full lg:w-auto bg-forest-700 hover:bg-forest-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
                        >
                          {t({ en: 'Contact Us', fr: 'Nous Contacter' })}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {pastReservations.length > 0 && (
                  <>
                    <h3 className="font-bold text-gray-700 text-lg mt-8 mb-3">
                      {t({ en: 'Past Reservations', fr: 'Réservations Passées' })}
                    </h3>
                    {pastReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border-2 border-gray-200 rounded-xl p-6 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                reservation.status === 'confirmed'
                                  ? 'bg-gray-200 text-gray-700'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {reservation.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-gray-600">{t({ en: 'Check-in', fr: 'Arrivée' })}</div>
                                <div className="font-semibold">
                                  {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">{t({ en: 'Check-out', fr: 'Départ' })}</div>
                                <div className="font-semibold">
                                  {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">{t({ en: 'Total', fr: 'Total' })}</div>
                                <div className="font-semibold">{formatEuro(reservation.totalPrice)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-forest-900">
                {t({ en: 'Messages', fr: 'Messages' })}
              </h2>
              <button
                onClick={() => {
                  setShowMessageForm(!showMessageForm);
                  if (!showMessageForm) {
                    setMessageForm({ subject: '', content: '', replyTo: '' });
                  }
                }}
                className="bg-forest-700 hover:bg-forest-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {showMessageForm
                  ? t({ en: 'Cancel', fr: 'Annuler' })
                  : `+ ${t({ en: 'New Message', fr: 'Nouveau Message' })}`}
              </button>
            </div>

            {showMessageForm && (
              <form onSubmit={handleSendMessage} className="bg-forest-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-forest-900 mb-4">
                  {t({ en: 'Send a Message', fr: 'Envoyer un Message' })}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t({ en: 'Subject', fr: 'Sujet' })} *
                    </label>
                    <input
                      type="text"
                      required
                      value={messageForm.subject}
                      onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t({ en: 'Message', fr: 'Message' })} *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={messageForm.content}
                      onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="w-full bg-forest-700 hover:bg-forest-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {sendingMessage
                      ? t({ en: 'Sending...', fr: 'Envoi...' })
                      : t({ en: 'Send Message', fr: 'Envoyer le Message' })}
                  </button>
                </div>
              </form>
            )}

            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✉️</div>
                <p className="text-gray-600 text-lg mb-2">
                  {t({ en: 'No messages yet', fr: 'Aucun message pour le moment' })}
                </p>
                <p className="text-gray-500 text-sm">
                  {t({
                    en: 'Start a conversation with us!',
                    fr: 'Commencez une conversation avec nous !'
                  })}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border-2 rounded-xl p-6 ${
                      !message.read && message.isFromAdmin
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">
                        {message.isFromAdmin ? '🏔️' : '👤'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-forest-900 text-lg">
                              {message.isFromAdmin ? 'chalet-cozy-balmotte.com' : message.fromName}
                            </span>
                            {!message.read && message.isFromAdmin && (
                              <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                                {t({ en: 'NEW', fr: 'NOUVEAU' })}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-3">{message.subject}</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        {!message.isFromAdmin && (
                          <button
                            onClick={() => {
                              setMessageForm({
                                subject: `Re: ${message.subject}`,
                                content: '',
                                replyTo: message.id
                              });
                              setShowMessageForm(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="mt-4 text-forest-700 hover:text-forest-900 font-semibold text-sm"
                          >
                            ↩️ {t({ en: 'Reply', fr: 'Répondre' })}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
