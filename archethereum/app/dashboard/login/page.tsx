'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.replace(from)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Credenciales incorrectas')
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <p className="font-heading text-3xl font-light tracking-tight">
            Arch<span className="italic">ethereum</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-foreground/40">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-foreground/40">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-foreground/40">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50/50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Acceder al panel'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-foreground/30">
          Las credenciales se configuran en las variables de entorno
        </p>
      </div>
    </div>
  )
}

export default function DashboardLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="img-shimmer h-12 w-12 rounded-full" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
