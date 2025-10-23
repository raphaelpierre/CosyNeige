'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function ResendVerificationPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || data.messageEn);
      } else {
        setStatus('error');
        setMessage(data.error || data.errorEn);
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      setStatus('error');
      setMessage(t({
        en: 'Error sending email. Please try again.',
        fr: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t({
              en: 'Resend Verification Email',
              fr: 'Renvoyer l\'email de vérification'
            })}
          </h1>
          <p className="text-slate-600">
            {t({
              en: 'Enter your email address to receive a new verification link',
              fr: 'Entrez votre adresse email pour recevoir un nouveau lien de vérification'
            })}
          </p>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-red-800 text-sm">{message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              {t({
                en: 'Email Address',
                fr: 'Adresse Email'
              })}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              placeholder={t({
                en: 'your.email@example.com',
                fr: 'votre.email@exemple.com'
              })}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t({ en: 'Sending...', fr: 'Envoi...' })}
              </span>
            ) : (
              t({
                en: 'Send Verification Email',
                fr: 'Envoyer l\'email de vérification'
              })
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <Link
            href="/client/login"
            className="block text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            {t({
              en: '← Back to login',
              fr: '← Retour à la connexion'
            })}
          </Link>
        </div>
      </div>
    </div>
  );
}
