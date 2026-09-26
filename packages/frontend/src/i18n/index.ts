import { fr } from './locales/fr';
import { en } from './locales/en';
import { zhCN } from './locales/zh-CN';
import type { Translation } from './types';

export const translations: Record<string, Translation> = {
  fr,
  en,
  'zh-CN': zhCN,
};

export const defaultLocale = 'fr';

export function getTranslation(locale: string): Translation {
  return translations[locale] || translations[defaultLocale];
}

export function detectLocale(): string {
  if (typeof window === 'undefined') return defaultLocale;
  const lang = navigator.language;
  if (lang.startsWith('zh')) return 'zh-CN';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('fr')) return 'fr';
  return defaultLocale;
}

export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}
