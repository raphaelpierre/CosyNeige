'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';
import { formatEuro } from '@/lib/utils';
import { Reservation } from '@/types';
import InvoiceGenerator from '@/components/invoice/InvoiceGenerator';

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
  archived: boolean;
  replyTo?: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  totalAmount: number;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'cancelled';
  type: 'deposit' | 'balance' | 'full';
  createdAt: string;
  reservationId?: string;
}

function ClientDashboardContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'messages' | 'invoices'>('overview');
  const [dataLoading, setDataLoading] = useState(true);

  // Message form state
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', content: '', replyTo: '' });
  const [sendingMessage, setSendingMessage] = useState(false);

  // Message editing state
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editMessageForm, setEditMessageForm] = useState({ subject: '', content: '' });
  const [isUpdatingMessage, setIsUpdatingMessage] = useState(false);

  // Message deletion state
  const [deletingMessage, setDeletingMessage] = useState<string | null>(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);

  // Archive filter
  const [showArchivedMessages, setShowArchivedMessages] = useState(false);

  // Reservation editing state
  const [editingReservation, setEditingReservation] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    message: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Invoice generation state
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Gérer les paramètres d'URL pour les onglets
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'reservations', 'messages', 'invoices'].includes(tab)) {
      setActiveTab(tab as 'overview' | 'reservations' | 'messages' | 'invoices');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    } else if (!authLoading && isAuthenticated && user) {
      fetchUserData();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Récupérer les réservations
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const allReservations = await resRes.json();
        // Filtrer les réservations de l'utilisateur
        const userReservations = allReservations.filter(
          (r: Reservation) => r.email === user.email
        );
        setReservations(userReservations);
      }

      // Récupérer les messages
      const msgRes = await fetch('/api/messages');
      if (msgRes.ok) {
        const messagesData = await msgRes.json();
        setMessages(messagesData);
      }

      // Récupérer les factures
      const invRes = await fetch('/api/invoices');
      if (invRes.ok) {
        const allInvoices = await invRes.json();
        // Filtrer les factures de l'utilisateur
        const userInvoices = allInvoices.filter(
          (inv: Invoice) => inv.clientEmail === user.email
        );
        setInvoices(userInvoices);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
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

  const startEditMessage = (message: Message) => {
    setEditingMessage(message.id);
    setEditMessageForm({
      subject: message.subject,
      content: message.content
    });
  };

  const cancelEditMessage = () => {
    setEditingMessage(null);
    setEditMessageForm({ subject: '', content: '' });
  };

  const handleUpdateMessage = async (messageId: string) => {
    setIsUpdatingMessage(true);

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMessageForm),
      });

      if (response.ok) {
        alert(t({
          en: 'Message updated successfully!',
          fr: 'Message modifié avec succès !'
        }));
        setEditingMessage(null);
        fetchUserData(); // Recharger les messages
      } else {
        throw new Error('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert(t({
        en: 'Error updating message. Please try again.',
        fr: 'Erreur lors de la modification. Veuillez réessayer.'
      }));
    } finally {
      setIsUpdatingMessage(false);
    }
  };

  const handleArchiveMessage = async (messageId: string, archived: boolean) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived }),
      });

      if (response.ok) {
        fetchUserData(); // Recharger les messages
      } else {
        throw new Error('Failed to archive message');
      }
    } catch (error) {
      console.error('Error archiving message:', error);
      alert(t({
        en: 'Error archiving message. Please try again.',
        fr: 'Erreur lors de l\'archivage. Veuillez réessayer.'
      }));
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsDeletingMessage(true);

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(t({
          en: 'Message deleted successfully!',
          fr: 'Message supprimé avec succès !'
        }));
        setDeletingMessage(null);
        fetchUserData(); // Recharger les messages
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(t({
        en: 'Error deleting message. Please try again.',
        fr: 'Erreur lors de la suppression. Veuillez réessayer.'
      }));
    } finally {
      setIsDeletingMessage(false);
    }
  };

  const startEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation.id);
    setEditForm({
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guests: reservation.guests,
      message: reservation.message || ''
    });
  };

  const cancelEdit = () => {
    setEditingReservation(null);
    setEditForm({ checkIn: '', checkOut: '', guests: 2, message: '' });
  };

  const handleUpdateReservation = async (reservationId: string) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert(t({ 
          en: 'Reservation updated successfully!', 
          fr: 'Réservation modifiée avec succès !' 
        }));
        setEditingReservation(null);
        fetchUserData(); // Recharger les données
      } else {
        throw new Error('Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert(t({ 
        en: 'Error updating reservation. Please try again.', 
        fr: 'Erreur lors de la modification. Veuillez réessayer.' 
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  const canEditReservation = (reservation: Reservation) => {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  };

  const handleGenerateInvoice = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowInvoiceGenerator(true);
  };

  const canGenerateInvoice = (reservation: Reservation) => {
    return reservation.status === 'confirmed' || reservation.paymentStatus === 'deposit_paid' || reservation.paymentStatus === 'fully_paid';
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">{t({ en: 'Loading...', fr: 'Chargement...' })}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Le useEffect redirigera vers la page de login
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header épuré et élégant */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg border-2 border-white/30">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  {t({ en: 'Welcome back,', fr: 'Bon retour,' })} {user.firstName}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  {t({ en: 'Manage your stays at Chalet-Balmotte810', fr: 'Gérez vos séjours au Chalet-Balmotte810' })}
                </p>
              </div>
            </div>

            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="text-xl">📅</span>
              <span>{t({ en: 'New Booking', fr: 'Nouvelle Réservation' })}</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab('reservations')}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all text-center group cursor-pointer"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📅</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{upcomingReservations.length}</div>
            <div className="text-xs text-gray-600">{t({ en: 'Upcoming', fr: 'À Venir' })}</div>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all text-center group cursor-pointer relative"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✉️</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{unreadMessages.length}</div>
            <div className="text-xs text-gray-600">{t({ en: 'Unread', fr: 'Non Lus' })}</div>
            {unreadMessages.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{reservations.length}</div>
            <div className="text-xs text-gray-600">{t({ en: 'Total', fr: 'Total' })}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow p-2 mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Overview', fr: 'Aperçu' })}
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-slate-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Bookings', fr: 'Réservations' })}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'bg-slate-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Invoices', fr: 'Factures' })}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-slate-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t({ en: 'Messages', fr: 'Messages' })}
            {unreadMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {t({ en: 'Upcoming Reservations', fr: 'Prochaines Réservations' })}
              </h2>
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📅</div>
                  <p className="text-gray-500 text-sm">
                    {t({ en: 'No upcoming reservations', fr: 'Aucune réservation à venir' })}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReservations.slice(0, 3).map((reservation) => (
                    <div
                      key={reservation.id}
                      className="bg-gradient-to-r from-white to-slate-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-3xl">🏔️</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                reservation.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {reservation.status === 'confirmed' ? '✓' : '⏳'} {reservation.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              })} → {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })} • {reservation.guests} {t({ en: 'guests', fr: 'pers.' })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-slate-900">
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
                <h2 className="text-2xl font-bold text-slate-900">
                  {t({ en: 'Recent Messages', fr: 'Messages Récents' })}
                </h2>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-slate-800 hover:text-slate-900 font-semibold"
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
                            <span className="font-semibold text-slate-900">
                              {message.isFromAdmin ? 'Chalet-Balmotte810' : message.fromName}
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {t({ en: 'All Reservations', fr: 'Toutes les Réservations' })}
            </h2>

            {reservations.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">📅</div>
                <p className="text-gray-500 mb-2">
                  {t({ en: 'No reservations yet', fr: 'Aucune réservation pour le moment' })}
                </p>
                <p className="text-gray-400 text-sm">
                  {t({ en: 'Use the button above to make your first booking', fr: 'Utilisez le bouton ci-dessus pour faire votre première réservation' })}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg mb-3">
                  {t({ en: 'Upcoming', fr: 'À Venir' })}
                </h3>
                {upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      editingReservation === reservation.id 
                        ? 'border-gold-300 bg-gold-50 shadow-xl' 
                        : 'border-gray-200 hover:border-slate-700 hover:shadow-lg'
                    }`}
                  >
                    {editingReservation === reservation.id ? (
                      // Mode édition
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gold-800">
                            📝 {t({ en: 'Edit Reservation', fr: 'Modifier la Réservation' })}
                          </h3>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t({ en: 'Check-in', fr: 'Arrivée' })}
                            </label>
                            <input
                              type="date"
                              value={editForm.checkIn}
                              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t({ en: 'Check-out', fr: 'Départ' })}
                            </label>
                            <input
                              type="date"
                              value={editForm.checkOut}
                              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t({ en: 'Guests', fr: 'Personnes' })}
                            </label>
                            <select
                              value={editForm.guests}
                              onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t({ en: 'Message', fr: 'Message' })}
                          </label>
                          <textarea
                            rows={3}
                            value={editForm.message}
                            onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                            placeholder={t({ en: 'Additional requests...', fr: 'Demandes supplémentaires...' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdateReservation(reservation.id)}
                            disabled={isUpdating}
                            className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                          >
                            {isUpdating 
                              ? t({ en: 'Updating...', fr: 'Modification...' })
                              : t({ en: '✅ Save Changes', fr: '✅ Sauvegarder' })
                            }
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                          >
                            {t({ en: 'Cancel', fr: 'Annuler' })}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                              reservation.status === 'confirmed'
                                ? 'bg-green-100 text-slate-800'
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
                            {canEditReservation(reservation) && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {t({ en: 'Editable', fr: 'Modifiable' })}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="text-xs text-gray-600 mb-1">
                                {t({ en: 'Check-in', fr: 'Arrivée' })}
                              </div>
                              <div className="font-bold text-slate-900">
                                {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="text-xs text-gray-600 mb-1">
                                {t({ en: 'Check-out', fr: 'Départ' })}
                              </div>
                              <div className="font-bold text-slate-900">
                                {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="text-xs text-gray-600 mb-1">
                                {t({ en: 'Guests', fr: 'Personnes' })}
                              </div>
                              <div className="font-bold text-slate-900">{reservation.guests}</div>
                            </div>
                          </div>
                        </div>
                        <div className="lg:text-right border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">
                          <div className="text-sm text-gray-600 mb-2">
                            {t({ en: 'Total Price', fr: 'Prix Total' })}
                          </div>
                          <div className="text-3xl font-bold text-slate-900 mb-4">
                            {formatEuro(reservation.totalPrice)}
                          </div>
                          
                          <div className="space-y-2">
                            {canEditReservation(reservation) && (
                              <button
                                onClick={() => startEditReservation(reservation)}
                                className="w-full lg:w-auto bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base mb-2 touch-manipulation active:scale-98"
                              >
                                📝 {t({ en: 'Edit', fr: 'Modifier' })}
                              </button>
                            )}
                            {canGenerateInvoice(reservation) && (
                              <button
                                onClick={() => handleGenerateInvoice(reservation)}
                                className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base mb-2 touch-manipulation active:scale-98"
                              >
                                📄 {t({ en: 'Generate Invoice', fr: 'Générer Facture' })}
                              </button>
                            )}
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
                              className="w-full lg:w-auto bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base touch-manipulation active:scale-98"
                            >
                              {t({ en: 'Contact Us', fr: 'Nous Contacter' })}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
              <h2 className="text-2xl font-bold text-slate-900">
                {t({ en: 'Messages', fr: 'Messages' })}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowArchivedMessages(!showArchivedMessages)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  {showArchivedMessages
                    ? t({ en: 'Hide Archived', fr: 'Masquer Archivés' })
                    : t({ en: 'Show Archived', fr: 'Afficher Archivés' })}
                </button>
                <button
                  onClick={() => {
                    setShowMessageForm(!showMessageForm);
                    if (!showMessageForm) {
                      setMessageForm({ subject: '', content: '', replyTo: '' });
                    }
                  }}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {showMessageForm
                    ? t({ en: 'Cancel', fr: 'Annuler' })
                    : `+ ${t({ en: 'New Message', fr: 'Nouveau Message' })}`}
                </button>
              </div>
            </div>

            {showMessageForm && (
              <form onSubmit={handleSendMessage} className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
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
                {messages
                  .filter(msg => showArchivedMessages ? true : !msg.archived)
                  .map((message) => (
                  <div
                    key={message.id}
                    className={`border-2 rounded-xl p-6 ${
                      editingMessage === message.id
                        ? 'border-gold-300 bg-gold-50 shadow-xl'
                        : !message.read && message.isFromAdmin
                        ? 'border-blue-300 bg-blue-50'
                        : message.archived
                        ? 'border-gray-300 bg-gray-100 opacity-75'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {editingMessage === message.id ? (
                      // Mode édition
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gold-800">
                            ✏️ {t({ en: 'Edit Message', fr: 'Modifier le Message' })}
                          </h3>
                          <button
                            onClick={cancelEditMessage}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                          >
                            ✕
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t({ en: 'Subject', fr: 'Sujet' })}
                          </label>
                          <input
                            type="text"
                            value={editMessageForm.subject}
                            onChange={(e) => setEditMessageForm({ ...editMessageForm, subject: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t({ en: 'Content', fr: 'Contenu' })}
                          </label>
                          <textarea
                            rows={6}
                            value={editMessageForm.content}
                            onChange={(e) => setEditMessageForm({ ...editMessageForm, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdateMessage(message.id)}
                            disabled={isUpdatingMessage}
                            className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                          >
                            {isUpdatingMessage
                              ? t({ en: 'Updating...', fr: 'Modification...' })
                              : t({ en: '✅ Save Changes', fr: '✅ Sauvegarder' })
                            }
                          </button>
                          <button
                            onClick={cancelEditMessage}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                          >
                            {t({ en: 'Cancel', fr: 'Annuler' })}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">
                          {message.isFromAdmin ? '🏔️' : '👤'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-900 text-lg">
                                {message.isFromAdmin ? 'Chalet-Balmotte810' : message.fromName}
                              </span>
                              {!message.read && message.isFromAdmin && (
                                <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                                  {t({ en: 'NEW', fr: 'NOUVEAU' })}
                                </span>
                              )}
                              {message.archived && (
                                <span className="px-3 py-1 bg-gray-400 text-white text-xs rounded-full font-semibold">
                                  {t({ en: 'ARCHIVED', fr: 'ARCHIVÉ' })}
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

                          {/* Action buttons for user's own messages */}
                          {!message.isFromAdmin && (
                            <div className="mt-4 flex flex-wrap gap-2">
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
                                className="text-slate-800 hover:text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-lg border-2 border-slate-800 hover:bg-slate-50 transition-colors touch-manipulation active:scale-95"
                              >
                                ↩️ {t({ en: 'Reply', fr: 'Répondre' })}
                              </button>
                              <button
                                onClick={() => startEditMessage(message)}
                                className="text-gold-700 hover:text-gold-900 font-semibold text-sm px-4 py-2.5 rounded-lg border-2 border-gold-700 hover:bg-gold-50 transition-colors touch-manipulation active:scale-95"
                              >
                                ✏️ {t({ en: 'Edit', fr: 'Modifier' })}
                              </button>
                              <button
                                onClick={() => handleArchiveMessage(message.id, !message.archived)}
                                className="text-gray-700 hover:text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-lg border-2 border-gray-700 hover:bg-gray-50 transition-colors touch-manipulation active:scale-95"
                              >
                                {message.archived
                                  ? `📂 ${t({ en: 'Unarchive', fr: 'Désarchiver' })}`
                                  : `📦 ${t({ en: 'Archive', fr: 'Archiver' })}`
                                }
                              </button>
                              <button
                                onClick={() => setDeletingMessage(message.id)}
                                className="text-red-700 hover:text-red-900 font-semibold text-sm px-4 py-2.5 rounded-lg border-2 border-red-700 hover:bg-red-50 transition-colors touch-manipulation active:scale-95"
                              >
                                🗑️ {t({ en: 'Delete', fr: 'Supprimer' })}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Delete confirmation modal */}
                    {deletingMessage === message.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {t({ en: 'Delete Message?', fr: 'Supprimer le Message ?' })}
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {t({
                              en: 'Are you sure you want to delete this message? This action cannot be undone.',
                              fr: 'Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.'
                            })}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              disabled={isDeletingMessage}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                            >
                              {isDeletingMessage
                                ? t({ en: 'Deleting...', fr: 'Suppression...' })
                                : t({ en: 'Delete', fr: 'Supprimer' })
                              }
                            </button>
                            <button
                              onClick={() => setDeletingMessage(null)}
                              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                              {t({ en: 'Cancel', fr: 'Annuler' })}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {t({ en: 'My Invoices', fr: 'Mes Factures' })}
            </h2>

            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">📄</div>
                <p className="text-gray-500 mb-2">
                  {t({ en: 'No invoices yet', fr: 'Aucune facture pour le moment' })}
                </p>
                <p className="text-gray-400 text-sm">
                  {t({ en: 'Invoices will appear here once generated', fr: 'Les factures apparaîtront ici une fois générées' })}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-slate-700 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'sent'
                              ? 'bg-blue-100 text-blue-700'
                              : invoice.status === 'partial'
                              ? 'bg-yellow-100 text-yellow-700'
                              : invoice.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {invoice.status === 'paid'
                              ? t({ en: 'PAID', fr: 'PAYÉE' })
                              : invoice.status === 'sent'
                              ? t({ en: 'SENT', fr: 'ENVOYÉE' })
                              : invoice.status === 'partial'
                              ? t({ en: 'PARTIAL', fr: 'PARTIELLE' })
                              : invoice.status === 'cancelled'
                              ? t({ en: 'CANCELLED', fr: 'ANNULÉE' })
                              : t({ en: 'DRAFT', fr: 'BROUILLON' })
                            }
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.type === 'deposit'
                              ? 'bg-purple-100 text-purple-700'
                              : invoice.type === 'balance'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {invoice.type === 'deposit'
                              ? t({ en: 'Deposit', fr: 'Acompte' })
                              : invoice.type === 'balance'
                              ? t({ en: 'Balance', fr: 'Solde' })
                              : t({ en: 'Full Payment', fr: 'Paiement complet' })
                            }
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">
                              {t({ en: 'Invoice Number', fr: 'Numéro de Facture' })}
                            </div>
                            <div className="font-bold text-gray-900">
                              {invoice.invoiceNumber}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">
                              {t({ en: 'Issue Date', fr: 'Date d\'émission' })}
                            </div>
                            <div className="font-bold text-gray-900">
                              {new Date(invoice.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:text-right border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">
                        <div className="text-sm text-gray-600 mb-2">
                          {t({ en: 'Amount', fr: 'Montant' })}
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-4">
                          {formatEuro(invoice.totalAmount)}
                        </div>
                        <button
                          onClick={() => {
                            // Find the reservation for this invoice
                            const reservation = reservations.find(r => r.id === invoice.reservationId);
                            if (reservation) {
                              handleGenerateInvoice(reservation);
                            }
                          }}
                          className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base touch-manipulation active:scale-98"
                        >
                          📄 {t({ en: 'Download PDF', fr: 'Télécharger PDF' })}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Générateur de facture */}
      {showInvoiceGenerator && selectedReservation && (
        <InvoiceGenerator
          reservation={selectedReservation}
          onClose={() => {
            setShowInvoiceGenerator(false);
            setSelectedReservation(null);
          }}
        />
      )}
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    }>
      <ClientDashboardContent />
    </Suspense>
  );
}
