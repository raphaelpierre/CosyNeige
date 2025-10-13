'use client';

import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

export default function AdminTestPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Test Accès Admin</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Statut Utilisateur</h2>
          <div className="space-y-2">
            <p><strong>Authentifié :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
            {user && (
              <>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Rôle :</strong> <span className={`px-2 py-1 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span></p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Tests d&apos;Accès</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Accès Admin :</h3>
              {user?.role === 'admin' ? (
                <div className="text-green-700">
                  ✅ Accès autorisé !
                  <Link href="/admin" className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    🚀 Accéder au Panel Admin
                  </Link>
                </div>
              ) : (
                <div className="text-red-700">
                  ❌ Accès refusé (rôle requis: admin)
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Accès Client :</h3>
              {isAuthenticated ? (
                <div className="text-green-700">
                  ✅ Accès autorisé !
                  <Link href="/client/dashboard" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    📊 Dashboard Client
                  </Link>
                </div>
              ) : (
                <div className="text-red-700">
                  ❌ Connexion requise
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔗 Actions</h2>
          <div className="flex gap-4 flex-wrap">
            {!isAuthenticated && (
              <Link href="/client/login" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                🔐 Se Connecter
              </Link>
            )}
            
            <Link href="/test-auth" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              🧪 Page Test Auth
            </Link>
            
            <Link href="/admin-debug" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              🛠️ Admin Debug
            </Link>
            
            <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              🏠 Accueil
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <h3 className="font-semibold mb-2">💡 Instructions :</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Se connecter avec <code>admin@chalet-balmotte810.com</code> / <code>admin123!</code></li>
            <li>Vérifier que le rôle affiché est &quot;admin&quot;</li>
            <li>Cliquer sur &quot;Accéder au Panel Admin&quot; si disponible</li>
            <li>Ou aller sur <code>/admin</code> directement</li>
          </ol>
        </div>
      </div>
    </div>
  );
}