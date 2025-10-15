'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';
import { formatEuro } from '@/lib/utils';
import AdminInvoiceGeneratorFixed from '@/components/invoice/AdminInvoiceGeneratorFixed';
import InvoiceModal from '@/components/invoice/InvoiceModal';

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

type TabType = 'dashboard' | 'reservations' | 'users' | 'messages' | 'invoices' | 'accounting' | 'calendar' | 'settings';

export default function AdminPage() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Données depuis l'API
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<(User & { password?: string }) | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [messageForm, setMessageForm] = useState({ subject: '', content: '' });
  const [seasons, setSeasons] = useState<any[]>([]);
  const [pricingSettings, setPricingSettings] = useState<any>(null);
  const [editingSeason, setEditingSeason] = useState<any | null>(null);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showInvoicePDF, setShowInvoicePDF] = useState(false);
  const [invoiceForPDF, setInvoiceForPDF] = useState<any | null>(null);
  const [selectedReservationForInvoice, setSelectedReservationForInvoice] = useState<Reservation | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'partial' | 'cancelled'>('all');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<'all' | 'deposit' | 'balance' | 'full'>('all');
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    totalPrice: 0,
    depositAmount: 0,
    status: 'pending',
    paymentStatus: 'pending',
    message: ''
  });
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

  // Charger les saisons et paramètres quand on ouvre l'onglet settings
  useEffect(() => {
    if (activeTab === 'settings' && isAuthenticated && user?.role === 'admin') {
      fetchSeasons();
      fetchPricingSettings();
    }
  }, [activeTab, isAuthenticated, user]);

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
        credentials: 'include' // Pour inclure les cookies
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
      } else {
        console.error('Failed to fetch reservations:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include' // Pour inclure les cookies
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices', {
        credentials: 'include' // Pour inclure les cookies
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        console.error('Failed to fetch invoices:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchSeasons = async () => {
    try {
      const response = await fetch('/api/admin/seasons', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSeasons(data);
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };

  const fetchPricingSettings = async () => {
    try {
      const response = await fetch('/api/admin/pricing-settings', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPricingSettings(data);
      }
    } catch (error) {
      console.error('Error fetching pricing settings:', error);
    }
  };

  // Fonction pour créer une réservation
  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newReservation,
          guestName: `${newReservation.firstName} ${newReservation.lastName}`
        })
      });

      if (response.ok) {
        setShowReservationModal(false);
        setNewReservation({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          checkIn: '',
          checkOut: '',
          guests: 2,
          totalPrice: 0,
          depositAmount: 0,
          status: 'pending',
          paymentStatus: 'pending',
          message: ''
        });
        fetchReservations();
        alert(t({ en: 'Reservation created successfully', fr: 'Réservation créée avec succès' }));
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(t({ en: 'Error creating reservation', fr: 'Erreur lors de la création' }));
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

  // Fonction pour mettre à jour un utilisateur
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: editingUser.id,
          email: editingUser.email,
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          phone: editingUser.phone,
          role: editingUser.role
        })
      });

      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
        alert(t({ en: 'User updated successfully', fr: 'Utilisateur mis à jour avec succès' }));
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Fonction pour mettre à jour une réservation
  const handleUpdateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;

    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          reservationId: editingReservation.id,
          firstName: editingReservation.firstName,
          lastName: editingReservation.lastName,
          email: editingReservation.email,
          phone: editingReservation.phone,
          checkIn: editingReservation.checkIn,
          checkOut: editingReservation.checkOut,
          guests: editingReservation.guests,
          totalPrice: editingReservation.totalPrice,
          depositAmount: editingReservation.depositAmount,
          status: editingReservation.status,
          paymentStatus: editingReservation.paymentStatus,
          message: editingReservation.message
        })
      });

      if (response.ok) {
        setEditingReservation(null);
        fetchReservations();
        alert(t({ en: 'Reservation updated successfully', fr: 'Réservation mise à jour avec succès' }));
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Fonction pour envoyer un message à un ou plusieurs utilisateurs
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      alert(t({ en: 'Please select at least one recipient', fr: 'Veuillez sélectionner au moins un destinataire' }));
      return;
    }

    if (!messageForm.subject || !messageForm.content) {
      alert(t({ en: 'Please fill in subject and message', fr: 'Veuillez remplir le sujet et le message' }));
      return;
    }

    try {
      const response = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userIds: selectedUserIds,
          subject: messageForm.subject,
          content: messageForm.content
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(t({
          en: `Message sent successfully to ${data.messagesSent} recipient(s)`,
          fr: `Message envoyé avec succès à ${data.messagesSent} destinataire(s)`
        }));
        setShowSendMessageModal(false);
        setSelectedUserIds([]);
        setMessageForm({ subject: '', content: '' });
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  // Fonctions pour gérer les saisons
  const handleCreateOrUpdateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeason) return;

    const isUpdate = !!editingSeason.id;
    const url = '/api/admin/seasons';
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(isUpdate ? { seasonId: editingSeason.id, ...editingSeason } : editingSeason)
      });

      if (response.ok) {
        setShowSeasonModal(false);
        setEditingSeason(null);
        fetchSeasons();
        alert(t({
          en: isUpdate ? 'Season updated successfully' : 'Season created successfully',
          fr: isUpdate ? 'Saison mise à jour avec succès' : 'Saison créée avec succès'
        }));
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving season:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteSeason = async (seasonId: string) => {
    if (!confirm(t({ en: 'Are you sure you want to delete this season?', fr: 'Êtes-vous sûr de vouloir supprimer cette saison ?' }))) return;

    try {
      const response = await fetch('/api/admin/seasons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ seasonId })
      });

      if (response.ok) {
        fetchSeasons();
        alert(t({ en: 'Season deleted successfully', fr: 'Saison supprimée avec succès' }));
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting season:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdatePricingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricingSettings) return;

    try {
      const response = await fetch('/api/admin/pricing-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pricingSettings)
      });

      if (response.ok) {
        alert(t({ en: 'Settings saved successfully', fr: 'Paramètres enregistrés avec succès' }));
        fetchPricingSettings();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Pour inclure les cookies
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
          'Content-Type': 'application/json'
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
    // Charger aussi les saisons et paramètres pour l'onglet settings
    if (activeTab === 'settings') {
      await Promise.all([
        fetchSeasons(),
        fetchPricingSettings()
      ]);
    }
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
        // Exclure les réservations annulées du calendrier
        if (booking.status === 'cancelled') return false;

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
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Pour inclure les cookies
        body: JSON.stringify({ reservationId: id, status: newStatus }),
      });

      if (response.ok) {
        // Si la réservation est confirmée, créer automatiquement une facture d'acompte
        if (newStatus === 'confirmed') {
          const reservation = reservations.find(r => r.id === id);
          if (reservation) {
            try {
              // Créer la facture d'acompte automatiquement
              const invoiceResponse = await fetch('/api/admin/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  reservationId: reservation.id,
                  type: 'deposit',
                  amount: reservation.depositAmount || Math.round(reservation.totalPrice * 0.3),
                  clientName: reservation.guestName || `${reservation.firstName} ${reservation.lastName}`,
                  clientEmail: reservation.email,
                  status: 'draft'
                })
              });

              if (invoiceResponse.ok) {
                console.log('Facture d\'acompte créée automatiquement');
                await fetchInvoices(); // Recharger les factures
              }
            } catch (invoiceError) {
              console.error('Erreur lors de la création automatique de la facture:', invoiceError);
            }
          }
        }

        await fetchReservations(); // Recharger les données
        alert(t({
          en: newStatus === 'confirmed'
            ? 'Reservation confirmed and deposit invoice created!'
            : 'Status updated successfully!',
          fr: newStatus === 'confirmed'
            ? 'Réservation confirmée et facture d\'acompte créée !'
            : 'Statut mis à jour avec succès !'
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
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Pour inclure les cookies
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
    { id: 'dashboard' as TabType, icon: '📊', label: { en: 'Dashboard', fr: 'Tableau de Bord' } },
    { id: 'reservations' as TabType, icon: '📅', label: { en: 'Reservations', fr: 'Réservations' } },
    { id: 'users' as TabType, icon: '�', label: { en: 'Users', fr: 'Utilisateurs' } },
    { id: 'messages' as TabType, icon: '💬', label: { en: 'Messages', fr: 'Messages' } },
    { id: 'invoices' as TabType, icon: '🧾', label: { en: 'Invoices', fr: 'Factures' } },
    { id: 'accounting' as TabType, icon: '💰', label: { en: 'Accounting', fr: 'Comptabilité' } },
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
          <button
            onClick={() => setActiveTab('reservations')}
            className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            title={t({ en: 'View all reservations', fr: 'Voir toutes les réservations' })}
          >
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Total', fr: 'Total' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-forest-900 mt-1">{reservations.length}</p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">📊</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('reservations');
              setStatusFilter('pending');
            }}
            className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            title={t({ en: 'View pending reservations', fr: 'Voir les réservations en attente' })}
          >
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Pending', fr: 'En Attente' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 mt-1">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">⏳</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('reservations');
              setStatusFilter('confirmed');
            }}
            className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            title={t({ en: 'View confirmed reservations', fr: 'Voir les réservations confirmées' })}
          >
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Confirmed', fr: 'Confirmées' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">✅</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            title={t({ en: 'View unread messages', fr: 'Voir les messages non lus' })}
          >
            <div className="text-center sm:flex sm:items-center sm:justify-between">
              <div className="sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">{t({ en: 'Messages', fr: 'Messages' })}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700 mt-1">
                  {messages.filter(m => !m.read).length}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl mt-2 sm:mt-0">📧</div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation - Horizontal Scroll Style */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Mobile Tab Selector - Horizontal Scroll */}
          <div className="sm:hidden overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 p-3 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-slate-100 hover:text-slate-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className={`text-xl transition-transform duration-300 ${
                    activeTab === tab.id ? 'animate-bounce-subtle' : ''
                  }`}>
                    {tab.icon}
                  </span>
                  <span>{t(tab.label)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Tabs - Hidden on Mobile */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-slate-700 text-slate-800 bg-slate-50 shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span className={`text-lg sm:text-xl transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className="hidden lg:inline">{t(tab.label)}</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content - Mobile Optimized */}
          <div className="p-3 sm:p-4 lg:p-6">
            {activeTab === 'dashboard' && (
              <div>
                {/* Header with date and quick stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t({ en: 'Dashboard', fr: 'Tableau de Bord' })}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Quick Alert Badges */}
                  <div className="flex gap-2">
                    {messages.filter(m => !m.read).length > 0 && (
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <span className="relative">
                          💬
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {messages.filter(m => !m.read).length}
                          </span>
                        </span>
                        <span className="hidden sm:inline">{t({ en: 'New Messages', fr: 'Nouveaux Messages' })}</span>
                      </button>
                    )}
                    {reservations.filter(r => r.status === 'pending').length > 0 && (
                      <button
                        onClick={() => setActiveTab('reservations')}
                        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <span className="relative">
                          📅
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {reservations.filter(r => r.status === 'pending').length}
                          </span>
                        </span>
                        <span className="hidden sm:inline">{t({ en: 'Pending', fr: 'En Attente' })}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Metrics - Compact Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {/* Revenue - Most Important */}
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 border-2 border-emerald-200 hover:border-emerald-300 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">💰</div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase">{t({ en: 'Revenue', fr: 'Revenu' })}</p>
                        <p className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700">
                          {formatEuro(reservations.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + (r.totalPrice || 0), 0))}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{reservations.filter(r => r.status === 'confirmed').length} {t({ en: 'confirmed bookings', fr: 'réservations confirmées' })}</p>
                  </button>

                  {/* Reservations */}
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 border-2 border-blue-200 hover:border-blue-300 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">📅</div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase">{t({ en: 'Reservations', fr: 'Réservations' })}</p>
                        <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">{reservations.length}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">{reservations.filter(r => r.status === 'pending').length} {t({ en: 'pending', fr: 'attente' })}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">{reservations.filter(r => r.status === 'confirmed').length} {t({ en: 'confirmed', fr: 'confirmées' })}</span>
                    </div>
                  </button>

                  {/* Messages */}
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 border-2 border-purple-200 hover:border-purple-300 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl relative">
                        💬
                        {messages.filter(m => !m.read).length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {messages.filter(m => !m.read).length}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase">{t({ en: 'Messages', fr: 'Messages' })}</p>
                        <p className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">{messages.length}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {messages.filter(m => !m.read).length} {t({ en: 'unread', fr: 'non lus' })}
                    </p>
                  </button>

                  {/* Users */}
                  <button
                    onClick={() => setActiveTab('users')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 border-2 border-slate-200 hover:border-slate-300 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">👥</div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase">{t({ en: 'Users', fr: 'Utilisateurs' })}</p>
                        <p className="text-2xl font-bold text-slate-600 group-hover:text-slate-700">{users.length}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {users.filter(u => u.role === 'client').length} {t({ en: 'clients', fr: 'clients' })} · {users.filter(u => u.role === 'admin').length} {t({ en: 'admins', fr: 'admins' })}
                    </p>
                  </button>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Reservations - Takes 2 columns */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {t({ en: 'Recent Reservations', fr: 'Réservations Récentes' })}
                      </h3>
                      <button
                        onClick={() => setActiveTab('reservations')}
                        className="text-sm text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        {t({ en: 'View all', fr: 'Voir tout' })} →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {reservations.slice(0, 5).map(reservation => (
                        <button
                          key={reservation.id}
                          onClick={() => setActiveTab('reservations')}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{reservation.guestName}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(reservation.checkIn).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })} - {new Date(reservation.checkOut).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span className="text-sm font-bold text-gray-700">{formatEuro(reservation.totalPrice || 0)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(reservation.status)}`}>
                              {reservation.status === 'pending' && '⏳'}
                              {reservation.status === 'confirmed' && '✅'}
                              {reservation.status === 'cancelled' && '❌'}
                            </span>
                          </div>
                        </button>
                      ))}
                      {reservations.length === 0 && (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">📅</div>
                          <p className="text-gray-500">{t({ en: 'No reservations yet', fr: 'Aucune réservation pour le moment' })}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Sidebar - Quick Actions & Stats */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {t({ en: 'Quick Actions', fr: 'Actions Rapides' })}
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setActiveTab('calendar')}
                          className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all text-left group border border-blue-200"
                        >
                          <span className="text-2xl">🗓️</span>
                          <span className="font-medium text-blue-900">{t({ en: 'View Calendar', fr: 'Voir Calendrier' })}</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('invoices')}
                          className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all text-left group border border-orange-200"
                        >
                          <span className="text-2xl">🧾</span>
                          <span className="font-medium text-orange-900">{t({ en: 'Invoices', fr: 'Factures' })}</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('settings')}
                          className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-lg transition-all text-left group border border-slate-200"
                        >
                          <span className="text-2xl">⚙️</span>
                          <span className="font-medium text-slate-900">{t({ en: 'Settings', fr: 'Paramètres' })}</span>
                        </button>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
                        {t({ en: 'Payment Status', fr: 'État des Paiements' })}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t({ en: 'Paid', fr: 'Payées' })}</span>
                          <span className="text-lg font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t({ en: 'Pending', fr: 'En Attente' })}</span>
                          <span className="text-lg font-bold text-orange-600">{invoices.filter(i => i.status === 'pending').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t({ en: 'Overdue', fr: 'En Retard' })}</span>
                          <span className="text-lg font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {t({ en: 'Reservations', fr: 'Réservations' })}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {reservations.filter(r => statusFilter === 'all' || r.status === statusFilter).length} {t({ en: 'reservation(s)', fr: 'réservation(s)' })}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Filtre par statut */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      <option value="all">{t({ en: '📋 All', fr: '📋 Toutes' })}</option>
                      <option value="pending">{t({ en: '⏳ Pending', fr: '⏳ En Attente' })}</option>
                      <option value="confirmed">{t({ en: '✅ Confirmed', fr: '✅ Confirmées' })}</option>
                      <option value="cancelled">{t({ en: '❌ Cancelled', fr: '❌ Annulées' })}</option>
                    </select>
                    <button
                      onClick={() => setShowReservationModal(true)}
                      className="bg-slate-700 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors border-2 border-slate-700 hover:border-slate-800 font-bold text-sm"
                    >
                      {t({ en: '+ Add', fr: '+ Ajouter' })}
                    </button>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4">
                  {reservations.filter(r => statusFilter === 'all' || r.status === statusFilter).map(reservation => (
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
                        <button
                          onClick={() => {
                            setSelectedReservationForInvoice(reservation);
                            setShowCreateInvoiceModal(true);
                          }}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-medium"
                          title={t({ en: 'Create Invoice', fr: 'Créer Facture' })}
                        >
                          📄 Facture
                        </button>
                        <button
                          onClick={() => setEditingReservation(reservation)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium"
                          title={t({ en: 'Edit reservation details', fr: 'Modifier les détails de la réservation' })}
                        >
                          ✏️ Modifier
                        </button>
                        {reservation.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium"
                            title={t({ en: 'Confirm this reservation', fr: 'Confirmer cette réservation' })}
                          >
                            ✅ Confirmer
                          </button>
                        )}
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-medium"
                            title={t({ en: 'Cancel this reservation', fr: 'Annuler cette réservation' })}
                          >
                            ⚠️ Annuler
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium"
                          title={t({ en: 'Permanently delete this reservation', fr: 'Supprimer définitivement cette réservation' })}
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
                      {reservations.filter(r => statusFilter === 'all' || r.status === statusFilter).map(reservation => (
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
                              <button
                                onClick={() => {
                                  setSelectedReservationForInvoice(reservation);
                                  setShowCreateInvoiceModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-800 text-lg"
                                title={t({ en: 'Create Invoice', fr: 'Créer Facture' })}
                              >
                                📄
                              </button>
                              <button
                                onClick={() => setEditingReservation(reservation)}
                                className="text-blue-600 hover:text-blue-800 text-lg"
                                title={t({ en: 'Edit', fr: 'Modifier' })}
                              >
                                ✏️
                              </button>
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

                {/* Modal d'édition de réservation */}
                {editingReservation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {t({ en: 'Edit Reservation', fr: 'Modifier la Réservation' })}
                      </h3>
                      <form onSubmit={handleUpdateReservation} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'First Name', fr: 'Prénom' })}
                            </label>
                            <input
                              type="text"
                              value={editingReservation.firstName}
                              onChange={(e) => setEditingReservation({...editingReservation, firstName: e.target.value})}
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
                              value={editingReservation.lastName}
                              onChange={(e) => setEditingReservation({...editingReservation, lastName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                              type="email"
                              value={editingReservation.email}
                              onChange={(e) => setEditingReservation({...editingReservation, email: e.target.value})}
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
                              value={editingReservation.phone}
                              onChange={(e) => setEditingReservation({...editingReservation, phone: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Check-in', fr: 'Arrivée' })}
                            </label>
                            <input
                              type="date"
                              value={editingReservation.checkIn.split('T')[0]}
                              onChange={(e) => setEditingReservation({...editingReservation, checkIn: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Check-out', fr: 'Départ' })}
                            </label>
                            <input
                              type="date"
                              value={editingReservation.checkOut.split('T')[0]}
                              onChange={(e) => setEditingReservation({...editingReservation, checkOut: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Guests', fr: 'Personnes' })}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editingReservation.guests}
                              onChange={(e) => setEditingReservation({...editingReservation, guests: parseInt(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Total Price', fr: 'Prix Total' })} (€)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingReservation.totalPrice}
                              onChange={(e) => setEditingReservation({...editingReservation, totalPrice: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Deposit', fr: 'Acompte' })} (€)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingReservation.depositAmount || 0}
                              onChange={(e) => setEditingReservation({...editingReservation, depositAmount: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Status', fr: 'Statut' })}
                            </label>
                            <select
                              value={editingReservation.status}
                              onChange={(e) => setEditingReservation({...editingReservation, status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            >
                              <option value="pending">{t({ en: 'Pending', fr: 'En attente' })}</option>
                              <option value="confirmed">{t({ en: 'Confirmed', fr: 'Confirmée' })}</option>
                              <option value="cancelled">{t({ en: 'Cancelled', fr: 'Annulée' })}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Payment Status', fr: 'Statut Paiement' })}
                            </label>
                            <select
                              value={editingReservation.paymentStatus || 'pending'}
                              onChange={(e) => setEditingReservation({...editingReservation, paymentStatus: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            >
                              <option value="pending">{t({ en: 'Pending', fr: 'En attente' })}</option>
                              <option value="partial">{t({ en: 'Partial', fr: 'Partiel' })}</option>
                              <option value="paid">{t({ en: 'Paid', fr: 'Payé' })}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Message', fr: 'Message' })}
                          </label>
                          <textarea
                            value={editingReservation.message || ''}
                            onChange={(e) => setEditingReservation({...editingReservation, message: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            rows={3}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                          <button
                            type="submit"
                            className="w-full sm:flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                          >
                            {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReservation(null)}
                            className="w-full sm:flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                          >
                            {t({ en: 'Cancel', fr: 'Annuler' })}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Modal de création de réservation */}
                {showReservationModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {t({ en: 'Add New Reservation', fr: 'Ajouter une Réservation' })}
                      </h3>
                      <form onSubmit={handleCreateReservation} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'First Name', fr: 'Prénom' })} *
                            </label>
                            <input
                              type="text"
                              value={newReservation.firstName}
                              onChange={(e) => setNewReservation({...newReservation, firstName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Last Name', fr: 'Nom' })} *
                            </label>
                            <input
                              type="text"
                              value={newReservation.lastName}
                              onChange={(e) => setNewReservation({...newReservation, lastName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Email *</label>
                          <input
                            type="email"
                            value={newReservation.email}
                            onChange={(e) => setNewReservation({...newReservation, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Phone', fr: 'Téléphone' })} *
                          </label>
                          <input
                            type="tel"
                            value={newReservation.phone}
                            onChange={(e) => setNewReservation({...newReservation, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Check-in', fr: 'Arrivée' })} *
                            </label>
                            <input
                              type="date"
                              value={newReservation.checkIn}
                              onChange={(e) => setNewReservation({...newReservation, checkIn: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Check-out', fr: 'Départ' })} *
                            </label>
                            <input
                              type="date"
                              value={newReservation.checkOut}
                              onChange={(e) => setNewReservation({...newReservation, checkOut: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Guests', fr: 'Personnes' })} *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={newReservation.guests}
                              onChange={(e) => setNewReservation({...newReservation, guests: parseInt(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Total Price', fr: 'Prix Total' })} *
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newReservation.totalPrice}
                              onChange={(e) => setNewReservation({...newReservation, totalPrice: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Deposit', fr: 'Acompte' })}
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newReservation.depositAmount}
                              onChange={(e) => setNewReservation({...newReservation, depositAmount: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Status', fr: 'Statut' })}
                            </label>
                            <select
                              value={newReservation.status}
                              onChange={(e) => setNewReservation({...newReservation, status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            >
                              <option value="pending">{t({ en: 'Pending', fr: 'En Attente' })}</option>
                              <option value="confirmed">{t({ en: 'Confirmed', fr: 'Confirmée' })}</option>
                              <option value="cancelled">{t({ en: 'Cancelled', fr: 'Annulée' })}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Payment Status', fr: 'Statut Paiement' })}
                            </label>
                            <select
                              value={newReservation.paymentStatus}
                              onChange={(e) => setNewReservation({...newReservation, paymentStatus: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            >
                              <option value="pending">{t({ en: 'Pending', fr: 'En Attente' })}</option>
                              <option value="partial">{t({ en: 'Partial', fr: 'Partiel' })}</option>
                              <option value="completed">{t({ en: 'Completed', fr: 'Complété' })}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Message / Notes', fr: 'Message / Notes' })}
                          </label>
                          <textarea
                            value={newReservation.message}
                            onChange={(e) => setNewReservation({...newReservation, message: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            rows={3}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                          <button
                            type="submit"
                            className="w-full sm:flex-1 bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-lg transition-colors text-sm sm:text-base font-bold"
                          >
                            {t({ en: '✓ Create Reservation', fr: '✓ Créer la Réservation' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReservationModal(false)}
                            className="w-full sm:flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                          >
                            {t({ en: 'Cancel', fr: 'Annuler' })}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Modal de création de facture */}
                {showCreateInvoiceModal && selectedReservationForInvoice && (
                  <InvoiceModal
                    reservation={selectedReservationForInvoice}
                    onClose={() => {
                      setShowCreateInvoiceModal(false);
                      setSelectedReservationForInvoice(null);
                    }}
                    onSuccess={() => {
                      loadInvoices();
                      setShowCreateInvoiceModal(false);
                      setSelectedReservationForInvoice(null);
                    }}
                  />
                )}
              </div>
            )}

            {activeTab === 'accounting' && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t({ en: 'Accounting', fr: 'Comptabilité' })}
                </h2>

                {/* Statistiques financières */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total des recettes */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-4 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">{t({ en: 'Total Income', fr: 'Recettes Totales' })}</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">€0</p>
                        <p className="text-xs text-green-600 mt-1">{t({ en: 'This year', fr: 'Cette année' })}</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>

                  {/* Total des dépenses */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-4 border-2 border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-700 font-medium">{t({ en: 'Total Expenses', fr: 'Dépenses Totales' })}</p>
                        <p className="text-2xl font-bold text-red-900 mt-1">€0</p>
                        <p className="text-xs text-red-600 mt-1">{t({ en: 'This year', fr: 'Cette année' })}</p>
                      </div>
                      <div className="text-3xl">📤</div>
                    </div>
                  </div>

                  {/* Bénéfice net */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-4 border-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">{t({ en: 'Net Profit', fr: 'Bénéfice Net' })}</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">€0</p>
                        <p className="text-xs text-blue-600 mt-1">{t({ en: 'This year', fr: 'Cette année' })}</p>
                      </div>
                      <div className="text-3xl">📊</div>
                    </div>
                  </div>

                  {/* Taux d'occupation */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-4 border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium">{t({ en: 'Occupancy Rate', fr: 'Taux d\'Occupation' })}</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">0%</p>
                        <p className="text-xs text-purple-600 mt-1">{t({ en: 'This year', fr: 'Cette année' })}</p>
                      </div>
                      <div className="text-3xl">🏠</div>
                    </div>
                  </div>
                </div>

                {/* Message informatif */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        {t({ en: 'Accounting Module', fr: 'Module de Comptabilité' })}
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>{t({
                          en: 'This module will help you track all income and expenses related to your chalet. You can categorize transactions, link them to reservations, and generate financial reports.',
                          fr: 'Ce module vous aidera à suivre toutes les recettes et dépenses liées à votre chalet. Vous pouvez catégoriser les transactions, les lier aux réservations et générer des rapports financiers.'
                        })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton d'ajout de transaction */}
                <div className="flex justify-end mb-4">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all">
                    <span className="text-xl">➕</span>
                    <span>{t({ en: 'Add Transaction', fr: 'Ajouter une Transaction' })}</span>
                  </button>
                </div>

                {/* Liste des transactions (vide pour le moment) */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t({ en: 'No transactions yet', fr: 'Aucune transaction pour le moment' })}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t({
                        en: 'Start tracking your finances by adding your first transaction.',
                        fr: 'Commencez à suivre vos finances en ajoutant votre première transaction.'
                      })}
                    </p>
                    <button className="bg-forest-600 text-white px-6 py-2 rounded-lg hover:bg-forest-700 inline-flex items-center gap-2">
                      <span>➕</span>
                      <span>{t({ en: 'Add Transaction', fr: 'Ajouter une Transaction' })}</span>
                    </button>
                  </div>
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
                          title={t({ en: 'Edit user information', fr: 'Modifier les informations utilisateur' })}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium"
                          title={t({ en: 'Permanently delete this user', fr: 'Supprimer définitivement cet utilisateur' })}
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
                                title={t({ en: 'Edit user information', fr: 'Modifier les informations utilisateur' })}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800"
                                title={t({ en: 'Permanently delete this user', fr: 'Supprimer définitivement cet utilisateur' })}
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
                            {t({ en: 'First Name', fr: 'Prénom' })} *
                          </label>
                          <input
                            type="text"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder={t({ en: 'John', fr: 'Jean' })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Last Name', fr: 'Nom' })} *
                          </label>
                          <input
                            type="text"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder={t({ en: 'Doe', fr: 'Dupont' })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email *</label>
                          <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder="user@example.com"
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
                            placeholder="+33 6 12 34 56 78"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Password', fr: 'Mot de passe' })} *
                          </label>
                          <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder="••••••••"
                            required
                            minLength={8}
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

                {/* Modal d'édition d'utilisateur */}
                {editingUser && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {t({ en: 'Edit User', fr: 'Modifier l\'Utilisateur' })}
                      </h3>
                      <form onSubmit={handleUpdateUser} className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'First Name', fr: 'Prénom' })} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editingUser.firstName}
                            onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder={t({ en: 'John', fr: 'Jean' })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Last Name', fr: 'Nom' })} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editingUser.lastName}
                            onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder={t({ en: 'Doe', fr: 'Dupont' })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder="user@example.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Phone', fr: 'Téléphone' })}
                          </label>
                          <input
                            type="tel"
                            value={editingUser.phone || ''}
                            onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'New Password (optional)', fr: 'Nouveau mot de passe (optionnel)' })}
                          </label>
                          <input
                            type="password"
                            value={editingUser.password || ''}
                            onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            placeholder={t({ en: 'Leave blank to keep current', fr: 'Laisser vide pour conserver' })}
                            minLength={6}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Role', fr: 'Rôle' })} <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
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
                            {t({ en: 'Save Changes', fr: 'Enregistrer' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="w-full sm:flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                          >
                            {t({ en: 'Cancel', fr: 'Annuler' })}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Modal d'envoi de message */}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t({ en: 'Messages', fr: 'Messages' })}
                  </h2>
                  <button
                    onClick={() => setShowSendMessageModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors font-bold text-sm"
                  >
                    💬 {t({ en: 'Send Message', fr: 'Envoyer Message' })}
                  </button>
                </div>
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
                            title={t({ en: 'Reply to this message', fr: 'Répondre à ce message' })}
                          >
                            💬 {t({ en: 'Reply', fr: 'Répondre' })}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message.id, 'internal')}
                            className="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded transition-colors"
                            title={t({ en: 'Delete this message', fr: 'Supprimer ce message' })}
                          >
                            🗑️ {t({ en: 'Delete', fr: 'Supprimer' })}
                          </button>
                        </div>
                        <button
                          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded transition-colors"
                          title={t({ en: 'Mark this message as read', fr: 'Marquer ce message comme lu' })}
                        >
                          ✓ {t({ en: 'Mark as read', fr: 'Marquer comme lu' })}
                        </button>
                      </div>

                      {/* Desktop Actions - Inline */}
                      <div className="hidden sm:flex gap-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-sm bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded transition-colors"
                          title={t({ en: 'Reply to this message', fr: 'Répondre à ce message' })}
                        >
                          {t({ en: 'Reply', fr: 'Répondre' })}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id, 'internal')}
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded transition-colors"
                          title={t({ en: 'Delete this message', fr: 'Supprimer ce message' })}
                        >
                          {t({ en: 'Delete', fr: 'Supprimer' })}
                        </button>
                        <button
                          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors"
                          title={t({ en: 'Mark this message as read', fr: 'Marquer ce message comme lu' })}
                        >
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

                {/* Modal d'envoi de message */}
                {showSendMessageModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {t({ en: 'Send Message to Users', fr: 'Envoyer un Message aux Utilisateurs' })}
                      </h3>
                      <form onSubmit={handleSendMessage} className="space-y-3 sm:space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">
                              {t({ en: 'Recipients', fr: 'Destinataires' })}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedUserIds.length === users.length) {
                                  setSelectedUserIds([]);
                                } else {
                                  setSelectedUserIds(users.map(u => u.id));
                                }
                              }}
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {selectedUserIds.length === users.length
                                ? t({ en: '✓ Unselect All', fr: '✓ Désélectionner tout' })
                                : t({ en: 'Select All', fr: 'Sélectionner tout' })
                              }
                            </button>
                          </div>
                          <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                            {users.map(user => (
                              <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedUserIds.includes(user.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUserIds([...selectedUserIds, user.id]);
                                    } else {
                                      setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">
                                  {user.firstName} {user.lastName} ({user.email})
                                </span>
                              </label>
                            ))}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {selectedUserIds.length} {t({ en: 'recipient(s) selected', fr: 'destinataire(s) sélectionné(s)' })}
                            </span>
                            {selectedUserIds.length === users.length && (
                              <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                📢 {t({ en: 'All users', fr: 'Tous les utilisateurs' })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Subject', fr: 'Sujet' })}
                          </label>
                          <input
                            type="text"
                            value={messageForm.subject}
                            onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            required
                            placeholder={t({ en: 'Message subject', fr: 'Sujet du message' })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {t({ en: 'Message', fr: 'Message' })}
                          </label>
                          <textarea
                            value={messageForm.content}
                            onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            rows={6}
                            required
                            placeholder={t({ en: 'Write your message here...', fr: 'Écrivez votre message ici...' })}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                          <button
                            type="submit"
                            disabled={selectedUserIds.length === 0}
                            className="w-full sm:flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t({ en: 'Send Message', fr: 'Envoyer le Message' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSendMessageModal(false);
                              setSelectedUserIds([]);
                              setMessageForm({ subject: '', content: '' });
                            }}
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

            {activeTab === 'invoices' && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t({ en: 'Invoices', fr: 'Factures' })}
                </h2>

                {/* Filtres de recherche */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtre par statut */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t({ en: 'Status', fr: 'Statut' })}
                      </label>
                      <select
                        value={invoiceStatusFilter}
                        onChange={(e) => setInvoiceStatusFilter(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      >
                        <option value="all">{t({ en: '📋 All', fr: '📋 Tous' })}</option>
                        <option value="draft">{t({ en: '📝 Draft', fr: '📝 Brouillon' })}</option>
                        <option value="sent">{t({ en: '📤 Sent', fr: '📤 Envoyée' })}</option>
                        <option value="partial">{t({ en: '⏳ Partial', fr: '⏳ Partielle' })}</option>
                        <option value="paid">{t({ en: '✅ Paid', fr: '✅ Payée' })}</option>
                        <option value="cancelled">{t({ en: '❌ Cancelled', fr: '❌ Annulée' })}</option>
                      </select>
                    </div>

                    {/* Filtre par type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t({ en: 'Type', fr: 'Type' })}
                      </label>
                      <select
                        value={invoiceTypeFilter}
                        onChange={(e) => setInvoiceTypeFilter(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      >
                        <option value="all">{t({ en: '📋 All', fr: '📋 Tous' })}</option>
                        <option value="deposit">{t({ en: '💰 Deposit', fr: '💰 Acompte' })}</option>
                        <option value="balance">{t({ en: '💳 Balance', fr: '💳 Solde' })}</option>
                        <option value="full">{t({ en: '💵 Full Payment', fr: '💵 Paiement complet' })}</option>
                      </select>
                    </div>

                    {/* Recherche par client */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t({ en: 'Search by client', fr: 'Rechercher par client' })}
                      </label>
                      <input
                        type="text"
                        placeholder={t({ en: 'Client name or email...', fr: 'Nom ou email du client...' })}
                        value={invoiceSearchTerm || ''}
                        onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Résumé des filtres actifs */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {(invoiceStatusFilter !== 'all' || invoiceTypeFilter !== 'all' || invoiceSearchTerm) && (
                      <>
                        <span className="text-sm text-gray-600">
                          {t({ en: 'Active filters:', fr: 'Filtres actifs :' })}
                        </span>
                        {invoiceStatusFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {invoiceStatusFilter}
                            <button
                              onClick={() => setInvoiceStatusFilter('all')}
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {invoiceTypeFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {invoiceTypeFilter}
                            <button
                              onClick={() => setInvoiceTypeFilter('all')}
                              className="hover:text-green-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {invoiceSearchTerm && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            &quot;{invoiceSearchTerm}&quot;
                            <button
                              onClick={() => setInvoiceSearchTerm('')}
                              className="hover:text-purple-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setInvoiceStatusFilter('all');
                            setInvoiceTypeFilter('all');
                            setInvoiceSearchTerm('');
                          }}
                          className="text-xs text-gray-600 hover:text-gray-800 underline"
                        >
                          {t({ en: 'Clear all', fr: 'Tout effacer' })}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4">
                  {invoices
                    .filter(invoice => {
                      // Filtre par statut
                      if (invoiceStatusFilter !== 'all' && invoice.status !== invoiceStatusFilter) {
                        return false;
                      }
                      // Filtre par type
                      if (invoiceTypeFilter !== 'all' && invoice.type !== invoiceTypeFilter) {
                        return false;
                      }
                      // Filtre par recherche client
                      if (invoiceSearchTerm) {
                        const searchLower = invoiceSearchTerm.toLowerCase();
                        const matchName = invoice.clientName?.toLowerCase().includes(searchLower);
                        const matchEmail = invoice.clientEmail?.toLowerCase().includes(searchLower);
                        return matchName || matchEmail;
                      }
                      return true;
                    })
                    .map((invoice, index) => (
                    <div key={invoice.id || index} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">INV-{invoice.invoiceNumber || invoice.id}</h3>
                          <p className="text-sm text-gray-600">{invoice.clientName}</p>
                          <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : invoice.status === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invoice.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status === 'paid'
                            ? t({ en: 'Paid', fr: 'Payée' })
                            : invoice.status === 'sent'
                            ? t({ en: 'Sent', fr: 'Envoyée' })
                            : invoice.status === 'partial'
                            ? t({ en: 'Partial', fr: 'Partielle' })
                            : invoice.status === 'cancelled'
                            ? t({ en: 'Cancelled', fr: 'Annulée' })
                            : t({ en: 'Draft', fr: 'Brouillon' })
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
                          title={t({ en: 'View invoice details', fr: 'Voir les détails de la facture' })}
                        >
                          👁️ Voir
                        </button>
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="flex-1 bg-forest-100 text-forest-700 px-3 py-2 rounded font-medium"
                          title={t({ en: 'Edit invoice', fr: 'Modifier la facture' })}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded font-medium"
                          title={t({ en: 'Download PDF', fr: 'Télécharger le PDF' })}
                        >
                          📄 PDF
                        </button>
                      </div>
                    </div>
                  ))}

                  {invoices
                    .filter(invoice => {
                      if (invoiceStatusFilter !== 'all' && invoice.status !== invoiceStatusFilter) return false;
                      if (invoiceTypeFilter !== 'all' && invoice.type !== invoiceTypeFilter) return false;
                      if (invoiceSearchTerm) {
                        const searchLower = invoiceSearchTerm.toLowerCase();
                        const matchName = invoice.clientName?.toLowerCase().includes(searchLower);
                        const matchEmail = invoice.clientEmail?.toLowerCase().includes(searchLower);
                        return matchName || matchEmail;
                      }
                      return true;
                    }).length === 0 && (
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
                        {invoices
                          .filter(invoice => {
                            if (invoiceStatusFilter !== 'all' && invoice.status !== invoiceStatusFilter) return false;
                            if (invoiceTypeFilter !== 'all' && invoice.type !== invoiceTypeFilter) return false;
                            if (invoiceSearchTerm) {
                              const searchLower = invoiceSearchTerm.toLowerCase();
                              const matchName = invoice.clientName?.toLowerCase().includes(searchLower);
                              const matchEmail = invoice.clientEmail?.toLowerCase().includes(searchLower);
                              return matchName || matchEmail;
                            }
                            return true;
                          })
                          .map((invoice, index) => (
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
                                invoice.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : invoice.status === 'sent'
                                  ? 'bg-blue-100 text-blue-800'
                                  : invoice.status === 'partial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : invoice.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {invoice.status === 'paid'
                                  ? t({ en: 'Paid', fr: 'Payée' })
                                  : invoice.status === 'sent'
                                  ? t({ en: 'Sent', fr: 'Envoyée' })
                                  : invoice.status === 'partial'
                                  ? t({ en: 'Partial', fr: 'Partielle' })
                                  : invoice.status === 'cancelled'
                                  ? t({ en: 'Cancelled', fr: 'Annulée' })
                                  : t({ en: 'Draft', fr: 'Brouillon' })
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

                {/* Paramètres de tarification globaux */}
                <div className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                    {t({ en: 'General Pricing Settings', fr: 'Paramètres de Tarification Généraux' })}
                  </h3>
                  {pricingSettings && (
                    <form onSubmit={handleUpdatePricingSettings} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t({ en: 'Cleaning Fee (€)', fr: 'Frais de Ménage (€)' })}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={pricingSettings.cleaningFee}
                            onChange={(e) => setPricingSettings({...pricingSettings, cleaningFee: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t({ en: 'Linen per Person (€)', fr: 'Linge par Personne (€)' })}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={pricingSettings.linenPerPerson}
                            onChange={(e) => setPricingSettings({...pricingSettings, linenPerPerson: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t({ en: 'Deposit Amount (€)', fr: 'Caution (€)' })}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={pricingSettings.depositAmount}
                            onChange={(e) => setPricingSettings({...pricingSettings, depositAmount: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t({ en: 'Default High Season (€/night)', fr: 'Haute Saison par Défaut (€/nuit)' })}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={pricingSettings.defaultHighSeasonPrice}
                            onChange={(e) => setPricingSettings({...pricingSettings, defaultHighSeasonPrice: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t({ en: 'Default Low Season (€/night)', fr: 'Basse Saison par Défaut (€/nuit)' })}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={pricingSettings.defaultLowSeasonPrice}
                            onChange={(e) => setPricingSettings({...pricingSettings, defaultLowSeasonPrice: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t({ en: 'Default Minimum Stay (nights)', fr: 'Séjour Minimum par Défaut (nuits)' })}
                          </label>
                          <input
                            type="number"
                            value={pricingSettings.defaultMinimumStay}
                            onChange={(e) => setPricingSettings({...pricingSettings, defaultMinimumStay: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors"
                      >
                        {t({ en: 'Save Settings', fr: 'Enregistrer les Paramètres' })}
                      </button>
                    </form>
                  )}
                </div>

                {/* Gestion des saisons */}
                <div className="bg-white border rounded-lg p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-base sm:text-lg">
                      {t({ en: 'Season Periods', fr: 'Périodes de Saison' })}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingSeason({
                          name: '',
                          startDate: '',
                          endDate: '',
                          seasonType: 'high',
                          pricePerNight: pricingSettings?.defaultHighSeasonPrice || 410,
                          minimumStay: 7,
                          sundayToSunday: true,
                          year: new Date().getFullYear(),
                          isActive: true
                        });
                        setShowSeasonModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm"
                    >
                      + {t({ en: 'Add Season', fr: 'Ajouter Saison' })}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold text-sm">{t({ en: 'Name', fr: 'Nom' })}</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">{t({ en: 'Dates', fr: 'Dates' })}</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">{t({ en: 'Type', fr: 'Type' })}</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">{t({ en: 'Price/Night', fr: 'Prix/Nuit' })}</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">{t({ en: 'Min Stay', fr: 'Séjour Min' })}</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">{t({ en: 'Actions', fr: 'Actions' })}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seasons.map((season: any) => (
                          <tr key={season.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2 text-sm">{season.name}</td>
                            <td className="py-3 px-2 text-sm">
                              {new Date(season.startDate).toLocaleDateString('fr-FR')} - {new Date(season.endDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${season.seasonType === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                {season.seasonType === 'high' ? t({ en: 'High', fr: 'Haute' }) : t({ en: 'Low', fr: 'Basse' })}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-sm font-semibold">{season.pricePerNight}€</td>
                            <td className="py-3 px-2 text-sm">
                              {season.minimumStay} {t({ en: 'nights', fr: 'nuits' })}
                              {season.sundayToSunday && ' (Dim-Dim)'}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingSeason(season);
                                    setShowSeasonModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                  title={t({ en: 'Edit season', fr: 'Modifier la saison' })}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteSeason(season.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  title={t({ en: 'Delete season', fr: 'Supprimer la saison' })}
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

                {/* Modal d'ajout/édition de saison */}
                {showSeasonModal && editingSeason && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {editingSeason.id
                          ? t({ en: 'Edit Season', fr: 'Modifier la Saison' })
                          : t({ en: 'Add Season', fr: 'Ajouter une Saison' })}
                      </h3>
                      <form onSubmit={handleCreateOrUpdateSeason} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Season Name', fr: 'Nom de la Saison' })}
                            </label>
                            <input
                              type="text"
                              value={editingSeason.name}
                              onChange={(e) => setEditingSeason({...editingSeason, name: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                              placeholder="Ex: Vacances de Noël 2025"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Start Date', fr: 'Date de Début' })}
                            </label>
                            <input
                              type="date"
                              value={editingSeason.startDate?.toString().split('T')[0] || ''}
                              onChange={(e) => setEditingSeason({...editingSeason, startDate: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'End Date', fr: 'Date de Fin' })}
                            </label>
                            <input
                              type="date"
                              value={editingSeason.endDate?.toString().split('T')[0] || ''}
                              onChange={(e) => setEditingSeason({...editingSeason, endDate: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Season Type', fr: 'Type de Saison' })}
                            </label>
                            <select
                              value={editingSeason.seasonType}
                              onChange={(e) => setEditingSeason({...editingSeason, seasonType: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg"
                            >
                              <option value="high">{t({ en: 'High Season', fr: 'Haute Saison' })}</option>
                              <option value="low">{t({ en: 'Low Season', fr: 'Basse Saison' })}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Price per Night (€)', fr: 'Prix par Nuit (€)' })}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingSeason.pricePerNight}
                              onChange={(e) => setEditingSeason({...editingSeason, pricePerNight: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Minimum Stay (nights)', fr: 'Séjour Minimum (nuits)' })}
                            </label>
                            <input
                              type="number"
                              value={editingSeason.minimumStay}
                              onChange={(e) => setEditingSeason({...editingSeason, minimumStay: parseInt(e.target.value)})}
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t({ en: 'Year', fr: 'Année' })}
                            </label>
                            <input
                              type="number"
                              value={editingSeason.year}
                              onChange={(e) => setEditingSeason({...editingSeason, year: parseInt(e.target.value)})}
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSeason.sundayToSunday}
                                onChange={(e) => setEditingSeason({...editingSeason, sundayToSunday: e.target.checked})}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {t({ en: 'Sunday to Sunday only', fr: 'Dimanche à Dimanche uniquement' })}
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSeason.isActive}
                                onChange={(e) => setEditingSeason({...editingSeason, isActive: e.target.checked})}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {t({ en: 'Active', fr: 'Active' })}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                          >
                            {editingSeason.id ? t({ en: 'Save', fr: 'Enregistrer' }) : t({ en: 'Create', fr: 'Créer' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSeasonModal(false);
                              setEditingSeason(null);
                            }}
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
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'First Name', fr: 'Prénom' })} *
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder={t({ en: 'John', fr: 'Jean' })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Last Name', fr: 'Nom' })} *
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder={t({ en: 'Doe', fr: 'Dupont' })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Email', fr: 'Email' })} *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Phone', fr: 'Téléphone' })}
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t({ en: 'Password', fr: 'Mot de passe' })} *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
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
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setNewUser({ email: '', firstName: '', lastName: '', phone: '', password: '', role: 'client' });
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t({ en: 'Cancel', fr: 'Annuler' })}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors"
                >
                  {t({ en: 'Create User', fr: 'Créer' })}
                </button>
              </div>
            </form>
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
