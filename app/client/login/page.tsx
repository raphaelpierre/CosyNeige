'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      // Rediriger vers l'espace client
      router.push('/client/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-forest-900 mb-2">
            {isLogin
              ? t({ en: 'Client Login', fr: 'Connexion Client' })
              : t({ en: 'Create Account', fr: 'Créer un Compte' })}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? t({ en: 'Access your reservations and messages', fr: 'Accédez à vos réservations et messages' })
              : t({ en: 'Join us to manage your bookings', fr: 'Rejoignez-nous pour gérer vos réservations' })}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t({ en: 'First Name', fr: 'Prénom' })} *
                    </label>
                    <input
                      type="text"
                      required={!isLogin}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-gray-600 mt-1">
                  {t({ en: 'Minimum 6 characters', fr: 'Minimum 6 caractères' })}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-800">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-forest-700 to-forest-600 hover:from-forest-800 hover:to-forest-700 text-white px-8 py-5 rounded-xl font-bold text-xl transition-all shadow-2xl hover:shadow-forest-700/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-forest-800"
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
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-forest-700 hover:text-forest-900 font-semibold"
            >
              {isLogin
                ? t({ en: "Don't have an account? Sign up", fr: "Pas de compte ? S'inscrire" })
                : t({ en: 'Already have an account? Sign in', fr: 'Déjà un compte ? Se connecter' })}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← {t({ en: 'Back to home', fr: "Retour à l'accueil" })}
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-gradient-to-br from-forest-50 to-cream rounded-xl p-6">
          <h3 className="font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'With your client account:', fr: 'Avec votre espace client :' })}
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t({ en: 'View and manage your reservations', fr: 'Consultez et gérez vos réservations' })}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t({ en: 'Send and receive messages', fr: 'Envoyez et recevez des messages' })}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t({ en: 'Access exclusive offers', fr: 'Accédez à des offres exclusives' })}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>{t({ en: 'Track your booking history', fr: 'Suivez votre historique de réservations' })}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
