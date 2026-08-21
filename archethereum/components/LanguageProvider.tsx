'use client'

import { getDictionary, isValidLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n'
import type { TranslationDict } from '@/lib/i18n/es'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface LanguageContextValue {
  locale: Locale
  t: TranslationDict
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getCookieLocale(): Locale {
  if (typeof document === 'undefined') return 'es'
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))
  const val = match ? decodeURIComponent(match[1]) : undefined
  return isValidLocale(val) ? val : 'es'
}

interface Props {
  children: React.ReactNode
  initialLocale?: Locale
}

export function LanguageProvider({ children, initialLocale = 'es' }: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    const cookieLocale = getCookieLocale()
    if (cookieLocale !== locale) setLocaleState(cookieLocale)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=31536000;samesite=lax`
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, t: getDictionary(locale), setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider')
  return ctx
}
