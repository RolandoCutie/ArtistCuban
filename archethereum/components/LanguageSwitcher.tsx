'use client'

import { useTranslation } from './LanguageProvider'

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useTranslation()

  return (
    <button
      onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
      aria-label={t.nav.changeLang}
      title={t.nav.changeLang}
      className={`flex h-10 items-center gap-1 rounded-full px-2.5 text-xs font-medium uppercase tracking-widest transition-all duration-200 hover:scale-105 ${className}`}
    >
      <span className={locale === 'es' ? 'opacity-100' : 'opacity-40'}>ES</span>
      <span className="opacity-20">|</span>
      <span className={locale === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
    </button>
  )
}
