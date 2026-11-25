import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {enLocale} from '../locales/en';
import {idLocale} from '../locales/id';
import type {Language, LocalizedText} from '../types';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getLocalizedText,
  resolveInitialLanguage,
} from '../utils/i18n';

export type Translations = typeof idLocale;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  localize: (text: LocalizedText) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE;
    }
    try {
      return resolveInitialLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const setLanguage = (nextLang: Language) => {
    setLanguageState(nextLang);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    } catch {
      // Ignore storage failures in restricted browsing contexts.
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (language === 'en' ? enLocale : idLocale) as Translations,
      localize: (text: LocalizedText) => getLocalizedText(text, language),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
