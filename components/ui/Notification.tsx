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
    success: 'bg-gradient-to-r from-slate-700 to-slate-800',
    error: 'bg-gradient-to-r from-red-600 to-red-700',
    info: 'bg-gradient-to-r from-blue-600 to-blue-700'
  }[type];

  const borderColor = {
    success: 'border-slate-500/30',
    error: 'border-red-400/30',
    info: 'border-blue-400/30'
  }[type];

  const glowColor = {
    success: 'shadow-slate-500/20',
    error: 'shadow-red-500/20',
    info: 'shadow-blue-500/20'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[type];

  return (
    <div className={`fixed top-4 sm:top-6 right-4 sm:right-6 left-4 sm:left-auto z-[9999] transform transition-all duration-300 ${
      isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      {/* Effet de halo derrière (subtil) */}
      <div className={`absolute inset-0 ${bgColor} rounded-xl blur-lg opacity-20`}></div>

      {/* Notification principale */}
      <div className={`relative ${bgColor} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg ${borderColor} ${glowColor} border flex items-center gap-3 sm:gap-4 w-full sm:min-w-[380px] sm:max-w-[450px]`}
           style={{
             boxShadow: `0 10px 25px rgba(0,0,0,0.15)`,
           }}>

        {/* Icône simple */}
        <div className="text-xl sm:text-2xl bg-white/15 rounded-lg w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0 font-bold">
          {icon}
        </div>
        
        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base leading-tight break-words">{message}</p>
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
          className="text-white/70 hover:text-white transition-colors text-lg sm:text-xl font-bold hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0"
        >
          ✕
        </button>

        {/* Barre de progression */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 rounded-b-xl overflow-hidden w-full">
          <div
            className="h-full bg-white/50 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}