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
      {/* Header Mobile-First */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-forest-900 truncate">
                {t({ en: 'Admin Dashboard', fr: 'Panneau Admin' })}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Chalet-Balmotte810</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors ml-2"
            >
              <span>🚪</span>
              <span className="font-medium text-xs sm:text-sm hidden sm:inline">{t({ en: 'Logout', fr: 'Déconnexion' })}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Total', fr: 'Total' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-forest-900 mt-1">{reservations.length}</p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Pending', fr: 'En Attente' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 mt-1">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Confirmed', fr: 'Confirmées' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Messages', fr: 'Messages' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700 mt-1">
                  {messages.filter(m => !m.read).length}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">📧</div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Dropdown Style */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Mobile Tab Selector */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabType)}
              className="w-full p-4 text-base font-medium bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.icon} {t(tab.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs - Hidden on Mobile */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-slate-700 text-forest-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg sm:text-xl">{tab.icon}</span>
                  <span className="hidden lg:inline">{t(tab.label)}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content - Mobile Optimized */}
          <div className="p-3 sm:p-4 lg:p-6">
            {activeTab === 'reservations' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t({ en: 'Reservations', fr: 'Réservations' })}
                  </h2>
                  <button className="bg-slate-700 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors border-2 border-slate-700 hover:border-slate-800 font-bold text-sm">
                    {t({ en: '+ Add', fr: '+ Ajouter' })}
                  </button>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{reservation.guestName}</h3>
                          <p className="text-sm text-gray-600">{reservation.email}</p>
                          <p className="text-sm text-gray-600">{reservation.phone}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Arrivée:</span>
                          <div className="font-medium">{new Date(reservation.checkIn).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Départ:</span>
                          <div className="font-medium">{new Date(reservation.checkOut).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Personnes:</span>
                          <div className="font-medium">{reservation.guests}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Prix:</span>
                          <div className="font-semibold text-forest-900">{reservation.totalPrice}€</div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        {reservation.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium"
                          >
                            ✅ Confirmer
                          </button>
                        )}
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-medium"
                          >
                            ⚠️ Annuler
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t({ en: 'Calendar', fr: 'Calendrier' })}
                  </h2>
                  
                  {/* Mobile Navigation - Compact */}
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        const newDate = new Date(currentCalendarDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setCurrentCalendarDate(newDate);
                      }}
                      className="px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                    >
                      <span className="sm:hidden">←</span>
                      <span className="hidden sm:inline">← {t({ en: 'Previous', fr: 'Précédent' })}</span>
                    </button>
                    <button
                      onClick={() => setCurrentCalendarDate(new Date())}
                      className="px-2 sm:px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors text-sm"
                    >
                      <span className="sm:hidden">•</span>
                      <span className="hidden sm:inline">{t({ en: 'Today', fr: 'Aujourd\'hui' })}</span>
                    </button>
                    <button
                      onClick={() => {
                        const newDate = new Date(currentCalendarDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setCurrentCalendarDate(newDate);
                      }}
                      className="px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                    >
                      <span className="sm:hidden">→</span>
                      <span className="hidden sm:inline">{t({ en: 'Next', fr: 'Suivant' })} →</span>
                    </button>
                  </div>
                </div>

                {/* Current Month Display */}
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-forest-900 capitalize">
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
                      t({ en: 'Sun', fr: 'D' }),
                      t({ en: 'Mon', fr: 'L' }),
                      t({ en: 'Tue', fr: 'M' }),
                      t({ en: 'Wed', fr: 'M' }),
                      t({ en: 'Thu', fr: 'J' }),
                      t({ en: 'Fri', fr: 'V' }),
                      t({ en: 'Sat', fr: 'S' })
                    ].map((day, i) => (
                      <div key={i} className="p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm">
                        <span className="sm:hidden">
                          {[
                            t({ en: 'S', fr: 'D' }),
                            t({ en: 'M', fr: 'L' }),
                            t({ en: 'T', fr: 'M' }),
                            t({ en: 'W', fr: 'M' }),
                            t({ en: 'T', fr: 'J' }),
                            t({ en: 'F', fr: 'V' }),
                            t({ en: 'S', fr: 'S' })
                          ][i]}
                        </span>
                        <span className="hidden sm:inline">{day}</span>
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
                          className={`min-h-[60px] sm:min-h-[120px] border-b border-r p-1 sm:p-2 ${
                            !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                          } ${isToday ? 'bg-blue-50 ring-1 sm:ring-2 ring-blue-400' : ''}`}
                        >
                          {day.date && (
                            <>
                              <div className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${
                                isToday ? 'text-slate-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {day.date.getDate()}
                              </div>
                              {day.bookings.map((booking, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs p-0.5 sm:p-1 mb-1 rounded truncate cursor-pointer ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-forest-700 hover:bg-green-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }`}
                                  title={`${booking.guestName} - ${booking.checkIn} → ${booking.checkOut}`}
                                >
                                  {booking.isStart && <span className="hidden sm:inline">🏠 </span>}
                                  <span className="text-xs">
                                    {booking.guestName.split(' ')[0]}
                                  </span>
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
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-6 justify-center text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-700">
                      {t({ en: 'Confirmed', fr: 'Confirmée' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span className="text-gray-700">
                      {t({ en: 'Pending', fr: 'En Attente' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-50 border-2 border-blue-400 rounded"></div>
                    <span className="text-gray-700">
                      {t({ en: 'Today', fr: 'Aujourd\'hui' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t({ en: 'Users', fr: 'Utilisateurs' })}
                  </h2>
                  <button 
                    onClick={() => setShowUserModal(true)}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors border-2 border-slate-700 hover:border-slate-800 font-bold text-sm"
                  >
                    {t({ en: '+ Add User', fr: '+ Ajouter' })}
                  </button>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
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

                {/* Modal pour créer/éditer un utilisateur - Mobile Optimized */}
                {showUserModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {t({ en: 'Add New User', fr: 'Ajouter un Utilisateur' })}
                      </h3>
                      <form onSubmit={handleCreateUser} className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'First Name', fr: 'Prénom' })}
                          </label>
                          <input
                            type="text"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          >
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                          <button
                            type="submit"
                            className="w-full sm:flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
                          >
                            {t({ en: 'Create', fr: 'Créer' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUserModal(false)}
                            className="w-full sm:flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t({ en: 'Messages', fr: 'Messages' })}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`border rounded-lg p-3 sm:p-4 ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-600">{message.email}</div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                          <span className="text-gray-500">{message.date ? new Date(message.date).toLocaleDateString('fr-FR') : ''}</span>
                          {!message.read && (
                            <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {t({ en: 'New', fr: 'Nouveau' })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className="font-medium text-gray-800 text-sm sm:text-base">{message.subject}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{message.message}</p>
                      
                      {/* Mobile Actions - Stacked */}
                      <div className="sm:hidden flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedMessage(message)}
                            className="flex-1 text-sm bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded transition-colors"
                          >
                            💬 {t({ en: 'Reply', fr: 'Répondre' })}
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(message.id, 'internal')}
                            className="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded transition-colors"
                          >
                            🗑️ {t({ en: 'Delete', fr: 'Supprimer' })}
                          </button>
                        </div>
                        <button className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded transition-colors">
                          ✓ {t({ en: 'Mark as read', fr: 'Marquer comme lu' })}
                        </button>
                      </div>

                      {/* Desktop Actions - Inline */}
                      <div className="hidden sm:flex gap-2">
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
                  
                  {messages.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-gray-500 text-3xl sm:text-4xl mb-4">📧</div>
                      <p className="text-gray-500">
                        {t({ en: 'No messages found', fr: 'Aucun message trouvé' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t({ en: 'Invoices', fr: 'Factures' })}
                </h2>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4">
                  {invoices.map((invoice, index) => (
                    <div key={invoice.id || index} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">INV-{invoice.invoiceNumber || invoice.id}</h3>
                          <p className="text-sm text-gray-600">{invoice.clientName}</p>
                          <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
                        </div>
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
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-lg font-bold text-forest-900">€{invoice.totalAmount}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      <div className="flex gap-2 text-sm">
                        <button 
                          onClick={() => handleViewInvoice(invoice)}
                          className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded font-medium"
                        >
                          👁️ Voir
                        </button>
                        <button 
                          onClick={() => handleViewInvoice(invoice)}
                          className="flex-1 bg-forest-100 text-forest-700 px-3 py-2 rounded font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(invoice)}
                          className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded font-medium"
                        >
                          📄 PDF
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {invoices.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-gray-500 text-3xl sm:text-4xl mb-4">🧾</div>
                      <p className="text-gray-500">
                        {t({ en: 'No invoices found', fr: 'Aucune facture trouvée' })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t({ en: 'Settings', fr: 'Paramètres' })}
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white border rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                      {t({ en: 'Pricing Configuration', fr: 'Configuration des Tarifs' })}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'High Season (€/week)', fr: 'Haute Saison (€/semaine)' })}
                        </label>
                        <input type="number" className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" defaultValue="2200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'Mid Season (€/week)', fr: 'Moyenne Saison (€/semaine)' })}
                        </label>
                        <input type="number" className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" defaultValue="1600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'Low Season (€/week)', fr: 'Basse Saison (€/semaine)' })}
                        </label>
                        <input type="number" className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" defaultValue="1200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t({ en: 'Cleaning Fee (€)', fr: 'Frais de Ménage (€)' })}
                        </label>
                        <input type="number" className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" defaultValue="200" />
                      </div>
                    </div>
                    <button className="mt-4 w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base">
                      {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                    </button>
                  </div>

                  <div className="bg-white border rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                      {t({ en: 'Notification Settings', fr: 'Paramètres de Notification' })}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <label className="flex items-start sm:items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 sm:w-5 sm:h-5 text-forest-700 rounded mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm sm:text-base">
                          {t({ en: 'Email notifications for new bookings', fr: 'Notifications email pour nouvelles réservations' })}
                        </span>
                      </label>
                      <label className="flex items-start sm:items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 sm:w-5 sm:h-5 text-forest-700 rounded mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm sm:text-base">
                          {t({ en: 'Email notifications for new messages', fr: 'Notifications email pour nouveaux messages' })}
                        </span>
                      </label>
                      <label className="flex items-start sm:items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 text-forest-700 rounded mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm sm:text-base">
                          {t({ en: 'SMS notifications for urgent matters', fr: 'Notifications SMS pour urgences' })}
                        </span>
                      </label>
                    </div>
                    <button className="mt-4 w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base">
                      {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour répondre aux messages - Mobile Optimized */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t({ en: 'Reply to Message', fr: 'Répondre au Message' })}
            </h3>
            <div className="mb-3 sm:mb-4 p-3 bg-gray-50 rounded text-sm">
              <p className="text-gray-600 mb-2">
                <strong>De :</strong> {selectedMessage.name} ({selectedMessage.email})
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Sujet :</strong> {selectedMessage.subject}
              </p>
              <p className="text-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm"
                rows={4}
                placeholder={t({ 
                  en: 'Type your reply here...', 
                  fr: 'Tapez votre réponse ici...' 
                })}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyContent('');
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
              >
                {t({ en: 'Cancel', fr: 'Annuler' })}
              </button>
              <button
                onClick={() => handleReplyMessage(selectedMessage)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors text-sm sm:text-base"
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

      {/* Modal de visualisation/édition de facture - Mobile Optimized */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-2">
                {t({ en: 'Invoice Details', fr: 'Détails Facture' })} - INV-{selectedInvoice.invoiceNumber || selectedInvoice.id}
              </h3>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Informations client */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                  {t({ en: 'Client Information', fr: 'Informations Client' })}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Name:', fr: 'Nom :' })}</span>
                    <div className="font-semibold text-sm sm:text-base">{selectedInvoice.clientName}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Email:', fr: 'Email :' })}</span>
                    <div className="font-semibold text-sm sm:text-base break-all">{selectedInvoice.clientEmail}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Phone:', fr: 'Téléphone :' })}</span>
                    <div className="font-semibold text-sm sm:text-base">{selectedInvoice.clientPhone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Détails de la réservation */}
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                  {t({ en: 'Reservation Details', fr: 'Détails Réservation' })}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Check-in:', fr: 'Arrivée :' })}</span>
                    <div className="font-semibold text-sm sm:text-base">{new Date(selectedInvoice.checkIn).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Check-out:', fr: 'Départ :' })}</span>
                    <div className="font-semibold text-sm sm:text-base">{new Date(selectedInvoice.checkOut).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Guests:', fr: 'Personnes :' })}</span>
                    <div className="font-semibold text-sm sm:text-base">{selectedInvoice.guests}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t({ en: 'Duration:', fr: 'Durée :' })}</span>
                    <div className="font-semibold text-sm sm:text-base">
                      {Math.ceil((new Date(selectedInvoice.checkOut).getTime() - new Date(selectedInvoice.checkIn).getTime()) / (1000 * 60 * 60 * 24))} {t({ en: 'nights', fr: 'nuits' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails financiers */}
            <div className="mt-4 sm:mt-6 lg:mt-8 bg-green-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                {t({ en: 'Financial Details', fr: 'Détails Financiers' })}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <span className="text-sm text-gray-600">{t({ en: 'Total Amount:', fr: 'Montant Total :' })}</span>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">€{selectedInvoice.totalAmount}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{t({ en: 'Payment Status:', fr: 'Statut :' })}</span>
                  <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mt-1 ${
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
                  <div className="font-semibold text-sm sm:text-base">{new Date(selectedInvoice.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            </div>

            {/* Modification du statut */}
            <div className="mt-4 sm:mt-6 lg:mt-8 bg-yellow-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                {t({ en: 'Update Status', fr: 'Modifier le Statut' })}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <button
                  onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'unpaid')}
                  className="px-3 sm:px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  {t({ en: 'Mark Unpaid', fr: 'Marquer Impayée' })}
                </button>
                <button
                  onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'partial')}
                  className="px-3 sm:px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  {t({ en: 'Mark Partial', fr: 'Marquer Partielle' })}
                </button>
                <button
                  onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'paid')}
                  className="px-3 sm:px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  {t({ en: 'Mark Paid', fr: 'Marquer Payée' })}
                </button>
              </div>
            </div>

            {/* Message de la réservation */}
            {selectedInvoice.message && (
              <div className="mt-4 sm:mt-6 lg:mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                  {t({ en: 'Client Message', fr: 'Message du Client' })}
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">{selectedInvoice.message}</p>
              </div>
            )}

            <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end">
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                {t({ en: 'Close', fr: 'Fermer' })}
              </button>
              <button 
                onClick={() => handleDownloadPDF(selectedInvoice)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
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
