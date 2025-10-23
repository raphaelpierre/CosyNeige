'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function VerifyEmailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t({
        en: 'Invalid verification link',
        fr: 'Lien de vérification invalide'
      }));
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || data.messageEn);

        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/client/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || data.errorEn);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setStatus('error');
      setMessage(t({
        en: 'Error verifying email. Please try again.',
        fr: 'Erreur lors de la vérification de l\'email. Veuillez réessayer.'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mb-6">
            {status === 'verifying' && (
              <div className="w-16 h-16 mx-auto border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {status === 'verifying' && t({
              en: 'Verifying your email...',
              fr: 'Vérification de votre email...'
            })}
            {status === 'success' && t({
              en: 'Email verified!',
              fr: 'Email vérifié !'
            })}
            {status === 'error' && t({
              en: 'Verification failed',
              fr: 'Échec de la vérification'
            })}
          </h1>

          {/* Message */}
          <p className={`text-lg mb-6 ${
            status === 'success' ? 'text-green-600' :
            status === 'error' ? 'text-red-600' :
            'text-slate-600'
          }`}>
            {message}
          </p>

          {/* Actions */}
          {status === 'success' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                {t({
                  en: 'Redirecting to login page...',
                  fr: 'Redirection vers la page de connexion...'
                })}
              </p>
              <Link
                href="/client/login"
                className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                {t({
                  en: 'Go to login',
                  fr: 'Aller à la connexion'
                })}
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Link
                href="/client/login"
                className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                {t({
                  en: 'Back to login',
                  fr: 'Retour à la connexion'
                })}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
