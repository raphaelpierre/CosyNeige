'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Animation d'entrée
    const enterTimer = setTimeout(() => setIsAnimating(false), 100);

    // Fermeture automatique
    const closeTimer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-gradient-to-r from-forest-600 to-forest-700',
    error: 'bg-gradient-to-r from-wood-700 to-wood-800',
    info: 'bg-gradient-to-r from-alpine-600 to-alpine-700'
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-[9999] transform transition-all duration-500 ${
      isAnimating ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'
    }`}>
      {/* Effet de halo derrière */}
      <div className={`absolute inset-0 ${bgColor} rounded-xl blur-lg opacity-60 animate-pulse`}></div>
      
      {/* Notification principale */}
      <div className={`relative ${bgColor} text-white px-8 py-6 rounded-xl shadow-2xl border-2 border-white/30 flex items-center gap-4 min-w-[380px] backdrop-blur-sm`}
           style={{ 
             boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.2)',
           }}>
        
        {/* Icône avec animation */}
        <div className="text-3xl animate-bounce bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
        
        {/* Message */}
        <div className="flex-1">
          <p className="font-bold text-lg drop-shadow-lg">{message}</p>
        </div>
        
        {/* Bouton fermer */}
        <button
          onClick={() => {
            setIsAnimating(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose?.();
            }, 300);
          }}
          className="text-white/80 hover:text-white transition-all text-xl font-bold hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110"
        >
          ✕
        </button>
      </div>
    </div>
  );
}