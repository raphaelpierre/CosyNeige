'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Notification from '@/components/ui/Notification';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { getTranslation } from '@/lib/translations';

interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { language } = useLanguage();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const notification: NotificationData = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message: string, duration: number = 5000) => {
    showNotification(message, 'success', duration);
  };

  const showError = (message: string, duration: number = 6000) => {
    showNotification(message, 'error', duration);
  };

  const showInfo = (message: string, duration: number = 5000) => {
    showNotification(message, 'info', duration);
  };

  // Écouter les événements de déconnexion
  useEffect(() => {
    const handleLogout = () => {
      const message = getTranslation('notifications', 'logoutSuccess', language);
      showSuccess(message);
    };

    window.addEventListener('userLoggedOut', handleLogout);
    return () => window.removeEventListener('userLoggedOut', handleLogout);
  }, [language]);

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showInfo
    }}>
      {children}
      
      {/* Conteneur des notifications */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ 
              transform: `translateY(${index * 80}px)`,
              zIndex: 9999 - index 
            }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}