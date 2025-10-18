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
      <div className="px-3 py-2 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/client/login"
        onClick={onLinkClick}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          pathname === '/client/login' || pathname.startsWith('/client')
            ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 shadow-sm'
            : 'text-gray-700 hover:bg-slate-50'
        }`}
      >
        <span className="text-base">👤</span>
        {t({ en: 'My Account', fr: 'Mon Compte' })}
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    onLinkClick();
  };

  return (
    <div className="border-t border-gray-200 mt-1 pt-1">
      {/* User Info - Version compacte */}
      <div className="px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900 text-xs truncate">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-slate-700 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <Link
        href="/client/dashboard"
        onClick={onLinkClick}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          pathname === '/client/dashboard'
            ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 shadow-sm'
            : 'text-gray-700 hover:bg-slate-50'
        }`}
      >
        <span className="text-base">📊</span>
        {t({ en: 'Dashboard', fr: 'Tableau de bord' })}
      </Link>

      <Link
        href="/booking"
        onClick={onLinkClick}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          pathname === '/booking'
            ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 shadow-sm'
            : 'text-gray-700 hover:bg-slate-50'
        }`}
      >
        <span className="text-base">➕</span>
        {t({ en: 'New Booking', fr: 'Nouvelle Réservation' })}
      </Link>

      {/* Afficher l'accès Admin uniquement pour les utilisateurs admin */}
      {user.role === 'admin' && (
        <Link
          href="/admin"
          onClick={onLinkClick}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            pathname === '/admin'
              ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 shadow-sm'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <span className="text-base">⚡</span>
          {t({ en: 'Admin Panel', fr: 'Panneau Admin' })}
        </Link>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 text-red-600 hover:bg-red-50 mt-1"
      >
        <span className="text-base">🚪</span>
        {t({ en: 'Logout', fr: 'Se déconnecter' })}
      </button>
    </div>
  );
}