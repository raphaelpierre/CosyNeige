'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function ClientPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Si authentifié, rediriger vers le dashboard
        router.replace('/client/dashboard');
      } else {
        // Sinon, rediriger vers la page de connexion
        router.replace('/client/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Afficher un loader pendant la vérification
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
