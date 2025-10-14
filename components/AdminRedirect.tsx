'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function AdminRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si l'utilisateur est chargé, authentifié, et est admin
    if (!loading && isAuthenticated && user?.role === 'admin') {
      // Liste des pages publiques où les admins peuvent naviguer
      const allowedPublicPages = ['/admin', '/admin-debug', '/admin-test', '/api'];
      
      // Si l'admin n'est pas sur une page admin et n'est pas sur la page d'accueil
      if (!allowedPublicPages.some(page => pathname.startsWith(page)) && pathname !== '/') {
        console.log('🔄 Admin détecté, redirection vers /admin');
        router.push('/admin');
      }
    }
  }, [user, isAuthenticated, loading, pathname, router]);

  return null; // Ce composant ne rend rien
}