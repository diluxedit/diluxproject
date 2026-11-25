import type {Language, LocalizedText} from '../types';

export const DEFAULT_LANGUAGE: Language = 'id';
export const LANGUAGE_STORAGE_KEY = 'dilux_group_language';

export function resolveInitialLanguage(storedValue: string | null | undefined): Language {
  if (storedValue === 'en' || storedValue === 'id') {
    return storedValue;
  }
  return DEFAULT_LANGUAGE;
}

export function getLocalizedText(value: LocalizedText, lang: Language): string {
  return value[lang] || value[DEFAULT_LANGUAGE];
}
