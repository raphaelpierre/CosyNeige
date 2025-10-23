'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';

interface Conversation {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'archived';
  unreadByAdmin: number;
  unreadByClient: number;
  lastMessageAt: string;
  lastMessageFrom: 'client' | 'admin' | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    messages: number;
  };
}

export default function AdminConversationsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'open' | 'closed' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'unread-first' | 'newest' | 'oldest'>('unread-first');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    } else if (!authLoading && user?.role !== 'admin') {
      router.push('/client/dashboard');
    } else if (!authLoading && isAuthenticated && user?.role === 'admin') {
      fetchConversations();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (conversationId: string, newStatus: 'open' | 'closed' | 'archived') => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchConversations(); // Refresh list
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(t({
        en: 'Error updating status. Please try again.',
        fr: 'Erreur lors de la mise à jour du statut. Veuillez réessayer.'
      }));
    }
  };

  const handleMarkAsRead = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAsRead: true }),
      });

      if (response.ok) {
        fetchConversations(); // Refresh list
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      alert(t({
        en: 'Error marking as read. Please try again.',
        fr: 'Erreur lors du marquage comme lu. Veuillez réessayer.'
      }));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            {t({ en: 'Loading...', fr: 'Chargement...' })}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  const filteredConversations = conversations
    .filter(conv => {
      // Filter by unread
      if (statusFilter === 'unread' && conv.unreadByAdmin === 0) return false;
      // Filter by status
      if (statusFilter !== 'all' && statusFilter !== 'unread' && conv.status !== statusFilter) return false;
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          conv.subject.toLowerCase().includes(search) ||
          conv.user.email.toLowerCase().includes(search) ||
          `${conv.user.firstName} ${conv.user.lastName}`.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'unread-first') {
        // Unread first, then by date
        if (a.unreadByAdmin > 0 && b.unreadByAdmin === 0) return -1;
        if (a.unreadByAdmin === 0 && b.unreadByAdmin > 0) return 1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      } else if (sortBy === 'newest') {
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      } else { // oldest
        return new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime();
      }
    });

  const unreadConversationsCount = conversations.filter(c => c.unreadByAdmin > 0).length;
  const openCount = conversations.filter(c => c.status === 'open').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {t({ en: 'Client Conversations', fr: 'Conversations Clients' })}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                {t({
                  en: 'Manage all client conversations and messages',
                  fr: 'Gérez toutes les conversations et messages clients'
                })}
              </p>
            </div>
            <Link
              href="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>←</span>
              <span>{t({ en: 'Admin Dashboard', fr: 'Dashboard Admin' })}</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {conversations.length}
            </div>
            <div className="text-xs text-gray-600">
              {t({ en: 'Total', fr: 'Total' })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center relative">
            <div className="text-3xl mb-2">🔔</div>
            <div className="text-2xl font-bold text-red-600 mb-1">
              {unreadConversationsCount}
            </div>
            <div className="text-xs text-gray-600">
              {t({ en: 'Unread', fr: 'Non Lues' })}
            </div>
            {unreadConversationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {openCount}
            </div>
            <div className="text-xs text-gray-600">
              {t({ en: 'Open', fr: 'Ouvertes' })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {conversations.reduce((acc, c) => acc + c._count.messages, 0)}
            </div>
            <div className="text-xs text-gray-600">
              {t({ en: 'Messages', fr: 'Messages' })}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'All', fr: 'Tout' })} ({conversations.length})
              </button>
              <button
                onClick={() => setStatusFilter('unread')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'unread'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                🔔 {t({ en: 'Unread', fr: 'Non Lues' })} ({unreadConversationsCount})
              </button>
              <button
                onClick={() => setStatusFilter('open')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'open'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'Open', fr: 'Ouvertes' })} ({openCount})
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'closed'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'Closed', fr: 'Fermées' })} ({conversations.filter(c => c.status === 'closed').length})
              </button>
              <button
                onClick={() => setStatusFilter('archived')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'archived'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'Archived', fr: 'Archivées' })} ({conversations.filter(c => c.status === 'archived').length})
              </button>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t({
                    en: 'Search by subject, name or email...',
                    fr: 'Rechercher par sujet, nom ou email...'
                  })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'unread-first' | 'newest' | 'oldest')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent font-semibold text-sm"
                >
                  <option value="unread-first">
                    {t({ en: '🔔 Unread First', fr: '🔔 Non Lues D\'abord' })}
                  </option>
                  <option value="newest">
                    {t({ en: '⬇️ Newest First', fr: '⬇️ Plus Récentes' })}
                  </option>
                  <option value="oldest">
                    {t({ en: '⬆️ Oldest First', fr: '⬆️ Plus Anciennes' })}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {statusFilter === 'all'
              ? t({ en: 'All Conversations', fr: 'Toutes les Conversations' })
              : statusFilter === 'unread'
              ? t({ en: 'Unread Conversations', fr: 'Conversations Non Lues' })
              : statusFilter === 'open'
              ? t({ en: 'Open Conversations', fr: 'Conversations Ouvertes' })
              : statusFilter === 'closed'
              ? t({ en: 'Closed Conversations', fr: 'Conversations Fermées' })
              : t({ en: 'Archived Conversations', fr: 'Conversations Archivées' })}
            <span className="ml-2 text-gray-500 text-base font-normal">
              ({filteredConversations.length})
            </span>
          </h2>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600 text-lg mb-2">
                {t({
                  en: 'No conversations found',
                  fr: 'Aucune conversation trouvée'
                })}
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? t({ en: 'Try a different search term', fr: 'Essayez un autre terme de recherche' })
                  : t({ en: 'Conversations will appear here', fr: 'Les conversations apparaîtront ici' })}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`border-2 rounded-xl p-5 transition-all ${
                    conversation.unreadByAdmin > 0
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-slate-700 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Left: Conversation Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Link
                          href={`/admin/conversations/${conversation.id}`}
                          className="font-bold text-slate-900 text-lg hover:text-blue-600 transition-colors"
                        >
                          {conversation.subject}
                        </Link>
                        {conversation.unreadByAdmin > 0 && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                            {conversation.unreadByAdmin} {t({ en: 'new', fr: 'nouveau(x)' })}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          conversation.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : conversation.status === 'closed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {conversation.status === 'open'
                            ? t({ en: 'Open', fr: 'Ouverte' })
                            : conversation.status === 'closed'
                            ? t({ en: 'Closed', fr: 'Fermée' })
                            : t({ en: 'Archived', fr: 'Archivée' })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">👤</span>
                          <span>{conversation.user.firstName} {conversation.user.lastName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-blue-600">{conversation.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {conversation._count.messages} {t({ en: 'messages', fr: 'messages' })}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>
                            {t({ en: 'Last message', fr: 'Dernier message' })}:{' '}
                            {new Date(conversation.lastMessageAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {conversation.lastMessageFrom && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="font-semibold">
                                {conversation.lastMessageFrom === 'admin'
                                  ? t({ en: 'by you', fr: 'par vous' })
                                  : t({ en: 'by client', fr: 'par le client' })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/conversations/${conversation.id}`}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap"
                      >
                        {t({ en: 'View', fr: 'Voir' })} →
                      </Link>
                      {conversation.unreadByAdmin > 0 && (
                        <button
                          onClick={() => handleMarkAsRead(conversation.id)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap"
                        >
                          ✓ {t({ en: 'Mark Read', fr: 'Marquer Lu' })}
                        </button>
                      )}
                      {conversation.status !== 'archived' && (
                        <button
                          onClick={() => handleUpdateStatus(conversation.id, 'archived')}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap"
                        >
                          📦 {t({ en: 'Archive', fr: 'Archiver' })}
                        </button>
                      )}
                      {conversation.status !== 'closed' && conversation.status !== 'archived' && (
                        <button
                          onClick={() => handleUpdateStatus(conversation.id, 'closed')}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap"
                        >
                          {t({ en: 'Close', fr: 'Fermer' })}
                        </button>
                      )}
                      {conversation.status === 'closed' && (
                        <button
                          onClick={() => handleUpdateStatus(conversation.id, 'open')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap"
                        >
                          {t({ en: 'Reopen', fr: 'Rouvrir' })}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
