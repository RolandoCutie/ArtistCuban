'use client'

import ArtistAutocomplete from '@/components/dashboard/ArtistAutocomplete'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Calendar, CheckCircle, RefreshCw, XCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Subscription {
  _id: string; artist_id: string; artist_name: string
  start_date: string; end_date: string
  status: 'active' | 'pending' | 'suspended' | 'expired'
  amount: number; currency: string; payment_method?: string; notes?: string
}

const STATUS_LABEL: Record<string, string> = { active: 'Activa', pending: 'Pendiente', suspended: 'Suspendida', expired: 'Vencida' }
const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
  suspended: 'bg-blue-500/10 text-blue-600 border-blue-200',
  expired: 'bg-red-500/10 text-red-600 border-red-200',
}

const EMPTY_FORM = {
  artist_id: '', artist_name: '', start_date: '', end_date: '',
  amount: '', currency: 'EUR', payment_method: '', notes: '', status: 'active',
}

const ic = 'w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none'
const lc = 'mb-1 block text-xs uppercase tracking-widest text-foreground/40'

export default function SuscripcionesPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const fetchSubs = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter !== 'all' ? `/api/subscriptions?status=${filter}` : '/api/subscriptions'
      const res = await fetch(url)
      const data = await res.json()
      setSubs(Array.isArray(data) ? data : [])
    } finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetchSubs() }, [fetchSubs])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.artist_id) { setError('Debes seleccionar un artista'); return }
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) || 0 }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al crear'); return }
      setCreating(false)
      setForm(EMPTY_FORM)
      fetchSubs()
    } catch { setError('Error de conexión') }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/subscriptions/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchSubs()
  }

  const daysRemaining = (endDate: string) => Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Suscripciones</h1>
            <p className="mt-1 text-sm text-foreground/50">Membresías anuales de los artistas</p>
          </div>
          <button onClick={() => { setCreating(true); setError('') }}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
            + Nueva suscripción
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'pending', 'suspended', 'expired'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${filter === s ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/50 hover:border-foreground/50'}`}>
              {s === 'all' ? 'Todas' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {creating && (
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading text-xl font-light">Nueva suscripción</h3>
            {error && <p className="rounded-lg border border-red-200 bg-red-50/10 px-4 py-2 text-sm text-red-500">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={lc}>Artista *</label>
                <ArtistAutocomplete required
                  value={form.artist_id} valueName={form.artist_name}
                  onChange={(id, name) => setForm({ ...form, artist_id: id, artist_name: name })} />
              </div>
              <div>
                <label className={lc}>Estado</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${ic} bg-background`}>
                  <option value="active">Activa</option>
                  <option value="pending">Pendiente</option>
                  <option value="suspended">Suspendida</option>
                </select>
              </div>
              <div>
                <label className={lc}>Monto (€) *</label>
                <input required type="number" min="0" step="0.01" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} className={ic} />
              </div>
              <div>
                <label className={lc}>Fecha inicio *</label>
                <input required type="date" value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={`${ic} bg-background`} />
              </div>
              <div>
                <label className={lc}>Fecha fin *</label>
                <input required type="date" value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={`${ic} bg-background`} />
              </div>
              <div>
                <label className={lc}>Forma de pago</label>
                <input value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  placeholder="Transferencia, tarjeta..." className={ic} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={lc}>Notas</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={ic} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90">Crear suscripción</button>
              <button type="button" onClick={() => { setCreating(false); setError('') }} className="rounded-full border border-border px-6 py-2.5 text-sm hover:border-foreground">Cancelar</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="img-shimmer h-20 rounded-xl" />)}</div>
        ) : subs.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar size={32} className="mx-auto mb-4 text-foreground/20" />
            <p className="text-foreground/40">No hay suscripciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map((sub) => {
              const days = daysRemaining(sub.end_date)
              const isExpiring = sub.status === 'active' && days <= 30 && days > 0
              return (
                <div key={sub._id} className={`flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center ${isExpiring ? 'border-amber-300 bg-amber-50/5' : 'border-border bg-card'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <p className="font-heading text-lg font-medium">{sub.artist_name}</p>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_CLASSES[sub.status]}`}>{STATUS_LABEL[sub.status]}</span>
                      {isExpiring && <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-amber-700">Vence en {days} días</span>}
                      {sub.status === 'active' && days <= 0 && <span className="rounded-full border border-red-300 bg-red-100 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-red-700">VENCIDA</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-foreground/50">
                      <span>{new Date(sub.start_date).toLocaleDateString('es-ES')} → {new Date(sub.end_date).toLocaleDateString('es-ES')}</span>
                      <span className="font-medium text-foreground/70">€{sub.amount.toLocaleString('es-ES')}</span>
                      {sub.payment_method && <span>{sub.payment_method}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {sub.status !== 'active' && (
                      <button onClick={() => updateStatus(sub._id, 'active')} title="Activar"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-colors">
                        <CheckCircle size={15} />
                      </button>
                    )}
                    {sub.status === 'active' && (
                      <button onClick={() => updateStatus(sub._id, 'suspended')} title="Suspender"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 transition-colors">
                        <XCircle size={15} />
                      </button>
                    )}
                    <button onClick={() => updateStatus(sub._id, 'active')} title="Renovar"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors">
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
