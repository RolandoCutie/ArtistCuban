'use client'

import {
    BarChart3,
    BookOpen,
    ChevronLeft,
    CreditCard,
    FileText,
    GalleryHorizontal,
    LayoutDashboard,
    LogOut,
    Menu,
    Receipt,
    Settings,
    Users,
    X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Artistas', href: '/dashboard/artistas', icon: Users },
  { label: 'Exposiciones', href: '/dashboard/exposiciones', icon: GalleryHorizontal },
  { label: 'Suscripciones', href: '/dashboard/suscripciones', icon: CreditCard },
  { label: 'Contratos', href: '/dashboard/contratos', icon: FileText },
  { label: 'Facturas', href: '/dashboard/facturas', icon: Receipt },
  { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { label: 'Catálogo', href: '/dashboard/catalogo', icon: BookOpen },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    // Navegación dura para limpiar el estado de Next.js y forzar el middleware
    window.location.href = '/dashboard'
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="font-heading text-xl font-medium tracking-tight">
            Arch<span className="italic">ethereum</span>
          </Link>
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-foreground/40">admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-foreground/60 hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-1">
          <a
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground/40 hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft size={14} />
            Ver sitio público
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground/40 hover:text-red-500 hover:bg-red-50/10 transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/dashboard" className="font-heading text-xl font-medium">
          Arch<span className="italic">ethereum</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={22} className="text-foreground" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-background shadow-2xl flex flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <span className="font-heading text-xl font-medium">Admin</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="hover:text-foreground text-foreground/60 hover:bg-muted rounded-full p-2 transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-foreground/60 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-border p-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground/40 hover:text-foreground hover:bg-muted transition-colors"
              >
                <ChevronLeft size={14} />
                Ver sitio público
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground/40 hover:text-red-500 hover:bg-red-50/10 transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:min-h-screen">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
