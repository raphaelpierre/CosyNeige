'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';
import { formatEuro } from '@/lib/utils';
import AdminInvoiceGeneratorFixed from '@/components/invoice/AdminInvoiceGeneratorFixed';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: string;
}

interface Reservation {
  id: string;
  guestName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  paymentStatus?: string;
  depositAmount?: number;
  message?: string;
  createdAt: string;
  user?: User;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  fromEmail: string;
  fromName: string;
  isFromAdmin: boolean;
  read: boolean;
  createdAt: string;
  name?: string; // Pour compatibilité avec l'affichage
  email?: string; // Pour compatibilité avec l'affichage
  date?: string; // Pour compatibilité avec l'affichage
  message?: string; // Pour compatibilité avec l'affichage
}

type TabType = 'reservations' | 'users' | 'messages' | 'invoices' | 'calendar' | 'settings';

export default function AdminPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('reservations');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Données depuis l'API
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showInvoicePDF, setShowInvoicePDF] = useState(false);
  const [invoiceForPDF, setInvoiceForPDF] = useState<any | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    role: 'client'
  });

  // Vérification de l'authentification et du rôle admin
  useEffect(() => {
    if (loading) return; // Attendre la fin du chargement
    
    if (!isAuthenticated) {
      router.push('/client/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      router.push('/client/dashboard');
      return;
    }
    
    // L'utilisateur est admin, charger les données
    fetchReservations();
    fetchData();
    fetchUsers();
    fetchInvoices();
  }, [loading, isAuthenticated, user, router]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // La redirection se fait dans useEffect
  }

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Fonction pour créer un utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setShowUserModal(false);
        setNewUser({ email: '', firstName: '', lastName: '', phone: '', password: '', role: 'client' });
        fetchUsers(); // Recharger la liste
        alert('Utilisateur créé avec succès');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Erreur lors de la création');
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchUsers();
        alert('Utilisateur supprimé');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Fonction pour répondre à un message
  const handleReplyMessage = async (message: Message) => {
    if (!replyContent.trim()) {
      alert('Veuillez saisir une réponse');
      return;
    }

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          type: 'internal',
          replyContent,
          recipientEmail: message.fromEmail
        })
      });

      if (response.ok) {
        setSelectedMessage(null);
        setReplyContent('');
        alert('Réponse envoyée avec succès');
      } else {
        alert('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error replying to message:', error);
      alert('Erreur lors de l\'envoi');
    }
  };

  // Fonction pour supprimer un message
  const handleDeleteMessage = async (messageId: string, type: 'internal' | 'contact') => {
    const confirmText = t({ 
      en: 'Are you sure you want to delete this message?', 
      fr: 'Êtes-vous sûr de vouloir supprimer ce message ?' 
    });
    
    if (!window.confirm(confirmText)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });

      if (response.ok) {
        // Actualiser la liste des messages
        if (type === 'internal') {
          setMessages(messages.filter(m => m.id !== messageId));
        }
        alert(t({ 
          en: 'Message deleted successfully', 
          fr: 'Message supprimé avec succès' 
        }));
        // Recharger les données
        fetchData();
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la suppression du message:', errorData.error);
        alert(t({ 
          en: 'Error deleting message', 
          fr: 'Erreur lors de la suppression du message' 
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      alert(t({ 
        en: 'Error deleting message', 
        fr: 'Erreur lors de la suppression du message' 
      }));
    }
  };

  // Fonction pour charger les données
  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages', {
        credentials: 'include' // Pour inclure les cookies
      });
      if (response.ok) {
        const data = await response.json();
        // Transformer les données pour la compatibilité avec l'interface
        const transformedMessages = data.messages?.map((msg: any) => ({
          ...msg,
          name: msg.name || msg.fromName,
          email: msg.email || msg.fromEmail,
          message: msg.message || msg.content,
          date: msg.createdAt
        })) || [];
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include' // Pour inclure les cookies
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // L'API renvoie directement le tableau
      } else {
        console.error('Failed to load users:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices', {
        credentials: 'include' // Pour inclure les cookies
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data); // L'API renvoie directement le tableau
      } else {
        console.error('Failed to load invoices:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const fetchData = async () => {
    await Promise.all([
      loadUsers(),
      loadInvoices(),
      loadMessages()
    ]);
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          invoiceId, 
          paymentStatus: newStatus,
          notes 
        })
      });

      if (response.ok) {
        alert(t({ 
          en: 'Invoice updated successfully', 
          fr: 'Facture mise à jour avec succès' 
        }));
        loadInvoices(); // Recharger les factures
        setShowInvoiceModal(false);
      } else {
        throw new Error('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert(t({ 
        en: 'Error updating invoice', 
        fr: 'Erreur lors de la mise à jour de la facture' 
      }));
    }
  };

  const handleDownloadPDF = (invoice: any) => {
    setInvoiceForPDF(invoice);
    setShowInvoicePDF(true);
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
      const response = await fetch('/api/admin/reservations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({ reservationId: id, status: newStatus }),
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
      const response = await fetch('/api/admin/reservations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({ reservationId: id }),
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



  const tabs = [
    { id: 'reservations' as TabType, icon: '📅', label: { en: 'Reservations', fr: 'Réservations' } },
    { id: 'users' as TabType, icon: '�', label: { en: 'Users', fr: 'Utilisateurs' } },
    { id: 'messages' as TabType, icon: '💬', label: { en: 'Messages', fr: 'Messages' } },
    { id: 'invoices' as TabType, icon: '🧾', label: { en: 'Invoices', fr: 'Factures' } },
    { id: 'calendar' as TabType, icon: '🗓️', label: { en: 'Calendar', fr: 'Calendrier' } },
    { id: 'settings' as TabType, icon: '⚙️', label: { en: 'Settings', fr: 'Paramètres' } }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-forest-700';
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
              <p className="text-sm text-gray-600 mt-1">Chalet-Balmotte810 Management</p>
            </div>
            <button
              onClick={logout}
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
                <p className="text-3xl font-bold text-slate-700 mt-2">
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
                      ? 'border-slate-700 text-forest-700'
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
                  <button className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors border-2 border-slate-700 hover:border-slate-800 font-bold">
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
                                  className="text-green-600 hover:text-forest-700 text-lg"
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
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors"
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
                  <div className="grid grid-cols-7 bg-slate-700 text-white">
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
                                isToday ? 'text-slate-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {day.date.getDate()}
                              </div>
                              {day.bookings.map((booking, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs p-1 mb-1 rounded truncate cursor-pointer ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-forest-700 hover:bg-green-200'
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

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {t({ en: 'User Management', fr: 'Gestion des Utilisateurs' })}
                  </h2>
                  <button 
                    onClick={() => setShowUserModal(true)}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors border-2 border-slate-700 hover:border-slate-800 font-bold"
                  >
                    {t({ en: 'Add User', fr: 'Ajouter un Utilisateur' })}
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Name', fr: 'Nom' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Email', fr: 'Email' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Phone', fr: 'Téléphone' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Role', fr: 'Rôle' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Created', fr: 'Créé le' })}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t({ en: 'Actions', fr: 'Actions' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-semibold">{user.firstName} {user.lastName}</div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.phone || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800"
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

                {/* Modal pour créer/éditer un utilisateur */}
                {showUserModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-bold mb-4">
                        {t({ en: 'Add New User', fr: 'Ajouter un Utilisateur' })}
                      </h3>
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'First Name', fr: 'Prénom' })}
                          </label>
                          <input
                            type="text"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Last Name', fr: 'Nom' })}
                          </label>
                          <input
                            type="text"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Phone', fr: 'Téléphone' })}
                          </label>
                          <input
                            type="tel"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Password', fr: 'Mot de passe' })}
                          </label>
                          <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Role', fr: 'Rôle' })}
                          </label>
                          <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                          >
                            {t({ en: 'Create', fr: 'Créer' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUserModal(false)}
                            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                          >
                            {t({ en: 'Cancel', fr: 'Annuler' })}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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
                            <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded">
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
                        <button 
                          onClick={() => setSelectedMessage(message)}
                          className="text-sm bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded transition-colors"
                        >
                          {t({ en: 'Reply', fr: 'Répondre' })}
                        </button>
                        <button 
                          onClick={() => handleDeleteMessage(message.id, 'internal')}
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded transition-colors"
                        >
                          {t({ en: 'Delete', fr: 'Supprimer' })}
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

            {activeTab === 'invoices' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {t({ en: 'Invoice Management', fr: 'Gestion des Factures' })}
                </h2>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t({ en: 'Invoice #', fr: 'Facture #' })}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t({ en: 'Client', fr: 'Client' })}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t({ en: 'Amount', fr: 'Montant' })}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t({ en: 'Status', fr: 'Statut' })}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t({ en: 'Date', fr: 'Date' })}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t({ en: 'Actions', fr: 'Actions' })}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice, index) => (
                          <tr key={invoice.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              INV-{invoice.invoiceNumber || invoice.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {invoice.clientName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {invoice.clientEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              €{invoice.totalAmount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                invoice.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800'
                                  : invoice.paymentStatus === 'partial'
                                  ? 'bg-yellow-100 text-yellow-800'  
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {invoice.paymentStatus === 'paid' 
                                  ? t({ en: 'Paid', fr: 'Payée' })
                                  : invoice.paymentStatus === 'partial'
                                  ? t({ en: 'Partial', fr: 'Partielle' })
                                  : t({ en: 'Unpaid', fr: 'Impayée' })
                                }
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleViewInvoice(invoice)}
                                  className="text-slate-600 hover:text-slate-900"
                                >
                                  {t({ en: 'View', fr: 'Voir' })}
                                </button>
                                <button 
                                  onClick={() => handleViewInvoice(invoice)}
                                  className="text-forest-600 hover:text-forest-900"
                                >
                                  {t({ en: 'Edit Status', fr: 'Modifier' })}
                                </button>
                                <button 
                                  onClick={() => handleDownloadPDF(invoice)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  {t({ en: 'Download', fr: 'Télécharger' })}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {invoices.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">🧾</div>
                        <p className="text-gray-500">
                          {t({ en: 'No invoices found', fr: 'Aucune facture trouvée' })}
                        </p>
                      </div>
                    )}
                  </div>
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
                    <button className="mt-4 bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg transition-colors">
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
                    <button className="mt-4 bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg transition-colors">
                      {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour répondre aux messages */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {t({ en: 'Reply to Message', fr: 'Répondre au Message' })}
            </h3>
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-2">
                <strong>De :</strong> {selectedMessage.name} ({selectedMessage.email})
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Sujet :</strong> {selectedMessage.subject}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Message :</strong> {selectedMessage.message}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t({ en: 'Your Reply', fr: 'Votre Réponse' })}
              </label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                rows={4}
                placeholder={t({ 
                  en: 'Type your reply here...', 
                  fr: 'Tapez votre réponse ici...' 
                })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyContent('');
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t({ en: 'Cancel', fr: 'Annuler' })}
              </button>
              <button
                onClick={() => handleReplyMessage(selectedMessage)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                {t({ en: 'Send Reply', fr: 'Envoyer' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour créer un utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {t({ en: 'Create New User', fr: 'Créer un Nouvel Utilisateur' })}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Email', fr: 'Email' })}
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Password', fr: 'Mot de passe' })}
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Role', fr: 'Rôle' })}
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'client' | 'admin'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="client">{t({ en: 'Client', fr: 'Client' })}</option>
                  <option value="admin">{t({ en: 'Admin', fr: 'Admin' })}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setNewUser({ email: '', firstName: '', lastName: '', phone: '', password: '', role: 'client' });
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t({ en: 'Cancel', fr: 'Annuler' })}
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                {t({ en: 'Create User', fr: 'Créer' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation/édition de facture */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {t({ en: 'Invoice Details', fr: 'Détails de la Facture' })} - INV-{selectedInvoice.invoiceNumber || selectedInvoice.id}
              </h3>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations client */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  {t({ en: 'Client Information', fr: 'Informations Client' })}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Name:', fr: 'Nom :' })}</span>
                    <div className="font-semibold">{selectedInvoice.clientName}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Email:', fr: 'Email :' })}</span>
                    <div className="font-semibold">{selectedInvoice.clientEmail}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Phone:', fr: 'Téléphone :' })}</span>
                    <div className="font-semibold">{selectedInvoice.clientPhone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Détails de la réservation */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  {t({ en: 'Reservation Details', fr: 'Détails de la Réservation' })}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Check-in:', fr: 'Arrivée :' })}</span>
                    <div className="font-semibold">{new Date(selectedInvoice.checkIn).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Check-out:', fr: 'Départ :' })}</span>
                    <div className="font-semibold">{new Date(selectedInvoice.checkOut).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Guests:', fr: 'Personnes :' })}</span>
                    <div className="font-semibold">{selectedInvoice.guests}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Duration:', fr: 'Durée :' })}</span>
                    <div className="font-semibold">
                      {Math.ceil((new Date(selectedInvoice.checkOut).getTime() - new Date(selectedInvoice.checkIn).getTime()) / (1000 * 60 * 60 * 24))} {t({ en: 'nights', fr: 'nuits' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails financiers */}
            <div className="mt-8 bg-green-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                {t({ en: 'Financial Details', fr: 'Détails Financiers' })}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{t({ en: 'Total Amount:', fr: 'Montant Total :' })}</span>
                  <div className="text-2xl font-bold text-green-600">€{selectedInvoice.totalAmount}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{t({ en: 'Payment Status:', fr: 'Statut Paiement :' })}</span>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedInvoice.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : selectedInvoice.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'  
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedInvoice.paymentStatus === 'paid' 
                      ? t({ en: 'Paid', fr: 'Payée' })
                      : selectedInvoice.paymentStatus === 'partial'
                      ? t({ en: 'Partial', fr: 'Partielle' })
                      : t({ en: 'Unpaid', fr: 'Impayée' })
                    }
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{t({ en: 'Created:', fr: 'Créée le :' })}</span>
                  <div className="font-semibold">{new Date(selectedInvoice.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            </div>

            {/* Modification du statut */}
            <div className="mt-8 bg-yellow-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                {t({ en: 'Update Payment Status', fr: 'Modifier le Statut de Paiement' })}
              </h4>
              <div className="flex gap-4">
                <button
                  onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'unpaid')}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-semibold transition-colors"
                >
                  {t({ en: 'Mark as Unpaid', fr: 'Marquer Impayée' })}
                </button>
                <button
                  onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'partial')}
                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-semibold transition-colors"
                >
                  {t({ en: 'Mark as Partial', fr: 'Marquer Partielle' })}
                </button>
                <button
                  onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'paid')}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold transition-colors"
                >
                  {t({ en: 'Mark as Paid', fr: 'Marquer Payée' })}
                </button>
              </div>
            </div>

            {/* Message de la réservation */}
            {selectedInvoice.message && (
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  {t({ en: 'Client Message', fr: 'Message du Client' })}
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedInvoice.message}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t({ en: 'Close', fr: 'Fermer' })}
              </button>
              <button 
                onClick={() => handleDownloadPDF(selectedInvoice)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                {t({ en: 'Download PDF', fr: 'Télécharger PDF' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Générateur de PDF pour factures admin */}
      {showInvoicePDF && invoiceForPDF && (
        <AdminInvoiceGeneratorFixed
          invoice={invoiceForPDF}
          onClose={() => {
            setShowInvoicePDF(false);
            setInvoiceForPDF(null);
          }}
        />
      )}
    </div>
  );
}
