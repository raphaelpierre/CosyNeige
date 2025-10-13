'use client';

import { useState, useEffect } from 'react';

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loginResult, setLoginResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testAuth = async () => {
    try {
      console.log('🔍 Test de /api/auth/me...');
      const response = await fetch('/api/auth/me');
      const data = response.ok ? await response.json() : { error: 'Not authenticated' };
      setAuthStatus(data);
    } catch (err) {
      setAuthStatus({ error: 'Erreur de réseau' });
    }
  };

  const testLogin = async () => {
    try {
      setError('');
      console.log('🔐 Test de connexion admin...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({
          email: 'admin@chalet-balmotte810.com',
          password: 'admin123!'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setLoginResult(data);
        // Recharger le statut auth après connexion
        setTimeout(testAuth, 500);
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de réseau');
    }
  };

  useEffect(() => {
    testAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Test d&apos;Authentification</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Statut actuel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Statut Actuel</h2>
            <button
              onClick={testAuth}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🔄 Rafraîchir
            </button>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authStatus, null, 2)}
            </pre>
          </div>

          {/* Test de connexion */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔐 Test de Connexion</h2>
            <button
              onClick={testLogin}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Se connecter comme Admin
            </button>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                ❌ {error}
              </div>
            )}
            
            {loginResult && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                ✅ Connexion réussie !
              </div>
            )}
            
            <div className="text-sm text-gray-600 mb-2">
              <strong>Email:</strong> admin@chalet-balmotte810.com<br />
              <strong>Mot de passe:</strong> admin123!
            </div>
            
            {loginResult && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(loginResult, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔗 Actions</h2>
          <div className="flex gap-4">
            <a
              href="/client/login"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              🚪 Page de Connexion
            </a>
            <a
              href="/admin"
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              ⚡ Admin Panel
            </a>
            <a
              href="/client/dashboard"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              📊 Dashboard Client
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}