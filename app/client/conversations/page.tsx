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
  unreadByClient: number;
  lastMessageAt: string;
  lastMessageFrom: 'client' | 'admin' | null;
  _count: {
    messages: number;
  };
}

export default function ClientConversationsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'archived'>('all');
  const [showNewConversationForm, setShowNewConversationForm] = useState(false);
  const [newConversationForm, setNewConversationForm] = useState({
    subject: '',
    content: '',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    } else if (!authLoading && isAuthenticated) {
      fetchConversations();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSending(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newConversationForm.subject,
          content: newConversationForm.content,
          fromName: `${user.firstName} ${user.lastName}`,
          fromEmail: user.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(t({
          en: 'Message sent successfully!',
          fr: 'Message envoyé avec succès !'
        }));
        setNewConversationForm({ subject: '', content: '' });
        setShowNewConversationForm(false);
        fetchConversations();
        // Redirect to the new conversation
        router.push(`/client/conversations/${data.id}`);
      } else {
        throw new Error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert(t({
        en: 'Error sending message. Please try again.',
        fr: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
      }));
    } finally {
      setSending(false);
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

  if (!isAuthenticated || !user) {
    return null;
  }

  const filteredConversations = conversations.filter(conv => {
    if (statusFilter === 'all') return true;
    return conv.status === statusFilter;
  });

  const unreadCount = conversations.reduce((acc, conv) => acc + conv.unreadByClient, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {t({ en: 'My Conversations', fr: 'Mes Conversations' })}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                {t({
                  en: 'View and manage your conversations with Chalet-Balmotte810',
                  fr: 'Consultez et gérez vos conversations avec Chalet-Balmotte810'
                })}
              </p>
            </div>
            <Link
              href="/client/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>←</span>
              <span>{t({ en: 'Dashboard', fr: 'Tableau de Bord' })}</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
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
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {unreadCount}
            </div>
            <div className="text-xs text-gray-600">
              {t({ en: 'Unread', fr: 'Non Lus' })}
            </div>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {conversations.filter(c => c.status === 'open').length}
            </div>
            <div className="text-xs text-gray-600">
              {t({ en: 'Active', fr: 'Actives' })}
            </div>
          </div>
        </div>

        {/* Filters and New Conversation Button */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'All', fr: 'Tout' })}
              </button>
              <button
                onClick={() => setStatusFilter('open')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'open'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'Open', fr: 'Ouvertes' })}
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  statusFilter === 'closed'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t({ en: 'Closed', fr: 'Fermées' })}
              </button>
            </div>

            <button
              onClick={() => setShowNewConversationForm(!showNewConversationForm)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {showNewConversationForm ? '✕' : '+'} {t({ en: 'New Message', fr: 'Nouveau Message' })}
            </button>
          </div>
        </div>

        {/* New Conversation Form */}
        {showNewConversationForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {t({ en: 'Start a New Conversation', fr: 'Démarrer une Nouvelle Conversation' })}
            </h3>
            <form onSubmit={handleCreateConversation} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Subject', fr: 'Sujet' })} *
                </label>
                <input
                  type="text"
                  required
                  value={newConversationForm.subject}
                  onChange={(e) => setNewConversationForm({ ...newConversationForm, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t({
                    en: 'What is your message about?',
                    fr: 'Quel est l\'objet de votre message ?'
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Message', fr: 'Message' })} *
                </label>
                <textarea
                  required
                  rows={6}
                  value={newConversationForm.content}
                  onChange={(e) => setNewConversationForm({ ...newConversationForm, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t({
                    en: 'Type your message here...',
                    fr: 'Tapez votre message ici...'
                  })}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {sending
                    ? t({ en: 'Sending...', fr: 'Envoi...' })
                    : t({ en: 'Send Message', fr: 'Envoyer le Message' })}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewConversationForm(false);
                    setNewConversationForm({ subject: '', content: '' });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t({ en: 'Cancel', fr: 'Annuler' })}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Conversations List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {statusFilter === 'all'
              ? t({ en: 'All Conversations', fr: 'Toutes les Conversations' })
              : statusFilter === 'open'
              ? t({ en: 'Open Conversations', fr: 'Conversations Ouvertes' })
              : t({ en: 'Closed Conversations', fr: 'Conversations Fermées' })}
            <span className="ml-2 text-gray-500 text-base font-normal">
              ({filteredConversations.length})
            </span>
          </h2>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600 text-lg mb-2">
                {t({
                  en: 'No conversations yet',
                  fr: 'Aucune conversation pour le moment'
                })}
              </p>
              <p className="text-gray-500 text-sm">
                {t({
                  en: 'Start a conversation with us!',
                  fr: 'Commencez une conversation avec nous !'
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/client/conversations/${conversation.id}`}
                  className={`block border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                    conversation.unreadByClient > 0
                      ? 'border-blue-300 bg-blue-50 hover:border-blue-400'
                      : 'border-gray-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">
                          {conversation.subject}
                        </h3>
                        {conversation.unreadByClient > 0 && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                            {conversation.unreadByClient} {t({ en: 'new', fr: 'nouveau(x)' })}
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
                      <div className="text-sm text-gray-600">
                        <span>
                          {conversation._count.messages} {t({ en: 'messages', fr: 'messages' })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {t({ en: 'Last message', fr: 'Dernier message' })}:{' '}
                          {new Date(conversation.lastMessageAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {conversation.lastMessageFrom && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="font-semibold">
                              {conversation.lastMessageFrom === 'admin'
                                ? t({ en: 'from Admin', fr: 'de l\'Admin' })
                                : t({ en: 'from you', fr: 'de vous' })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
