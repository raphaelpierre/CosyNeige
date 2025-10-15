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
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animation d'entrée
    const enterTimer = setTimeout(() => setIsAnimating(false), 100);

    // Effet sonore et vibration pour les notifications importantes
    if (type === 'success' && message.includes('Déconnexion')) {
      // Vibration si supportée
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      // Son de notification (discret)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjWS2fLMdSUELIHN8dx/OAgUZbvs56xWFApEn+DyvmgyBjiS2fLTeSYGKnjJ8d2DPAcYZbbp5q9YFgtBo+LudyQE');
        audio.volume = 0.1;
        audio.play().catch(() => {}); // Ignore les erreurs si le son ne peut pas être joué
      } catch (e) {
        // Ignore les erreurs de son
      }
    }

    // Barre de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const decrease = 100 / (duration / 50);
        return Math.max(prev - decrease, 0);
      });
    }, 50);

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
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  }[type];

  const borderColor = {
    success: 'border-green-400/50',
    error: 'border-red-400/50',
    info: 'border-blue-400/50'
  }[type];

  const glowColor = {
    success: 'shadow-green-500/30',
    error: 'shadow-red-500/30',
    info: 'shadow-blue-500/30'
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }[type];

  return (
    <div className={`fixed top-4 sm:top-6 right-4 sm:right-6 left-4 sm:left-auto z-[9999] transform transition-all duration-500 ${
      isAnimating ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'
    }`}>
      {/* Effet de halo derrière avec animation plus prononcée pour le succès */}
      <div className={`absolute inset-0 ${bgColor} rounded-2xl blur-xl opacity-40 ${
        type === 'success' ? 'animate-pulse' : ''
      }`}></div>
      
      {/* Ring d'effet pour les notifications importantes */}
      {type === 'success' && (
        <div className="absolute -inset-2 bg-green-400/20 rounded-3xl animate-ping"></div>
      )}
      
      {/* Notification principale */}
      <div className={`relative ${bgColor} text-white px-4 sm:px-6 py-4 sm:py-5 rounded-2xl shadow-2xl ${borderColor} ${glowColor} border-2 flex items-center gap-3 sm:gap-4 w-full sm:min-w-[420px] sm:max-w-[500px] backdrop-blur-sm ${
        type === 'success' ? 'animate-pulse' : ''
      }`}
           style={{ 
             boxShadow: `0 25px 50px rgba(0,0,0,0.25), 0 0 40px var(--tw-shadow-color, rgba(0,0,0,0.1))`,
           }}>
        
        {/* Icône avec animation plus prononcée */}
        <div className={`text-2xl sm:text-3xl bg-white/20 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg flex-shrink-0 ${
          type === 'success' ? 'animate-bounce' : ''
        }`}>
          {icon}
        </div>
        
        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base sm:text-lg drop-shadow-lg leading-tight break-words">{message}</p>
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
          className="text-white/80 hover:text-white transition-all text-lg sm:text-xl font-bold hover:bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:scale-110 shadow-lg flex-shrink-0"
        >
          ✕
        </button>
        
        {/* Barre de progression */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden w-full">
          <div 
            className="h-full bg-white/60 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}