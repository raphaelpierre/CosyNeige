'use client';

import { useLanguage } from '@/lib/hooks/useLanguage';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-cream border border-forest-200 rounded-lg p-1">
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-forest-700 text-white'
            : 'text-forest-700 hover:bg-forest-50'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-forest-700 text-white'
            : 'text-forest-700 hover:bg-forest-50'
        }`}
      >
        EN
      </button>
    </div>
  );
}
