import { AtSign, Globe, Play } from 'lucide-react'
import Link from 'next/link'

const siteLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Artistas', href: '/#artistas' },
  { label: 'Galería Virtual', href: '/galeria-virtual' },
  { label: 'Eventos', href: '/#eventos' },
  { label: 'Categorías', href: '/#categorias' },
  { label: 'Dashboard', href: '/dashboard' },
]

const legalLinks = [
  { label: 'Privacidad', href: '#' },
  { label: 'Términos', href: '#' },
  { label: 'Cookies', href: '#' },
  { label: 'Contacto', href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

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
              La plataforma artística de clase mundial donde cada obra respira y cada artista encuentra
              al coleccionista que comprende su lenguaje.
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

          {/* Mapa del sitio */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Mapa del sitio</p>
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
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Legal</p>
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
          <p>© {year} Archethereum. Todos los derechos reservados.</p>
          <p>
            <span className="italic">Hyper-Curation™</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
