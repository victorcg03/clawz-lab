/**
 * @fileoverview Language selector component for i18n
 * @author Clawz Lab Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';

/**
 * Language option interface
 */
interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

/**
 * Available languages
 */
const languages: LanguageOption[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

/**
 * Language selector component
 */
export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('es');
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    // Language change logic - for now just updates local state
    // In a full implementation, this would trigger a locale change
    console.log('Changing language to:', langCode);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  return (
    <div className="relative min-w-16">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Seleccionar idioma"
      >
        <span>{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-md z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors duration-200 ${
                currentLang === lang.code
                  ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop para cerrar el dropdown */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          aria-label="Cerrar selector de idioma"
        />
      )}
    </div>
  );
}
