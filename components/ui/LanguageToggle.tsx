'use client';

import { useLanguage } from '@/lib/hooks/useLanguage';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-4 pb-2">
      <button
        onClick={() => setLanguage('fr')}
        className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 relative group pb-2 ${
          language === 'fr'
            ? 'text-slate-800'
            : 'text-gray-700 hover:text-slate-800'
        }`}
        title="Français"
      >
        <span>🇫🇷</span>
        <span>FR</span>
        <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-slate-700 to-slate-800 transition-all duration-300 ${
          language === 'fr' ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 relative group pb-2 ${
          language === 'en'
            ? 'text-slate-800'
            : 'text-gray-700 hover:text-slate-800'
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
        <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-slate-700 to-slate-800 transition-all duration-300 ${
          language === 'en' ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </button>
    </div>
  );
}
