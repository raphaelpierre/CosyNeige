'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function AuthDebug() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  console.log('AuthDebug - user:', user);
  console.log('AuthDebug - isAuthenticated:', isAuthenticated);
  console.log('AuthDebug - loading:', loading);

  if (loading) {
    return <div>Loading auth...</div>;
  }

  if (!isAuthenticated) {
    return <div>👤 {t({ en: 'My Account', fr: 'Mon Compte' })}</div>;
  }

  return (
    <div style={{ border: '1px solid red', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <div>DEBUG AUTH:</div>
      <div>User: {user?.firstName} {user?.lastName}</div>
      <div>Email: {user?.email}</div>
      <div>Authenticated: {isAuthenticated ? 'YES' : 'NO'}</div>
    </div>
  );
}