'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';

interface UserMobileMenuProps {
  onLinkClick: () => void;
}

export default function UserMobileMenu({ onLinkClick }: UserMobileMenuProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="px-4 py-3 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/client/login"
        onClick={onLinkClick}
        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          pathname === '/client/login' || pathname.startsWith('/client')
            ? 'bg-gradient-to-r from-forest-50 to-forest-100 text-forest-700 shadow-sm'
            : 'text-gray-700 hover:bg-forest-50'
        }`}
      >
        <span className="text-lg">👤</span>
        {t({ en: 'My Account', fr: 'Mon Compte' })}
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    onLinkClick();
  };

  return (
    <div className="border-t border-gray-200 mt-2 pt-2">
      {/* User Info */}
      <div className="px-4 py-3 bg-gradient-to-r from-forest-50 to-forest-100 rounded-lg mx-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-forest-600 to-forest-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-forest-900 text-sm">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-forest-600 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <Link
        href="/client/dashboard"
        onClick={onLinkClick}
        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
          pathname === '/client/dashboard'
            ? 'bg-gradient-to-r from-forest-50 to-forest-100 text-forest-700 shadow-sm'
            : 'text-gray-700 hover:bg-forest-50'
        }`}
      >
        <span className="text-lg">📊</span>
        {t({ en: 'Dashboard', fr: 'Tableau de bord' })}
      </Link>

      <Link
        href="/booking"
        onClick={onLinkClick}
        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
          pathname === '/booking'
            ? 'bg-gradient-to-r from-forest-50 to-forest-100 text-forest-700 shadow-sm'
            : 'text-gray-700 hover:bg-forest-50'
        }`}
      >
        <span className="text-lg">➕</span>
        {t({ en: 'New Booking', fr: 'Nouvelle Réservation' })}
      </Link>

      {/* Afficher l'accès Admin uniquement pour les utilisateurs admin */}
      {user.role === 'admin' && (
        <Link
          href="/admin"
          onClick={onLinkClick}
          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
            pathname === '/admin'
              ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 shadow-sm'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <span className="text-lg">⚡</span>
          {t({ en: 'Admin Panel', fr: 'Panneau Admin' })}
        </Link>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 text-red-600 hover:bg-red-50 mt-2"
      >
        <span className="text-lg">🚪</span>
        {t({ en: 'Logout', fr: 'Se déconnecter' })}
      </button>
    </div>
  );
}