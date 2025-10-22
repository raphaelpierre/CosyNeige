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
  };
}

export default function ClientConversationDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id as string;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    } else if (!authLoading && isAuthenticated && conversationId) {
      fetchConversation();
    }
  }, [authLoading, isAuthenticated, conversationId, router]);

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
        router.push('/client/conversations');
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
          isFromAdmin: false,
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

  if (!isAuthenticated || !user || !conversation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <Link
              href="/client/conversations"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <span>←</span>
              <span>{t({ en: 'Back to Conversations', fr: 'Retour aux Conversations' })}</span>
            </Link>
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
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {conversation.subject}
          </h1>
          <p className="text-slate-300 text-sm">
            {t({ en: 'Started on', fr: 'Démarrée le' })}{' '}
            {new Date(conversation.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} • {conversation.messages.length} {t({ en: 'messages', fr: 'messages' })}
          </p>
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
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}>
                    {message.isFromAdmin ? '🏔️' : message.fromName.charAt(0).toUpperCase()}
                  </div>

                  {/* Message content */}
                  <div className="flex-1">
                    <div className={`rounded-2xl p-5 ${
                      message.isFromAdmin
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-slate-900">
                            {message.isFromAdmin ? 'Chalet-Balmotte810' : message.fromName}
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
                        {message.isFromAdmin && !message.read && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                            {t({ en: 'NEW', fr: 'NOUVEAU' })}
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
                  {t({ en: 'Your Message', fr: 'Votre Message' })} *
                </label>
                <textarea
                  required
                  rows={6}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t({
                    en: 'Type your reply here...',
                    fr: 'Tapez votre réponse ici...'
                  })}
                />
              </div>
              <button
                type="submit"
                disabled={sending || !replyContent.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {sending
                  ? t({ en: 'Sending...', fr: 'Envoi...' })
                  : t({ en: 'Send Reply', fr: 'Envoyer la Réponse' })}
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
            <p className="text-yellow-700 text-sm">
              {t({
                en: 'You cannot send new messages to this conversation. Please start a new conversation if needed.',
                fr: 'Vous ne pouvez plus envoyer de messages dans cette conversation. Veuillez démarrer une nouvelle conversation si nécessaire.'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
