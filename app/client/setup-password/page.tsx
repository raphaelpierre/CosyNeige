'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';

function SetupPasswordContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string } | null>(null);

  // Valider le token au chargement
  useEffect(() => {
    if (!token) {
      setError(t({
        en: 'No token provided. Please check your email link.',
        fr: 'Aucun token fourni. Veuillez vérifier le lien dans votre email.'
      }));
      setIsValidating(false);
      return;
    }

    async function validateToken() {
      try {
        const response = await fetch(`/api/auth/validate-token?token=${token}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setTokenValid(true);
          setUserInfo({ firstName: data.user.firstName, lastName: data.user.lastName });
        } else {
          setError(data.error || t({
            en: 'Invalid or expired token. Please request a new link.',
            fr: 'Token invalide ou expiré. Veuillez demander un nouveau lien.'
          }));
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError(t({
          en: 'Error validating token. Please try again.',
          fr: 'Erreur lors de la validation du token. Veuillez réessayer.'
        }));
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password.length < 6) {
      setError(t({
        en: 'Password must be at least 6 characters',
        fr: 'Le mot de passe doit contenir au moins 6 caractères'
      }));
      return;
    }

    if (password !== confirmPassword) {
      setError(t({
        en: 'Passwords do not match',
        fr: 'Les mots de passe ne correspondent pas'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t({
          en: 'Failed to set password',
          fr: 'Échec de la définition du mot de passe'
        }));
      }

      setSuccess(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/client/login');
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t({
        en: 'An unexpected error occurred',
        fr: 'Une erreur inattendue est survenue'
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream py-8 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-600">{t({ en: 'Validating...', fr: 'Validation en cours...' })}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t({ en: 'Password Created!', fr: 'Mot de passe créé !' })}
            </h2>
            <p className="text-gray-600 mb-6">
              {t({
                en: 'Your account is now ready. You will be redirected to login...',
                fr: 'Votre compte est prêt. Vous allez être redirigé vers la connexion...'
              })}
            </p>
            <Link
              href="/client/login"
              className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              {t({ en: 'Go to Login', fr: 'Aller à la connexion' })}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4 text-center">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {t({ en: 'Invalid Link', fr: 'Lien invalide' })}
            </h2>
            <p className="text-red-600 mb-6 text-center">{error}</p>
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-colors"
              >
                {t({ en: 'Contact Us', fr: 'Nous contacter' })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream py-8 lg:py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            {t({ en: 'Create Your Password', fr: 'Créez votre mot de passe' })}
          </h1>
          {userInfo && (
            <p className="text-sm sm:text-base text-gray-600">
              {t({ en: 'Welcome', fr: 'Bienvenue' })} {userInfo.firstName} {userInfo.lastName} !
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'New Password', fr: 'Nouveau mot de passe' })} *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                placeholder="••••••••"
                minLength={6}
              />
              <p className="text-xs text-gray-600 mt-1">
                {t({ en: 'Minimum 6 characters', fr: 'Minimum 6 caractères' })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Confirm Password', fr: 'Confirmer le mot de passe' })} *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4 text-red-800">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg sm:text-xl">⚠️</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium break-words">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 lg:py-5 rounded-xl font-bold text-lg sm:text-xl transition-colors shadow-2xl border-2 border-slate-700 hover:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t({ en: '⏳ Creating...', fr: '⏳ Création en cours...' })
                  : t({ en: '✨ Create Password', fr: '✨ Créer mon mot de passe' })}
              </button>
            </div>
          </form>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← {t({ en: 'Back to home', fr: "Retour à l'accueil" })}
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-br from-slate-50 to-cream rounded-xl p-4 sm:p-6">
          <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-center text-sm sm:text-base">
            {t({ en: 'With your client account:', fr: 'Avec votre espace client :' })}
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-sm">✓</span>
              <span>{t({ en: 'View and manage your reservations', fr: 'Consultez et gérez vos réservations' })}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-sm">✓</span>
              <span>{t({ en: 'Send and receive messages', fr: 'Envoyez et recevez des messages' })}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-sm">✓</span>
              <span>{t({ en: 'Access exclusive offers', fr: 'Accédez à des offres exclusives' })}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-sm">✓</span>
              <span>{t({ en: 'Track your booking history', fr: 'Suivez votre historique de réservations' })}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    }>
      <SetupPasswordContent />
    </Suspense>
  );
}
