'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useEffect, useState } from 'react'

interface Metrics {
  artists: { total: number; active: number; hidden: number; featured: number }
  subscriptions: { expired: number; expiring_soon: number }
  contracts: { active: number; expired: number }
  invoices: { pending: number; paid: number }
  revenue: { monthly: number; yearly: number; total: number }
  revenueChart: Array<{ month: string; revenue: number }>
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: 'green' | 'red' | 'yellow'
}) {
  const accentClasses = {
    green: 'text-emerald-500',
    red: 'text-red-500',
    yellow: 'text-amber-500',
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-xs uppercase tracking-widest text-foreground/40">{label}</p>
      <p
        className={`mt-2 font-heading text-4xl font-light ${
          accent ? accentClasses[accent] : 'text-foreground'
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-foreground/40">{sub}</p>}
    </div>
  )
}

function RevenueBar({ data }: { data: Array<{ month: string; revenue: number }> }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)
  return (
    <div className="flex h-48 items-end gap-1">
      {data.map((d) => (
        <div key={d.month} className="group relative flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-foreground/20 transition-all duration-500 group-hover:bg-foreground/60"
            style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue > 0 ? 4 : 0 }}
          />
          <span className="text-[9px] text-foreground/30 rotate-45 origin-left">{d.month}</span>
          {d.revenue > 0 && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
              €{d.revenue.toLocaleString('es-ES')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  useEffect(() => {
    fetch('/api/dashboard/metrics')
      .then((r) => r.json())
      .then((d) => { setMetrics(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const runSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      setSeedMsg(data.message || data.error || 'Completado')
      if (!data.error) {
        const r = await fetch('/api/dashboard/metrics')
        setMetrics(await r.json())
      }
    } finally {
      setSeeding(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Dashboard</h1>
            <p className="mt-1 text-sm text-foreground/50">Resumen general de la plataforma</p>
          </div>
          <button
            onClick={runSeed}
            disabled={seeding}
            className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest text-foreground/50 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            {seeding ? 'Insertando...' : 'Seed datos'}
          </button>
        </div>
        {seedMsg && <p className="text-sm text-foreground/60">{seedMsg}</p>}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="img-shimmer h-28 rounded-xl" />
            ))}
          </div>
        ) : metrics ? (
          <>
            {/* Artistas */}
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-foreground/30">Artistas</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Total artistas" value={metrics.artists.total} />
                <MetricCard label="Activos" value={metrics.artists.active} accent="green" />
                <MetricCard label="Ocultos" value={metrics.artists.hidden} accent="red" />
                <MetricCard label="Destacados" value={metrics.artists.featured} />
              </div>
            </div>

            {/* Finanzas */}
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-foreground/30">Ingresos</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  label="Este mes"
                  value={`€${metrics.revenue.monthly.toLocaleString('es-ES')}`}
                />
                <MetricCard
                  label="Este año"
                  value={`€${metrics.revenue.yearly.toLocaleString('es-ES')}`}
                />
                <MetricCard
                  label="Total histórico"
                  value={`€${metrics.revenue.total.toLocaleString('es-ES')}`}
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-foreground/30">Estado</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Suscripciones vencidas"
                  value={metrics.subscriptions.expired}
                  accent={metrics.subscriptions.expired > 0 ? 'red' : undefined}
                />
                <MetricCard
                  label="Vencen en 30 días"
                  value={metrics.subscriptions.expiring_soon}
                  accent={metrics.subscriptions.expiring_soon > 0 ? 'yellow' : undefined}
                />
                <MetricCard label="Contratos activos" value={metrics.contracts.active} accent="green" />
                <MetricCard
                  label="Facturas pendientes"
                  value={metrics.invoices.pending}
                  accent={metrics.invoices.pending > 0 ? 'yellow' : undefined}
                />
              </div>
            </div>

            {/* Revenue chart */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="mb-6 text-xs uppercase tracking-widest text-foreground/40">
                Ingresos — últimos 12 meses
              </p>
              <RevenueBar data={metrics.revenueChart} />
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground/50">No se pudieron cargar las métricas.</p>
        )}
      </div>
    </DashboardLayout>
  )
}
