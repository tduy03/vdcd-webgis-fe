import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialLanguageConfig, initialTranslations } from '../data/mockData';
import type { Language, Translation } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translation[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [languageConfig, setLanguageConfig] = useLocalStorage('languageConfig', initialLanguageConfig);
  const [translations] = useLocalStorage('translations', initialTranslations);

  const currentLanguage = languageConfig.currentLanguage;

  const setLanguage = (lang: Language) => {
    setLanguageConfig({
      ...languageConfig,
      currentLanguage: lang
    });
  };

  const t = (key: string): string => {
    const translation = translations.find(t => t.key === key);
    if (!translation) return key;
    return translation[currentLanguage] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};