'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';

function LoginPageContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login, checkAuthStatus, loading, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lire les paramètres URL au chargement
  useEffect(() => {
    const action = searchParams.get('action');
    const verified = searchParams.get('verified');
    const message = searchParams.get('message');

    if (action === 'register') {
      setIsLogin(false); // Basculer vers le mode création de compte
    }

    if (verified === 'true') {
      setSuccess(t({
        en: '✅ Email verified successfully! You can now log in.',
        fr: '✅ Email vérifié avec succès ! Vous pouvez maintenant vous connecter.'
      }));
    }

    if (message) {
      setSuccess(decodeURIComponent(message));
    }
  }, [searchParams, t]);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Vérifier si un returnTo est spécifié
      const returnTo = searchParams.get('returnTo');

      // Priorité au returnTo si spécifié
      if (returnTo) {
        console.log('🔄 Redirection vers returnTo:', returnTo);
        router.push(returnTo);
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/client/dashboard');
      }
    }
  }, [isAuthenticated, loading, user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      console.log('🔐 Tentative de ' + (isLogin ? 'connexion' : 'inscription') + ' avec:', { email: formData.email });

      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('📥 Réponse du serveur:', response.status);

      const data = await response.json();
      console.log('📊 Données reçues:', { user: data.user?.email, role: data.user?.role });

      if (!response.ok) {
        console.error('❌ Erreur:', data.error);

        // Gestion spéciale pour email non vérifié
        if (data.emailNotVerified) {
          const errorMsg = data.error || data.errorEn;
          setError(errorMsg);
          // Afficher un lien vers la page de renvoi
          setTimeout(() => {
            setError(errorMsg + ' ' + t({
              en: 'Click here to resend verification email.',
              fr: 'Cliquez ici pour renvoyer l\'email de vérification.'
            }));
          }, 100);
          setIsSubmitting(false);
          return;
        }

        // Gestion spéciale pour mot de passe non défini
        if (data.passwordNotSet) {
          const errorMsg = data.error || data.errorEn;
          setError(errorMsg);
          setIsSubmitting(false);
          return;
        }

        // Utiliser le message d'erreur en français par défaut, ou en anglais si disponible
        const errorMessage = data.error || data.errorEn || t({
          en: 'An error occurred during authentication',
          fr: 'Une erreur est survenue lors de l\'authentification'
        });
        throw new Error(errorMessage);
      }

      // Si c'est une inscription, afficher un message de succès
      if (!isLogin) {
        console.log('✅ Inscription réussie, affichage du message de vérification');
        setSuccess(t({
          en: '✅ Account created successfully! Please check your email to verify your account.',
          fr: '✅ Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.'
        }));

        // Réinitialiser le formulaire
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
        });

        // Basculer vers le mode connexion après 5 secondes
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 5000);

        setIsSubmitting(false);
        return;
      }

      console.log('✅ Connexion réussie, mise à jour du contexte...');

      // Mettre à jour le contexte d'authentification en récupérant les données complètes depuis l'API
      await checkAuthStatus();

      console.log('🚀 Redirection en cours...');

      // Vérifier si un returnTo est spécifié dans l'URL
      const returnTo = searchParams.get('returnTo');

      // Priorité au returnTo si spécifié
      if (returnTo) {
        console.log('🔄 Redirection vers returnTo:', returnTo);
        router.push(returnTo);
      } else if (data.user?.role === 'admin') {
        console.log('👑 Utilisateur admin détecté, redirection vers le panneau admin');
        router.push('/admin');
      } else {
        console.log('👤 Utilisateur client, redirection vers le dashboard');
        router.push('/client/dashboard');
      }
    } catch (err: unknown) {
      console.error('❌ Erreur dans handleSubmit:', err);
      const errorMessage = err instanceof Error ? err.message : t({
        en: 'An unexpected error occurred',
        fr: 'Une erreur inattendue est survenue'
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream py-8 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">{t({ en: 'Loading...', fr: 'Chargement...' })}</p>
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
            {isLogin
              ? t({ en: 'Client Login', fr: 'Connexion Client' })
              : t({ en: 'Create Account', fr: 'Créer un Compte' })}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isLogin
              ? t({ en: 'Access your reservations and messages', fr: 'Accédez à vos réservations et messages' })
              : t({ en: 'Join us to manage your bookings', fr: 'Rejoignez-nous pour gérer vos réservations' })}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t({ en: 'First Name', fr: 'Prénom' })} *
                    </label>
                    <input
                      type="text"
                      required={!isLogin}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t({ en: 'Last Name', fr: 'Nom' })} *
                    </label>
                    <input
                      type="text"
                      required={!isLogin}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t({ en: 'Phone', fr: 'Téléphone' })}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Email', fr: 'Email' })} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Password', fr: 'Mot de passe' })} *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent text-base"
                placeholder="••••••••"
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-gray-600 mt-1">
                  {t({ en: 'Minimum 6 characters', fr: 'Minimum 6 caractères' })}
                </p>
              )}
            </div>

            {success && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 sm:p-4 text-green-800">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 text-lg sm:text-xl">✅</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium break-words">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4 text-red-800">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg sm:text-xl">⚠️</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium break-words">
                      {error}
                    </p>
                    {error.includes('vérifier votre email') || error.includes('verify your email') ? (
                      <Link
                        href="/auth/resend-verification"
                        className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-semibold underline text-sm"
                      >
                        {t({
                          en: 'Resend verification email →',
                          fr: 'Renvoyer l\'email de vérification →'
                        })}
                      </Link>
                    ) : null}
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
                  ? t({ en: '⏳ Please wait...', fr: '⏳ Veuillez patienter...' })
                  : isLogin
                    ? t({ en: '🔐 Sign In', fr: '🔐 Se Connecter' })
                    : t({ en: '✨ Create Account', fr: '✨ Créer mon Compte' })}
              </button>
            </div>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base"
            >
              {isLogin
                ? t({ en: "Don't have an account? Sign up", fr: "Pas de compte ? S'inscrire" })
                : t({ en: 'Already have an account? Sign in', fr: 'Déjà un compte ? Se connecter' })}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-3 sm:mt-4 text-center">
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
