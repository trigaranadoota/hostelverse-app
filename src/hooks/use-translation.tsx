
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

const translations: Record<string, any> = { en, hi };

type TranslationContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const setLanguageAndSave = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      if (isClient) {
        localStorage.setItem('language', lang);
      }
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  if (!isClient) {
    // Render nothing or a loader on the server
    return null;
  }
  
  return (
    <TranslationContext.Provider value={{ language, setLanguage: setLanguageAndSave, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
