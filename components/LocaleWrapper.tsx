'use client';

import { useLanguage } from '@/lib/hooks/useLanguage';
import { useEffect } from 'react';

export default function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  useEffect(() => {
    // Mettre à jour l'attribut lang du document
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'fr' ? 'fr-FR' : 'en-US';
      document.documentElement.setAttribute('data-locale', language === 'fr' ? 'fr-FR' : 'en-US');
      
      // Forcer une mise à jour des inputs de date
      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach(input => {
        const htmlInput = input as HTMLInputElement;
        htmlInput.lang = language === 'fr' ? 'fr-FR' : 'en-US';
        htmlInput.setAttribute('data-locale', language === 'fr' ? 'fr-FR' : 'en-US');
      });
    }
  }, [language]);

  return <>{children}</>;
}