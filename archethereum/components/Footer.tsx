'use client'

import { useTranslation } from '@/components/LanguageProvider'
import { AtSign, Globe, Play } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const siteLinks = [
    { label: t.footer.home, href: '/' },
    { label: t.footer.artists, href: '/#artistas' },
    { label: t.footer.gallery, href: '/galeria-virtual' },
    { label: t.footer.events, href: '/#eventos' },
    { label: t.footer.categories, href: '/#categorias' },
  ]

  const legalLinks = [
    { label: t.footer.privacy, href: '#' },
    { label: t.footer.terms, href: '#' },
    { label: t.footer.cookies, href: '#' },
    { label: t.footer.contact, href: '#' },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12">
        <div className="grid gap-12 border-t border-border pt-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <p className="font-heading text-2xl font-medium tracking-tight">
              Arch<span className="italic">ethereum</span>
            </p>
            <p className="max-w-sm text-sm text-foreground/50 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex gap-3">
              {[Globe, AtSign, Play].map((Icon, i) => (
                <button
                  key={i}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Site map */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">{t.footer.siteMap}</p>
            <ul className="space-y-3">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">{t.footer.legal}</p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-8 text-xs text-foreground/40 md:flex-row md:justify-between">
          <p>© {year} Archethereum. {t.footer.rights}</p>
          <p>
            <span className="italic">Hyper-Curation™</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
