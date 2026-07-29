'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { BarChart3, ChevronLeft, ChevronRight, Download, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface MonthData {
  month: string
  revenue: number
  invoiced: number
  contracts: number
  newArtists: number
  newArtworks: number
  exhibitions: number
}

interface Metrics {
  year: number
  artists: { total: number; active: number; hidden: number; featured: number }
  revenue: { monthly: number; yearly: number; total: number }
  invoices: { pending: number; paid: number }
  contracts: { active: number; expired: number }
  subscriptions: { expired: number; expiring_soon: number }
  revenueChart: Array<{ month: string; revenue: number }>
  monthlyChart: MonthData[]
}

function BarChartViz({
  data,
  valueKey,
  color = 'currentColor',
  format = (v: number) => String(v),
  label,
}: {
  data: MonthData[]
  valueKey: keyof MonthData
  color?: string
  format?: (v: number) => string
  label: string
}) {
  const values = data.map((d) => Number(d[valueKey]))
  const max = Math.max(...values, 1)

  // Fixed coordinate system: 1200 wide, 140 tall chart area + 24 for labels
  const W = 1200
  const CH = 140   // chart area height
  const LH = 24    // label area height
  const n = data.length
  const slotW = W / n
  const barW = slotW * 0.65
  const barX = (i: number) => i * slotW + (slotW - barW) / 2

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">{label}</p>
      <div className="relative rounded-xl border border-border bg-background px-4 pb-2 pt-4">
        {/* Fixed height container — avoids aspect-ratio stretch bug */}
        <svg
          viewBox={`0 0 ${W} ${CH + LH}`}
          className="w-full"
          style={{ height: '180px' }}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1="0" y1={CH - CH * frac}
              x2={W}  y2={CH - CH * frac}
              stroke="currentColor" strokeOpacity="0.08" strokeWidth="2"
            />
          ))}

          {data.map((d, i) => {
            const val = Number(d[valueKey])
            const bh = max > 0 ? (val / max) * CH : 0
            const x = barX(i)
            const y = CH - bh

            return (
              <g key={d.month}>
                <rect
                  x={x} y={y}
                  width={barW} height={bh}
                  rx={Math.min(6, barW * 0.15)}
                  fill={color}
                  opacity={val === 0 ? 0.12 : 0.88}
                />
                <title>{`${d.month}: ${format(val)}`}</title>
                <text
                  x={i * slotW + slotW / 2}
                  y={CH + LH - 4}
                  textAnchor="middle"
                  fontSize="16"
                  fill="currentColor"
                  opacity="0.4"
                >
                  {d.month}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Max label */}
        <div className="absolute right-5 top-4 text-[10px] text-foreground/30">{format(max)}</div>
      </div>
    </div>
  )
}

const EUR = (v: number) => `€${v.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

type ChartKey = 'revenue' | 'invoiced' | 'contracts' | 'newArtists' | 'newArtworks' | 'exhibitions'

const CHART_TABS: Array<{ key: ChartKey; label: string; color: string; format: (v: number) => string }> = [
  { key: 'revenue', label: 'Ingresos cobrados', color: '#22c55e', format: EUR },
  { key: 'invoiced', label: 'Facturado', color: '#3b82f6', format: EUR },
  { key: 'contracts', label: 'Contratos', color: '#a855f7', format: (v) => String(v) },
  { key: 'newArtists', label: 'Artistas nuevos', color: '#f97316', format: (v) => String(v) },
  { key: 'newArtworks', label: 'Obras creadas', color: '#ec4899', format: (v) => String(v) },
  { key: 'exhibitions', label: 'Exposiciones', color: '#eab308', format: (v) => String(v) },
]

export default function ReportesPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [activeChart, setActiveChart] = useState<ChartKey>('revenue')

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/metrics?year=${year}`)
      const data = await res.json()
      setMetrics(data)
    } finally {
      setLoading(false)
    }
  }, [year])

  useEffect(() => { loadMetrics() }, [loadMetrics])

  const exportCSV = () => {
    if (!metrics) return
    const rows = [
      ['Año', year], [''],
      ['ARTISTAS'], ['Total', metrics.artists.total], ['Activos', metrics.artists.active], ['Ocultos', metrics.artists.hidden], [''],
      ['FINANZAS'], ['Ingresos este mes', metrics.revenue.monthly], ['Ingresos año', metrics.revenue.yearly], ['Total histórico', metrics.revenue.total], [''],
      ['DESGLOSE MENSUAL'], ['Mes', 'Cobrado', 'Facturado', 'Contratos', 'Artistas', 'Obras', 'Expos'],
      ...(metrics.monthlyChart || []).map((m) => [m.month, m.revenue, m.invoiced, m.contracts, m.newArtists, m.newArtworks, m.exhibitions]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `reporte-archethereum-${year}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const activeTab = CHART_TABS.find((t) => t.key === activeChart) || CHART_TABS[0]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Reportes</h1>
            <p className="mt-1 text-sm text-foreground/50">Análisis ejecutivo con desglose mensual</p>
          </div>
          <button onClick={exportCSV} disabled={!metrics} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-foreground transition-colors disabled:opacity-40">
            <Download size={14} /> Exportar CSV
          </button>
        </div>

        {/* Year selector */}
        <div className="flex items-center gap-3">
          <button onClick={() => setYear((y) => y - 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-foreground transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="font-heading text-2xl font-light w-16 text-center">{year}</span>
          <button onClick={() => setYear((y) => y + 1)} disabled={year >= new Date().getFullYear()} className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-foreground transition-colors disabled:opacity-30">
            <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="img-shimmer h-28 rounded-xl" />)}
          </div>
        ) : metrics ? (
          <>
            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Ingresos del año', value: EUR(metrics.revenue.yearly), sub: `Total histórico: ${EUR(metrics.revenue.total)}`, color: 'text-green-600' },
                { label: 'Facturas pendientes', value: metrics.invoices.pending, sub: `Pagadas: ${metrics.invoices.paid}`, color: metrics.invoices.pending > 0 ? 'text-amber-500' : 'text-foreground' },
                { label: 'Contratos activos', value: metrics.contracts.active, sub: `Vencidos: ${metrics.contracts.expired}`, color: 'text-blue-500' },
                { label: 'Artistas activos', value: metrics.artists.active, sub: `Total: ${metrics.artists.total} · Ocultos: ${metrics.artists.hidden}`, color: 'text-foreground' },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-border bg-background p-5 space-y-1">
                  <p className="text-xs uppercase tracking-widest text-foreground/40">{card.label}</p>
                  <p className={`font-heading text-3xl font-light ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-foreground/40">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="rounded-xl border border-border bg-background p-6 space-y-5">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-foreground/40" />
                <span className="text-xs uppercase tracking-widest text-foreground/40">Desglose mensual — {year}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CHART_TABS.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveChart(tab.key)} className={`rounded-full px-4 py-1.5 text-xs transition-colors ${activeChart === tab.key ? 'bg-foreground text-background' : 'bg-muted text-foreground/60 hover:bg-foreground/10'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              {metrics.monthlyChart && (
                <BarChartViz data={metrics.monthlyChart} valueKey={activeTab.key} color={activeTab.color} format={activeTab.format} label={`${activeTab.label} — ${year}`} />
              )}
              {metrics.monthlyChart && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {['Mes', 'Cobrado', 'Facturado', 'Contratos', 'Artistas', 'Obras', 'Expos'].map((h, i) => (
                          <th key={h} className={`py-2 ${i === 0 ? 'text-left pr-4' : 'text-right pr-4 last:pr-0'} uppercase tracking-widest text-foreground/40`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {metrics.monthlyChart.map((m) => (
                        <tr key={m.month} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 pr-4 font-medium capitalize">{m.month}</td>
                          <td className="py-2.5 pr-4 text-right text-green-600">{m.revenue > 0 ? EUR(m.revenue) : '—'}</td>
                          <td className="py-2.5 pr-4 text-right">{m.invoiced > 0 ? EUR(m.invoiced) : '—'}</td>
                          <td className="py-2.5 pr-4 text-right">{m.contracts || '—'}</td>
                          <td className="py-2.5 pr-4 text-right">{m.newArtists || '—'}</td>
                          <td className="py-2.5 pr-4 text-right">{m.newArtworks || '—'}</td>
                          <td className="py-2.5 text-right">{m.exhibitions || '—'}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-foreground/20 font-medium">
                        <td className="py-3 pr-4">Total</td>
                        <td className="py-3 pr-4 text-right text-green-600">{EUR(metrics.monthlyChart.reduce((a, m) => a + m.revenue, 0))}</td>
                        <td className="py-3 pr-4 text-right">{EUR(metrics.monthlyChart.reduce((a, m) => a + m.invoiced, 0))}</td>
                        <td className="py-3 pr-4 text-right">{metrics.monthlyChart.reduce((a, m) => a + m.contracts, 0)}</td>
                        <td className="py-3 pr-4 text-right">{metrics.monthlyChart.reduce((a, m) => a + m.newArtists, 0)}</td>
                        <td className="py-3 pr-4 text-right">{metrics.monthlyChart.reduce((a, m) => a + m.newArtworks, 0)}</td>
                        <td className="py-3 text-right">{metrics.monthlyChart.reduce((a, m) => a + m.exhibitions, 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {metrics.subscriptions.expiring_soon > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-700">
                ⚠️ {metrics.subscriptions.expiring_soon} suscripción{metrics.subscriptions.expiring_soon !== 1 ? 'es' : ''} vencen en los próximos 30 días.
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <BarChart3 size={32} className="mx-auto mb-4 text-foreground/20" />
            <p className="text-foreground/40">No se pudieron cargar los reportes</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
