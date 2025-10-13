'use client';

import { useState, useEffect } from 'react';

export default function AdminDebugPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentification simple pour le debug
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'debug123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect (debug123)');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Erreur lors de la récupération des utilisateurs');
      }
    } catch (err) {
      setError('Erreur de réseau');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">🛠️ Admin Debug</h1>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Mot de passe debug:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="debug123"
              />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Accéder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">🛠️ Admin Debug - Utilisateurs</h1>
          
          <button
            onClick={fetchUsers}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            🔄 Rafraîchir
          </button>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              ❌ {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Nom</th>
                  <th className="border border-gray-300 px-4 py-2">Rôle</th>
                  <th className="border border-gray-300 px-4 py-2">Créé le</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">🔧 Actions de debug:</h3>
            <div className="flex gap-4">
              <a
                href="/test-auth"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                🧪 Test Auth
              </a>
              <a
                href="/client/login"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                🔐 Page Login
              </a>
              <a
                href="/admin"
                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
              >
                ⚡ Admin Officiel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}