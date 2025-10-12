'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { Reservation, Message } from '@/types';

type TabType = 'reservations' | 'calendar' | 'messages' | 'settings';

export default function AdminPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('reservations');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Données des réservations depuis l'API
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Charger les réservations
  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (response.ok) {
        const data = await response.json();
        // Convertir les dates ISO en format YYYY-MM-DD
        const formattedData = data.map((res: {
          id: string;
          checkIn: string;
          checkOut: string;
          createdAt: string;
          [key: string]: unknown;
        }) => ({
          ...res,
          checkIn: res.checkIn.split('T')[0],
          checkOut: res.checkOut.split('T')[0],
          createdAt: res.createdAt.split('T')[0]
        }));
        setReservations(formattedData);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const [messages] = useState<Message[]>([
    {
      id: '1',
      subject: 'Question sur les équipements',
      content: 'Bonjour, je voudrais savoir si le chalet dispose d\'un lave-vaisselle et d\'une machine à laver?',
      fromUserId: undefined,
      fromEmail: 'sophie.laurent@email.com',
      fromName: 'Sophie Laurent',
      isFromAdmin: false,
      read: false,
      createdAt: '2025-01-18',
      // Legacy fields for compatibility
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      message: 'Bonjour, je voudrais savoir si le chalet dispose d\'un lave-vaisselle et d\'une machine à laver?',
      date: '2025-01-18'
    },
    {
      id: '2',
      subject: 'Disponibilité en août',
      content: 'Salut, auriez-vous des disponibilités du 15 au 22 août pour 6 personnes?',
      fromUserId: undefined,
      fromEmail: 'thomas.bernard@email.com',
      fromName: 'Thomas Bernard',
      isFromAdmin: false,
      read: true,
      createdAt: '2025-01-16',
      // Legacy fields for compatibility
      name: 'Thomas Bernard',
      email: 'thomas.bernard@email.com',
      message: 'Salut, auriez-vous des disponibilités du 15 au 22 août pour 6 personnes?',
      date: '2025-01-16'
    }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple démo - en production, utiliser une vraie authentification
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  // Fonction pour générer les jours du calendrier avec les réservations
  const generateCalendarDays = (date: Date, bookings: Reservation[]) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{
      date: Date | null;
      bookings: Array<Reservation & { isStart: boolean }>;
    }> = [];

    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: prevDate,
        bookings: getBookingsForDate(prevDate, bookings)
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({
        date: currentDate,
        bookings: getBookingsForDate(currentDate, bookings)
      });
    }

    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        bookings: getBookingsForDate(nextDate, bookings)
      });
    }

    return days;
  };

  // Fonction pour obtenir les réservations d'une date donnée
  const getBookingsForDate = (date: Date, bookings: Reservation[]): Array<Reservation & { isStart: boolean }> => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings
      .filter(booking => {
        const checkIn = booking.checkIn;
        const checkOut = booking.checkOut;
        return dateStr >= checkIn && dateStr <= checkOut;
      })
      .map(booking => ({
        ...booking,
        isStart: dateStr === booking.checkIn
      }));
  };

  // Fonction pour changer le statut d'une réservation
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchReservations(); // Recharger les données
        alert(t({
          en: 'Status updated successfully!',
          fr: 'Statut mis à jour avec succès !'
        }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(t({
        en: 'Failed to update status',
        fr: 'Échec de la mise à jour du statut'
      }));
    }
  };

  // Fonction pour supprimer une réservation
  const handleDeleteReservation = async (id: string) => {
    if (!confirm(t({
      en: 'Are you sure you want to delete this reservation?',
      fr: 'Êtes-vous sûr de vouloir supprimer cette réservation ?'
    }))) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchReservations(); // Recharger les données
        alert(t({
          en: 'Reservation deleted successfully!',
          fr: 'Réservation supprimée avec succès !'
        }));
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert(t({
        en: 'Failed to delete reservation',
        fr: 'Échec de la suppression'
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-100 to-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-forest-900 mb-2">
              {t({ en: 'Admin Access', fr: 'Accès Administrateur' })}
            </h1>
            <p className="text-gray-600">
              {t({ en: 'Please enter your password', fr: 'Veuillez entrer votre mot de passe' })}
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Password', fr: 'Mot de passe' })}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                {t({ en: 'Demo: use "admin123"', fr: 'Démo: utiliser "admin123"' })}
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-forest-700 hover:bg-forest-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {t({ en: 'Login', fr: 'Se connecter' })}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'reservations' as TabType, icon: '📅', label: { en: 'Reservations', fr: 'Réservations' } },
    { id: 'calendar' as TabType, icon: '🗓️', label: { en: 'Calendar', fr: 'Calendrier' } },
    { id: 'messages' as TabType, icon: '💬', label: { en: 'Messages', fr: 'Messages' } },
    { id: 'settings' as TabType, icon: '⚙️', label: { en: 'Settings', fr: 'Paramètres' } }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return t({ en: 'Confirmed', fr: 'Confirmée' });
      case 'pending': return t({ en: 'Pending', fr: 'En attente' });
      case 'cancelled': return t({ en: 'Cancelled', fr: 'Annulée' });
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-forest-900">
                {t({ en: 'Admin Dashboard', fr: 'Tableau de Bord Admin' })}
              </h1>
              <p className="text-sm text-gray-600 mt-1">CosyNeige Management</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span className="font-medium">{t({ en: 'Logout', fr: 'Déconnexion' })}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t({ en: 'Total Reservations', fr: 'Réservations Totales' })}</p>
                <p className="text-3xl font-bold text-forest-900 mt-2">{reservations.length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t({ en: 'Pending', fr: 'En Attente' })}</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t({ en: 'Confirmed', fr: 'Confirmées' })}</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t({ en: 'Unread Messages', fr: 'Messages Non Lus' })}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {messages.filter(m => !m.read).length}
                </p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-forest-700 text-forest-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{t(tab.label)}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'reservations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {t({ en: 'Reservation Management', fr: 'Gestion des Réservations' })}
                  </h2>
                  <button className="bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-lg transition-colors">
                    {t({ en: 'Add Reservation', fr: 'Ajouter une Réservation' })}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Guest', fr: 'Client' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Contact', fr: 'Contact' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Dates', fr: 'Dates' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Guests', fr: 'Personnes' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Price', fr: 'Prix' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Status', fr: 'Statut' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Actions', fr: 'Actions' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(reservation => (
                        <tr key={reservation.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{reservation.guestName}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">{reservation.email}</div>
                            <div className="text-sm text-gray-600">{reservation.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div>{new Date(reservation.checkIn).toLocaleDateString('fr-FR')}</div>
                              <div className="text-gray-600">→ {new Date(reservation.checkOut).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{reservation.guests}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-forest-900">{reservation.totalPrice}€</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                              {getStatusLabel(reservation.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 items-center">
                              {reservation.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-800 text-lg"
                                  title={t({ en: 'Confirm', fr: 'Confirmer' })}
                                >
                                  ✅
                                </button>
                              )}
                              {reservation.status === 'confirmed' && (
                                <button
                                  onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                  className="text-orange-600 hover:text-orange-800 text-lg"
                                  title={t({ en: 'Cancel', fr: 'Annuler' })}
                                >
                                  ⚠️
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReservation(reservation.id)}
                                className="text-red-600 hover:text-red-800 text-lg"
                                title={t({ en: 'Delete', fr: 'Supprimer' })}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {t({ en: 'Booking Calendar', fr: 'Calendrier de Réservations' })}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newDate = new Date(currentCalendarDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setCurrentCalendarDate(newDate);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      ← {t({ en: 'Previous', fr: 'Précédent' })}
                    </button>
                    <button
                      onClick={() => setCurrentCalendarDate(new Date())}
                      className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-lg transition-colors"
                    >
                      {t({ en: 'Today', fr: 'Aujourd\'hui' })}
                    </button>
                    <button
                      onClick={() => {
                        const newDate = new Date(currentCalendarDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setCurrentCalendarDate(newDate);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {t({ en: 'Next', fr: 'Suivant' })} →
                    </button>
                  </div>
                </div>

                {/* Current Month Display */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-forest-900 capitalize">
                    {currentCalendarDate.toLocaleDateString(t({ en: 'en-US', fr: 'fr-FR' }), {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h3>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 bg-forest-700 text-white">
                    {[
                      t({ en: 'Sun', fr: 'Dim' }),
                      t({ en: 'Mon', fr: 'Lun' }),
                      t({ en: 'Tue', fr: 'Mar' }),
                      t({ en: 'Wed', fr: 'Mer' }),
                      t({ en: 'Thu', fr: 'Jeu' }),
                      t({ en: 'Fri', fr: 'Ven' }),
                      t({ en: 'Sat', fr: 'Sam' })
                    ].map((day, i) => (
                      <div key={i} className="p-3 text-center font-semibold text-sm">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {generateCalendarDays(currentCalendarDate, reservations).map((day, i) => {
                      const isToday = day.date &&
                        day.date.toDateString() === new Date().toDateString();
                      const isCurrentMonth = day.date &&
                        day.date.getMonth() === currentCalendarDate.getMonth();

                      return (
                        <div
                          key={i}
                          className={`min-h-[120px] border-b border-r p-2 ${
                            !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                          } ${isToday ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`}
                        >
                          {day.date && (
                            <>
                              <div className={`text-sm font-semibold mb-2 ${
                                isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {day.date.getDate()}
                              </div>
                              {day.bookings.map((booking, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs p-1 mb-1 rounded truncate cursor-pointer ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }`}
                                  title={`${booking.guestName} - ${booking.checkIn} → ${booking.checkOut}`}
                                >
                                  {booking.isStart ? '🏠 ' : ''}
                                  {booking.guestName}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-6 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-sm text-gray-700">
                      {t({ en: 'Confirmed Booking', fr: 'Réservation Confirmée' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span className="text-sm text-gray-700">
                      {t({ en: 'Pending Booking', fr: 'Réservation En Attente' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-50 border-2 border-blue-400 rounded"></div>
                    <span className="text-sm text-gray-700">
                      {t({ en: 'Today', fr: 'Aujourd\'hui' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {t({ en: 'Contact Messages', fr: 'Messages de Contact' })}
                </h2>
                <div className="space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`border rounded-lg p-4 ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-600">{message.email}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{message.date ? new Date(message.date).toLocaleDateString('fr-FR') : ''}</span>
                          {!message.read && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              {t({ en: 'New', fr: 'Nouveau' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-800">{message.subject}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{message.message}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="text-sm bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded transition-colors">
                          {t({ en: 'Reply', fr: 'Répondre' })}
                        </button>
                        <button className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors">
                          {t({ en: 'Mark as read', fr: 'Marquer comme lu' })}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {t({ en: 'Settings', fr: 'Paramètres' })}
                </h2>
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">{t({ en: 'Pricing Configuration', fr: 'Configuration des Tarifs' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'High Season (€/week)', fr: 'Haute Saison (€/semaine)' })}
                        </label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" defaultValue="2200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'Mid Season (€/week)', fr: 'Moyenne Saison (€/semaine)' })}
                        </label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" defaultValue="1600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'Low Season (€/week)', fr: 'Basse Saison (€/semaine)' })}
                        </label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" defaultValue="1200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'Cleaning Fee (€)', fr: 'Frais de Ménage (€)' })}
                        </label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" defaultValue="200" />
                      </div>
                    </div>
                    <button className="mt-4 bg-forest-700 hover:bg-forest-800 text-white px-6 py-2 rounded-lg transition-colors">
                      {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                    </button>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">{t({ en: 'Notification Settings', fr: 'Paramètres de Notification' })}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-forest-700 rounded" />
                        <span>{t({ en: 'Email notifications for new bookings', fr: 'Notifications email pour nouvelles réservations' })}</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-forest-700 rounded" />
                        <span>{t({ en: 'Email notifications for new messages', fr: 'Notifications email pour nouveaux messages' })}</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 text-forest-700 rounded" />
                        <span>{t({ en: 'SMS notifications for urgent matters', fr: 'Notifications SMS pour urgences' })}</span>
                      </label>
                    </div>
                    <button className="mt-4 bg-forest-700 hover:bg-forest-800 text-white px-6 py-2 rounded-lg transition-colors">
                      {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
