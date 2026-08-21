'use client'

import { useTranslation } from '@/components/LanguageProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const navLinks = [
    { label: t.nav.artists, href: '/artistas' },
    { label: t.nav.gallery, href: '/galeria-virtual' },
    { label: t.nav.events, href: '/#eventos' },
    { label: t.nav.categories, href: '/#categorias' },
  ]

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsDark(theme === 'dark' || document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const textClass = scrolled
    ? 'text-foreground'
    : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]'
  const mutedTextClass = scrolled
    ? 'text-foreground/70 hover:text-foreground'
    : 'text-white/85 hover:text-white'
  const lineClass = scrolled ? 'bg-foreground' : 'bg-white'

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-sm shadow-sm py-3'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className={`font-heading text-2xl font-medium tracking-tight transition-colors duration-300 ${textClass}`}>
            Arch<span className="italic">ethereum</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-medium tracking-wide transition-colors duration-300 ${mutedTextClass}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${lineClass}`} />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Language switcher */}
            <LanguageSwitcher className={mutedTextClass} />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${mutedTextClass}`}
              aria-label={t.nav.changeTheme}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu */}
            <button
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 lg:hidden ${mutedTextClass}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-heading text-4xl font-light hover:italic transition-all"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {/* Language toggle in mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.08 + 0.05, duration: 0.4 }}
            >
              <LanguageSwitcher className="text-foreground/50 hover:text-foreground" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
