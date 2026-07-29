'use client'

import ArtistAutocomplete from '@/components/dashboard/ArtistAutocomplete'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Receipt } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Invoice {
  _id: string; number: string; artist_name: string; concept: string
  subtotal: number; tax_amount: number; discount: number; total: number
  currency: string; status: 'paid' | 'pending' | 'cancelled' | 'overdue'
  issue_date: string; due_date?: string; paid_date?: string
}

const STATUS_LABEL: Record<string, string> = { paid: 'Pagada', pending: 'Pendiente', cancelled: 'Cancelada', overdue: 'Vencida' }
const STATUS_CLASSES: Record<string, string> = {
  paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
  cancelled: 'bg-neutral-500/10 text-neutral-500 border-neutral-200',
  overdue: 'bg-red-500/10 text-red-600 border-red-200',
}
const CONCEPT_TYPES = [
  'Membresía anual', 'Creación de perfil', 'Actualización de perfil',
  'Servicio adicional', 'Consultoría', 'Otro',
]

const EMPTY_FORM = {
  artist_id: '', artist_name: '', concept: '', concept_type: 'Membresía anual',
  subtotal: '', tax_rate: '21', discount: '0', issue_date: '', due_date: '', status: 'pending', notes: '',
}

const ic = 'w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none'
const lc = 'mb-1 block text-xs uppercase tracking-widest text-foreground/40'

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter !== 'all' ? `/api/invoices?status=${filter}` : '/api/invoices'
      const res = await fetch(url)
      const data = await res.json()
      setInvoices(Array.isArray(data) ? data : [])
    } finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const subtotal = parseFloat(form.subtotal) || 0
  const taxRate = parseFloat(form.tax_rate) || 0
  const discount = parseFloat(form.discount) || 0
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  const total = Math.round((subtotal + taxAmount - discount) * 100) / 100

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.artist_id) { setError('Debes seleccionar un artista'); return }
    if (!form.concept && !form.concept_type) { setError('Debes indicar el concepto'); return }
    try {
      const concept = form.concept || form.concept_type
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_id: form.artist_id, artist_name: form.artist_name,
          concept, subtotal: parseFloat(form.subtotal) || 0,
          tax_rate: parseFloat(form.tax_rate) || 21,
          discount: parseFloat(form.discount) || 0,
          issue_date: form.issue_date, due_date: form.due_date || undefined,
          status: form.status,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al crear'); return }
      setCreating(false)
      setForm(EMPTY_FORM)
      fetchInvoices()
    } catch { setError('Error de conexión') }
  }

  const updateStatus = async (id: string, status: string, paid_date?: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(paid_date ? { paid_date } : {}) }),
    })
    fetchInvoices()
  }

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((a, b) => a + b.total, 0)
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((a, b) => a + b.total, 0)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Facturas</h1>
            <p className="mt-1 text-sm text-foreground/50">Facturación y cobros</p>
          </div>
          <button onClick={() => { setCreating(true); setError('') }}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
            + Nueva factura
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/10 p-5">
            <p className="text-xs uppercase tracking-widest text-emerald-600/60">Total cobrado</p>
            <p className="mt-1 font-heading text-3xl font-light text-emerald-600">€{totalPaid.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/10 p-5">
            <p className="text-xs uppercase tracking-widest text-amber-600/60">Pendiente de cobro</p>
            <p className="mt-1 font-heading text-3xl font-light text-amber-600">€{totalPending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'paid', 'pending', 'overdue', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${filter === s ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/50 hover:border-foreground/50'}`}>
              {s === 'all' ? 'Todas' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {creating && (
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading text-xl font-light">Nueva factura</h3>
            {error && <p className="rounded-lg border border-red-200 bg-red-50/10 px-4 py-2 text-sm text-red-500">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={lc}>Artista / Cliente *</label>
                <ArtistAutocomplete required
                  value={form.artist_id} valueName={form.artist_name}
                  onChange={(id, name) => setForm({ ...form, artist_id: id, artist_name: name })} />
              </div>
              <div>
                <label className={lc}>Tipo de concepto</label>
                <select value={form.concept_type} onChange={(e) => setForm({ ...form, concept_type: e.target.value })} className={`${ic} bg-background`}>
                  {CONCEPT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Concepto personalizado (opcional)</label>
                <input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })}
                  placeholder="Dejar vacío para usar el tipo" className={ic} />
              </div>
              <div>
                <label className={lc}>Subtotal (€) *</label>
                <input required type="number" min="0" step="0.01" value={form.subtotal}
                  onChange={(e) => setForm({ ...form, subtotal: e.target.value })} className={ic} />
              </div>
              <div>
                <label className={lc}>IVA (%)</label>
                <input type="number" min="0" max="100" value={form.tax_rate}
                  onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} className={ic} />
              </div>
              <div>
                <label className={lc}>Descuento (€)</label>
                <input type="number" min="0" step="0.01" value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })} className={ic} />
              </div>
              <div>
                <label className={lc}>Fecha emisión *</label>
                <input required type="date" value={form.issue_date}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className={`${ic} bg-background`} />
              </div>
              <div>
                <label className={lc}>Fecha vencimiento</label>
                <input type="date" value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={`${ic} bg-background`} />
              </div>
              <div>
                <label className={lc}>Estado</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${ic} bg-background`}>
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagada</option>
                </select>
              </div>
            </div>
            {subtotal > 0 && (
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
                <div className="flex justify-between text-foreground/60"><span>Subtotal</span><span>€{subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-foreground/60"><span>IVA ({form.tax_rate}%)</span><span>€{taxAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                {discount > 0 && <div className="flex justify-between text-foreground/60"><span>Descuento</span><span>-€{discount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>}
                <div className="flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><span>€{total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
              </div>
            )}
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90">Crear factura</button>
              <button type="button" onClick={() => { setCreating(false); setError('') }} className="rounded-full border border-border px-6 py-2.5 text-sm hover:border-foreground">Cancelar</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="img-shimmer h-16 rounded-xl" />)}</div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center"><Receipt size={32} className="mx-auto mb-4 text-foreground/20" /><p className="text-foreground/40">No hay facturas</p></div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>{['Número', 'Artista', 'Concepto', 'Total', 'Estado', 'Emisión', 'Acción'].map((h) =>
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest text-foreground/40">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground/60">{inv.number}</td>
                    <td className="px-4 py-3 font-medium">{inv.artist_name}</td>
                    <td className="px-4 py-3 text-foreground/60 max-w-[180px] truncate">{inv.concept}</td>
                    <td className="px-4 py-3 font-medium">€{inv.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_CLASSES[inv.status]}`}>{STATUS_LABEL[inv.status]}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/50">{new Date(inv.issue_date).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-3">
                      {inv.status === 'pending' && (
                        <button onClick={() => updateStatus(inv._id, 'paid', new Date().toISOString().split('T')[0])}
                          className="rounded-full border border-emerald-300 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors">
                          Marcar pagada
                        </button>
                      )}
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
