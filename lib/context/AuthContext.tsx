'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Vérification du statut d\'authentification...');
      const response = await fetch('/api/auth/me');
      console.log('📥 Réponse /api/auth/me:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Données utilisateur récupérées:', { email: userData.email, role: userData.role });
        setUser(userData);
      } else {
        console.log('❌ Non authentifié');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      
      // Dispatch un event personnalisé pour déclencher la notification
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}