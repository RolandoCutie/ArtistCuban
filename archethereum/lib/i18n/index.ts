import en from './en'
import type { TranslationDict } from './es'
import es from './es'

export type Locale = 'es' | 'en'
export type { TranslationDict }
export const DEFAULT_LOCALE: Locale = 'es'
export const LOCALES: Locale[] = ['es', 'en']
export const LOCALE_COOKIE = 'archethereum_locale'

export const dictionaries: Record<Locale, TranslationDict> = { es, en: en as unknown as TranslationDict }

export function getDictionary(locale: Locale): TranslationDict {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]
}

export function isValidLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}
