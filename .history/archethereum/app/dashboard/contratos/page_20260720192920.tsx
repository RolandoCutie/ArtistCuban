'use client'

import ArtistAutocomplete from '@/components/dashboard/ArtistAutocomplete'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Eye, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface Contract {
  _id: string
  number: string
  artist_id: string
  artist_name: string
  date: string
  end_date?: string
  status: 'active' | 'pending' | 'signed' | 'expired' | 'cancelled'
  amount: number
  currency: string
  auto_renew: boolean
  notes?: string
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Activo', pending: 'Pendiente', signed: 'Firmado',
  expired: 'Vencido', cancelled: 'Cancelado',
}
const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
  signed: 'bg-blue-500/10 text-blue-600 border-blue-200',
  expired: 'bg-red-500/10 text-red-600 border-red-200',
  cancelled: 'bg-neutral-500/10 text-neutral-500 border-neutral-200',
}

const EMPTY_FORM = {
  artist_id: '', artist_name: '', date: '', end_date: '',
  amount: '', currency: 'EUR', status: 'pending',
  duration_months: '', auto_renew: false, notes: '',
}

const ic = 'w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none'
const lc = 'mb-1 block text-xs uppercase tracking-widest text-foreground/40'

export default function ContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter !== 'all' ? `/api/contracts?status=${filter}` : '/api/contracts'
      const res = await fetch(url)
      const data = await res.json()
      setContracts(Array.isArray(data) ? data : [])
    } finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetchContracts() }, [fetchContracts])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.artist_id) { setError('Debes seleccionar un artista'); return }
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount) || 0,
          duration_months: form.duration_months ? parseInt(form.duration_months) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al crear'); return }
      setCreating(false)
      setForm(EMPTY_FORM)
      fetchContracts()
    } catch { setError('Error de conexión') }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/contracts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchContracts()
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Contratos</h1>
            <p className="mt-1 text-sm text-foreground/50">Gestión de contratos con artistas</p>
          </div>
          <button onClick={() => { setCreating(true); setError('') }}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
            + Nuevo contrato
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'pending', 'signed', 'expired', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${filter === s ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/50 hover:border-foreground/50'}`}>
              {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {creating && (
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading text-xl font-light">Nuevo contrato</h3>
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
                  <option value="pending">Pendiente</option>
                  <option value="active">Activo</option>
                  <option value="signed">Firmado</option>
                </select>
              </div>
              <div>
                <label className={lc}>Monto (€) *</label>
                <input required type="number" min="0" step="0.01" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} className={ic} />
              </div>
              <div>
                <label className={lc}>Fecha inicio *</label>
                <input required type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${ic} bg-background`} />
              </div>
              <div>
                <label className={lc}>Fecha fin</label>
                <input type="date" value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={`${ic} bg-background`} />
              </div>
              <div>
                <label className={lc}>Duración (meses)</label>
                <input type="number" min="1" value={form.duration_months}
                  onChange={(e) => setForm({ ...form, duration_months: e.target.value })} className={ic} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={lc}>Notas</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={ic} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.auto_renew}
                  onChange={(e) => setForm({ ...form, auto_renew: e.target.checked })}
                  className="h-4 w-4 accent-foreground" />
                Renovación automática
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90">Crear contrato</button>
              <button type="button" onClick={() => { setCreating(false); setError('') }} className="rounded-full border border-border px-6 py-2.5 text-sm hover:border-foreground">Cancelar</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="img-shimmer h-16 rounded-xl" />)}</div>
        ) : contracts.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="mx-auto mb-4 text-foreground/20" />
            <p className="text-foreground/40">No hay contratos{filter !== 'all' ? ` con estado "${STATUS_LABEL[filter]}"` : ''}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>{['Número', 'Artista', 'Fecha', 'Estado', 'Total', 'Cambiar estado', 'Acciones'].map((h) =>
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest text-foreground/40">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((c) => (
                  <tr key={c._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground/60">{c.number}</td>
                    <td className="px-4 py-3 font-medium">{c.artist_name}</td>
                    <td className="px-4 py-3 text-foreground/50">{new Date(c.date).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-3 text-foreground/50">{c.end_date ? new Date(c.end_date).toLocaleDateString('es-ES') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_CLASSES[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">€{c.amount.toLocaleString('es-ES')}</td>
                    <td className="px-4 py-3">
                      <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}
                        className="rounded border border-border bg-transparent px-2 py-1 text-xs focus:outline-none">
                        {['draft', 'pending', 'active', 'signed', 'expired', 'cancelled', 'disputed'].map((s) =>
                          <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/contratos/${c._id}/ver`}
                          title="Ver contrato completo / Exportar PDF"
                          className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs text-background hover:bg-foreground/80 transition-colors"
                        >
                          <Eye size={12} /> Ver / PDF
                        </Link>
                        <button
                          onClick={() => deleteContract(c._id)}
                          title="Eliminar contrato"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
