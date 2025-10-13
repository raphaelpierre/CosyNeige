'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useAuth } from '@/lib/context/AuthContext';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le dropdown lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-8 h-8">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/client/login"
        className={`text-sm font-medium transition-all duration-300 relative group ${
          pathname === '/client/login' || pathname.startsWith('/client')
            ? 'text-forest-700'
            : 'text-gray-700 hover:text-forest-700'
        }`}
      >
        👤 {t({ en: 'My Account', fr: 'Mon Compte' })}
        <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-forest-600 to-forest-800 transition-all duration-300 ${
          pathname === '/client/login' || pathname.startsWith('/client') ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm font-medium transition-all duration-300 relative group flex items-center gap-2 ${
          pathname.startsWith('/client')
            ? 'text-forest-700'
            : 'text-gray-700 hover:text-forest-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block">
            {user.firstName} {user.lastName}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-forest-600 to-forest-800 transition-all duration-300 ${
          pathname.startsWith('/client') ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 opacity-100 transform scale-100 transition-all duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/client/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">📊</span>
              {t({ en: 'Dashboard', fr: 'Tableau de bord' })}
            </Link>
            
            <Link
              href="/client/dashboard?tab=reservations"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">📅</span>
              {t({ en: 'My Reservations', fr: 'Mes Réservations' })}
            </Link>

            <Link
              href="/client/dashboard?tab=messages"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">💬</span>
              {t({ en: 'Messages', fr: 'Messages' })}
            </Link>

            <Link
              href="/booking"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">➕</span>
              {t({ en: 'New Booking', fr: 'Nouvelle Réservation' })}
            </Link>

            {/* Afficher l'accès Admin uniquement pour les utilisateurs admin */}
            {user.role === 'admin' && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">⚡</span>
                  {t({ en: 'Admin Panel', fr: 'Panneau Admin' })}
                </Link>
              </>
            )}

            {/* Menu admin de secours - toujours visible en dev pour tester */}
            {process.env.NODE_ENV === 'development' && user.email?.includes('admin') && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">🛠️</span>
                  Admin Panel (Debug)
                </Link>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-2">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <span className="text-lg">🚪</span>
              {t({ en: 'Logout', fr: 'Se déconnecter' })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}