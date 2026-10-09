import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ className = "" }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      aria-label="Toggle Language"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
        language === 'ur'
          ? 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
      } ${className}`}
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{language === 'en' ? 'اردو' : 'English'}</span>
    </button>
  );
}
