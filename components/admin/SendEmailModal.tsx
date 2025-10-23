'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface Recipient {
  id: string;
  email: string;
  name: string;
}

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
  recipientType?: 'users' | 'clients' | 'emails';
  onSuccess?: () => void;
}

export default function SendEmailModal({
  isOpen,
  onClose,
  recipients,
  recipientType = 'users',
  onSuccess,
}: SendEmailModalProps) {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    setSuccess(false);

    try {
      const recipientIds = recipientType === 'emails'
        ? recipients.map(r => r.email)
        : recipients.map(r => r.id);

      const response = await fetch('/api/admin/send-custom-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          recipients: recipientIds,
          recipientType,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(true);
      setSubject('');
      setMessage('');

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setSubject('');
      setMessage('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {t({ en: '📧 Send Email', fr: '📧 Envoyer un Email' })}
          </h2>
          <button
            onClick={handleClose}
            disabled={sending}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Recipients Preview */}
        <div className="p-6 bg-gray-50 border-b">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {t({ en: 'Recipients:', fr: 'Destinataires :' })} ({recipients.length})
          </p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {recipients.slice(0, 10).map((recipient) => (
              <span
                key={recipient.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {recipient.name}
              </span>
            ))}
            {recipients.length > 10 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                +{recipients.length - 10} {t({ en: 'more', fr: 'autres' })}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ {t({
                  en: 'Email sent successfully!',
                  fr: 'Email envoyé avec succès !'
                })}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Subject Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t({ en: 'Subject', fr: 'Sujet' })} *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={sending || success}
              placeholder={t({
                en: 'Email subject...',
                fr: 'Sujet de l\'email...',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t({ en: 'Message', fr: 'Message' })} *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={sending || success}
              rows={10}
              placeholder={t({
                en: 'Write your message here...\n\nYou can use line breaks and formatting.',
                fr: 'Écrivez votre message ici...\n\nVous pouvez utiliser les sauts de ligne et la mise en forme.',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">
              {t({
                en: 'The message will be sent in a professional email template with the Chalet-Balmotte810 branding.',
                fr: 'Le message sera envoyé dans un template email professionnel avec le branding Chalet-Balmotte810.',
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={sending}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t({ en: 'Cancel', fr: 'Annuler' })}
            </button>
            <button
              type="submit"
              disabled={sending || success || !subject || !message}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {sending
                ? t({ en: 'Sending...', fr: 'Envoi...' })
                : t({ en: 'Send Email', fr: 'Envoyer l\'Email' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
