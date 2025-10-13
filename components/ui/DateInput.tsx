'use client';

import { useLanguage } from '@/lib/hooks/useLanguage';
import { useEffect, useRef } from 'react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export default function DateInput({
  value,
  onChange,
  label,
  required = false,
  className = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent",
  placeholder,
}: DateInputProps) {
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const getLocalizedPlaceholder = () => {
    if (placeholder) return placeholder;
    return language === 'fr' ? 'jj/mm/aaaa' : 'mm/dd/yyyy';
  };

  useEffect(() => {
    if (inputRef.current && language === 'fr') {
      // Forcer la localisation française sur l'élément
      inputRef.current.setAttribute('lang', 'fr-FR');
      inputRef.current.setAttribute('data-locale', 'fr-FR');
      
      // Essayer de définir la locale via JavaScript si possible
      try {
        if ('setCustomValidity' in inputRef.current) {
          // Certains navigateurs respectent cela pour la validation
          inputRef.current.setAttribute('pattern', '\\d{4}-\\d{2}-\\d{2}');
        }
      } catch (e) {
        // Ignorer les erreurs de compatibilité
      }
    }
  }, [language]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        ref={inputRef}
        type="date"
        lang={language === 'fr' ? 'fr-FR' : 'en-US'}
        data-locale={language === 'fr' ? 'fr-FR' : 'en-US'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={className}
        placeholder={getLocalizedPlaceholder()}
        style={{
          colorScheme: 'light',
          fontFamily: language === 'fr' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : undefined,
        }}
        // Attributs supplémentaires pour forcer la localisation française
        {...(language === 'fr' && {
          'data-date-format': 'dd/mm/yyyy',
          'data-lang': 'fr',
        })}
      />
    </div>
  );
}