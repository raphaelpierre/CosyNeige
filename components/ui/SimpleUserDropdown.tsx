'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';

export default function SimpleUserDropdown() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, loading } = useAuth();

  console.log('SimpleUserDropdown - user:', user);
  console.log('SimpleUserDropdown - isAuthenticated:', isAuthenticated);
  console.log('SimpleUserDropdown - loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest-600"></div>
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/client/login"
        className="text-sm font-medium text-gray-700 hover:text-forest-700 flex items-center gap-2"
      >
        👤 {t({ en: 'My Account', fr: 'Mon Compte' })}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-forest-600 to-forest-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
      </div>
      
      {/* Nom */}
      <span className="text-sm font-medium text-gray-700">
        {user.firstName} {user.lastName}
      </span>
      
      {/* Bouton Logout simple */}
      <button
        onClick={logout}
        className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:border-red-500 transition-colors"
      >
        🚪 {t({ en: 'Logout', fr: 'Logout' })}
      </button>
    </div>
  );
}