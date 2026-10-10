import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full bg-gray-100 p-0.5 border border-gray-200 text-xs shadow-2xs ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full font-bold transition-all text-[11px] ${
          language === 'en'
            ? 'bg-[#07643D] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ur')}
        className={`px-2.5 py-1 rounded-full font-bold transition-all text-[11px] urdu-text ${
          language === 'ur'
            ? 'bg-[#07643D] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        اردو
      </button>
    </div>
  );
}
