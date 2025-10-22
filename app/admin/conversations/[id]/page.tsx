'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';

interface ConversationMessage {
  id: string;
  fromName: string;
  fromEmail: string;
  isFromAdmin: boolean;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'archived';
  createdAt: string;
  messages: ConversationMessage[];
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  reservation?: {
    id: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    status: string;
  };
}

export default function AdminConversationDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id as string;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    } else if (!authLoading && user?.role !== 'admin') {
      router.push('/client/dashboard');
    } else if (!authLoading && isAuthenticated && user?.role === 'admin' && conversationId) {
      fetchConversation();
    }
  }, [authLoading, isAuthenticated, user, conversationId, router]);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
      } else if (response.status === 404) {
        alert(t({
          en: 'Conversation not found',
          fr: 'Conversation introuvable'
        }));
        router.push('/admin/conversations');
      } else {
        console.error('Failed to fetch conversation');
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          fromName: `${user.firstName} ${user.lastName}`,
          fromEmail: user.email,
          isFromAdmin: true,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        fetchConversation(); // Refresh conversation
        alert(t({
          en: 'Reply sent successfully!',
          fr: 'Réponse envoyée avec succès !'
        }));
      } else {
        throw new Error('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert(t({
        en: 'Error sending reply. Please try again.',
        fr: 'Erreur lors de l\'envoi de la réponse. Veuillez réessayer.'
      }));
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'open' | 'closed' | 'archived') => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchConversation(); // Refresh conversation
        alert(t({
          en: 'Status updated successfully!',
          fr: 'Statut mis à jour avec succès !'
        }));
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(t({
        en: 'Error updating status. Please try again.',
        fr: 'Erreur lors de la mise à jour du statut. Veuillez réessayer.'
      }));
    } finally {
      setUpdatingStatus(false);
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

  if (!isAuthenticated || !user || user.role !== 'admin' || !conversation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <Link
              href="/admin/conversations"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <span>←</span>
              <span>{t({ en: 'Back to Conversations', fr: 'Retour aux Conversations' })}</span>
            </Link>
            <div className="flex gap-2">
              {conversation.status !== 'open' && (
                <button
                  onClick={() => handleUpdateStatus('open')}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {t({ en: 'Reopen', fr: 'Rouvrir' })}
                </button>
              )}
              {conversation.status !== 'closed' && (
                <button
                  onClick={() => handleUpdateStatus('closed')}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {t({ en: 'Close', fr: 'Fermer' })}
                </button>
              )}
              {conversation.status !== 'archived' && (
                <button
                  onClick={() => handleUpdateStatus('archived')}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {t({ en: 'Archive', fr: 'Archiver' })}
                </button>
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {conversation.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-slate-300 text-sm">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              conversation.status === 'open'
                ? 'bg-green-500 text-white'
                : conversation.status === 'closed'
                ? 'bg-gray-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}>
              {conversation.status === 'open'
                ? t({ en: 'Open', fr: 'Ouverte' })
                : conversation.status === 'closed'
                ? t({ en: 'Closed', fr: 'Fermée' })
                : t({ en: 'Archived', fr: 'Archivée' })}
            </span>
            <span>
              {t({ en: 'Started on', fr: 'Démarrée le' })}{' '}
              {new Date(conversation.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span>•</span>
            <span>{conversation.messages.length} {t({ en: 'messages', fr: 'messages' })}</span>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {t({ en: 'Client Information', fr: 'Informations Client' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                {t({ en: 'Name', fr: 'Nom' })}
              </div>
              <div className="font-semibold text-slate-900">
                {conversation.user.firstName} {conversation.user.lastName}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">
                {t({ en: 'Email', fr: 'Email' })}
              </div>
              <div className="font-semibold text-blue-600">
                <a href={`mailto:${conversation.user.email}`}>{conversation.user.email}</a>
              </div>
            </div>
            {conversation.user.phone && (
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  {t({ en: 'Phone', fr: 'Téléphone' })}
                </div>
                <div className="font-semibold text-slate-900">
                  <a href={`tel:${conversation.user.phone}`}>{conversation.user.phone}</a>
                </div>
              </div>
            )}
            {conversation.reservation && (
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  {t({ en: 'Related Reservation', fr: 'Réservation Associée' })}
                </div>
                <div className="font-semibold text-slate-900">
                  <Link
                    href={`/admin?reservation=${conversation.reservation.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {new Date(conversation.reservation.checkIn).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}{' '}
                    - {new Date(conversation.reservation.checkOut).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {t({ en: 'Conversation History', fr: 'Historique de la Conversation' })}
          </h2>
          <div className="space-y-6">
            {conversation.messages.map((message, index) => (
              <div
                key={message.id}
                className={`relative ${
                  message.isFromAdmin ? 'pl-0' : 'pl-0'
                }`}
              >
                {/* Timeline connector */}
                {index < conversation.messages.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                )}

                <div className={`flex gap-4 ${
                  message.isFromAdmin ? 'flex-row' : 'flex-row'
                }`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    message.isFromAdmin
                      ? 'bg-slate-700 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {message.isFromAdmin ? '👨‍💼' : message.fromName.charAt(0).toUpperCase()}
                  </div>

                  {/* Message content */}
                  <div className="flex-1">
                    <div className={`rounded-2xl p-5 ${
                      message.isFromAdmin
                        ? 'bg-slate-50 border-2 border-slate-200'
                        : 'bg-blue-50 border-2 border-blue-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-slate-900">
                            {message.isFromAdmin
                              ? `${message.fromName} (Admin)`
                              : message.fromName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {!message.read && (
                          <span className="px-3 py-1 bg-gray-400 text-white text-xs rounded-full font-semibold">
                            {t({ en: 'UNREAD BY CLIENT', fr: 'NON LU PAR CLIENT' })}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        {conversation.status === 'open' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {t({ en: 'Send a Reply', fr: 'Envoyer une Réponse' })}
            </h3>
            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Your Reply', fr: 'Votre Réponse' })} *
                </label>
                <textarea
                  required
                  rows={6}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                  placeholder={t({
                    en: 'Type your reply to the client here...',
                    fr: 'Tapez votre réponse au client ici...'
                  })}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t({
                    en: 'The client will receive an email notification with your reply.',
                    fr: 'Le client recevra une notification par email avec votre réponse.'
                  })}
                </p>
              </div>
              <button
                type="submit"
                disabled={sending || !replyContent.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {sending
                  ? t({ en: 'Sending...', fr: 'Envoi...' })
                  : t({ en: 'Send Reply to Client', fr: 'Envoyer la Réponse au Client' })}
              </button>
            </form>
          </div>
        )}

        {conversation.status === 'closed' && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-yellow-800 font-semibold mb-2">
              {t({
                en: 'This conversation is closed',
                fr: 'Cette conversation est fermée'
              })}
            </p>
            <p className="text-yellow-700 text-sm mb-4">
              {t({
                en: 'You cannot send new messages to this conversation. Reopen it to continue the conversation.',
                fr: 'Vous ne pouvez plus envoyer de messages dans cette conversation. Rouvrez-la pour continuer la conversation.'
              })}
            </p>
            <button
              onClick={() => handleUpdateStatus('open')}
              disabled={updatingStatus}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {t({ en: 'Reopen Conversation', fr: 'Rouvrir la Conversation' })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
