'use client'

import ArtistAutocomplete from '@/components/dashboard/ArtistAutocomplete'
import { Eye, Pencil, Receipt, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface Invoice {
  _id: string; number: string; artist_name: string; concept?: string
  subtotal: number; tax_amount: number; discount: number; total: number
  amount_paid: number; amount_pending: number
  currency: string; status: string
  issue_date: string; due_date?: string; paid_date?: string
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador', paid: 'Pagada', pending: 'Pendiente',
  cancelled: 'Cancelada', overdue: 'Vencida', partial: 'Pago parcial'
}
const STATUS_CLASSES: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-200',
  paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
  cancelled: 'bg-neutral-500/10 text-neutral-500 border-neutral-200',
  overdue: 'bg-red-500/10 text-red-600 border-red-200',
  partial: 'bg-blue-500/10 text-blue-600 border-blue-200',
}
const CONCEPT_TYPES = [
  'Membresía anual', 'Creación de perfil', 'Actualización de perfil',
  'Servicio adicional', 'Consultoría', 'Otro',
]

const PAYMENT_METHODS = ['Transferencia bancaria', 'PayPal', 'Tarjeta de crédito', 'Efectivo', 'Bizum', 'Stripe', 'Otro']

interface InvoiceItem { description: string; quantity: string; unit_price: string; tax_rate: string }
const EMPTY_ITEM: InvoiceItem = { description: '', quantity: '1', unit_price: '', tax_rate: '21' }

const EMPTY_FORM = {
  artist_id: '', artist_name: '',
  // Client
  client_name: '', client_id_number: '', client_email: '', client_address: '',
  // Concept (legacy single-line)
  concept: '', concept_type: 'Membresía anual',
  // Financials
  subtotal: '', tax_rate: '21', discount: '0',
  // Dates & status
  issue_date: '', due_date: '', status: 'pending',
  // Payment
  payment_method: 'Transferencia bancaria',
  // Notes
  client_notes: '', notes: '',
}

const ic = 'w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none'
const lc = 'mb-1 block text-xs uppercase tracking-widest text-foreground/40'

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(EMPTY_FORM)
  const [items, setItems] = useState<InvoiceItem[]>([{ ...EMPTY_ITEM }])
  const [useItems, setUseItems] = useState(false)
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

  // Item helpers
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }])
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof InvoiceItem, val: string) =>
    setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it))

  // Totals preview for items mode
  const itemsTotal = useItems
    ? items.reduce((acc, it) => {
        const qty = parseFloat(it.quantity) || 0
        const price = parseFloat(it.unit_price) || 0
        const tax = parseFloat(it.tax_rate) || 0
        const sub = Math.round(qty * price * 100) / 100
        return acc + sub + Math.round(sub * (tax / 100) * 100) / 100
      }, 0)
    : 0

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const subtotal = parseFloat(form.subtotal) || 0
  const taxRate = parseFloat(form.tax_rate) || 0
  const discount = parseFloat(form.discount) || 0
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  const total = Math.round((subtotal + taxAmount - discount) * 100) / 100

  const startEdit = async (inv: Invoice) => {
    setError('')
    const res = await fetch(`/api/invoices/${inv._id}`)
    const full = await res.json()
    setForm({
      artist_id: full.artist_id || '',
      artist_name: full.artist_name || '',
      client_name: full.client_name || '',
      client_id_number: full.client_id_number || '',
      client_email: full.client_email || '',
      client_address: full.client_address || '',
      concept: full.concept || '',
      concept_type: full.concept || 'Membresía anual',
      subtotal: full.subtotal ? String(full.subtotal) : '',
      tax_rate: full.tax_rate ? String(full.tax_rate) : '21',
      discount: full.discount ? String(full.discount) : '0',
      issue_date: full.issue_date || '',
      due_date: full.due_date || '',
      status: full.status || 'pending',
      payment_method: full.payment_method || 'Transferencia bancaria',
      client_notes: full.client_notes || '',
      notes: full.internal_notes || '',
    })
    if (full.items && full.items.length > 0) {
      setUseItems(true)
      setItems(full.items.map((it: { description: string; quantity: number; unit_price: number; tax_rate: number }) => ({
        description: it.description,
        quantity: String(it.quantity),
        unit_price: String(it.unit_price),
        tax_rate: String(it.tax_rate),
      })))
    } else {
      setUseItems(false)
      setItems([{ ...EMPTY_ITEM }])
    }
    setEditingId(inv._id)
    setCreating(false)
  }

  const closeForm = () => { setCreating(false); setEditingId(null); setForm(EMPTY_FORM); setItems([{ ...EMPTY_ITEM }]); setUseItems(false); setError('') }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.artist_id) { setError('Debes seleccionar un artista'); return }
    if (useItems && items.every((it) => !it.description || !it.unit_price)) {
      setError('Agrega al menos una línea de factura válida'); return
    }
    try {
      const concept = form.concept || form.concept_type
      const payload: Record<string, unknown> = {
        artist_id: form.artist_id,
        artist_name: form.artist_name,
        // Client
        client_name: form.client_name || undefined,
        client_id_number: form.client_id_number || undefined,
        client_email: form.client_email || undefined,
        client_address: form.client_address || undefined,
        // Dates & status
        issue_date: form.issue_date,
        due_date: form.due_date || undefined,
        status: form.status,
        // Payment
        payment_method: form.payment_method || undefined,
        // Notes
        client_notes: form.client_notes || undefined,
        internal_notes: form.notes || undefined,
        discount: parseFloat(form.discount) || 0,
      }

      if (useItems && items.some((it) => it.description && it.unit_price)) {
        payload.items = items
          .filter((it) => it.description && it.unit_price)
          .map((it) => ({
            description: it.description,
            quantity: parseFloat(it.quantity) || 1,
            unit_price: parseFloat(it.unit_price) || 0,
            tax_rate: parseFloat(it.tax_rate) || 21,
          }))
      } else {
        payload.concept = concept
        payload.subtotal = parseFloat(form.subtotal) || 0
        payload.tax_rate = parseFloat(form.tax_rate) || 21
      }

      const res = await fetch(editingId ? `/api/invoices/${editingId}` : '/api/invoices', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al guardar'); return }
      closeForm()
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

  const deleteInvoice = async (id: string) => {
    if (!confirm('¿Eliminar esta factura permanentemente?')) return
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    fetchInvoices()
  }

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((a, b) => a + b.total, 0)
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((a, b) => a + b.total, 0)

  return (
    
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Facturas</h1>
            <p className="mt-1 text-sm text-foreground/50">Facturación y cobros</p>
          </div>
          <button onClick={() => { setCreating(true); setEditingId(null); setForm(EMPTY_FORM); setItems([{ ...EMPTY_ITEM }]); setUseItems(false); setError('') }}
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

        {(creating || editingId) && (
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-light">{editingId ? 'Editar factura' : 'Nueva factura'}</h3>
              <button type="button" onClick={closeForm} className="text-sm text-foreground/40 hover:text-foreground transition-colors">✕ Cancelar</button>
            </div>
            {error && <p className="rounded-lg border border-red-200 bg-red-50/10 px-4 py-2 text-sm text-red-500">{error}</p>}

            {/* Artista y fechas */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Artista y fechas</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <label className={lc}>Artista *</label>
                  <ArtistAutocomplete required value={form.artist_id} valueName={form.artist_name}
                    onChange={(id, name) => setForm({ ...form, artist_id: id, artist_name: name })} />
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
                    <option value="draft">Borrador</option>
                    <option value="paid">Pagada</option>
                  </select>
                </div>
                <div>
                  <label className={lc}>Método de pago</label>
                  <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className={`${ic} bg-background`}>
                    {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Datos del cliente (aparecerán en la factura)</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={lc}>Nombre / Razón social</label>
                  <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    placeholder="Nombre completo o empresa" className={ic} />
                </div>
                <div>
                  <label className={lc}>NIF / CIF</label>
                  <input value={form.client_id_number} onChange={(e) => setForm({ ...form, client_id_number: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Email</label>
                  <input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} className={ic} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lc}>Dirección completa</label>
                  <input value={form.client_address} onChange={(e) => setForm({ ...form, client_address: e.target.value })}
                    placeholder="Calle, nº, CP, ciudad, país" className={ic} />
                </div>
              </div>
            </div>

            {/* Líneas de factura */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40">Líneas de factura</h4>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground/60">
                  <input type="checkbox" checked={useItems} onChange={(e) => setUseItems(e.target.checked)}
                    className="rounded" />
                  Usar múltiples líneas
                </label>
              </div>

              {!useItems ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className={lc}>Tipo de concepto</label>
                    <select value={form.concept_type} onChange={(e) => setForm({ ...form, concept_type: e.target.value })} className={`${ic} bg-background`}>
                      {CONCEPT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lc}>Concepto personalizado</label>
                    <input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })}
                      placeholder="Dejar vacío para usar el tipo" className={ic} />
                  </div>
                  <div>
                    <label className={lc}>Subtotal * (€)</label>
                    <input required={!useItems} type="number" min="0" step="0.01" value={form.subtotal}
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
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="hidden sm:grid grid-cols-12 gap-2 pb-1">
                    {['Descripción', 'Cant.', 'Precio unit. (€)', 'IVA (%)', ''].map((h, i) => (
                      <span key={i} className={`text-[10px] uppercase tracking-widest text-foreground/40 ${i === 0 ? 'col-span-5' : i < 4 ? 'col-span-2' : 'col-span-1'}`}>{h}</span>
                    ))}
                  </div>
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input value={it.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Descripción del servicio" className={`${ic} col-span-12 sm:col-span-5`} />
                      <input type="number" min="1" value={it.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                        className={`${ic} col-span-4 sm:col-span-2`} />
                      <input type="number" min="0" step="0.01" value={it.unit_price} onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                        placeholder="0.00" className={`${ic} col-span-4 sm:col-span-2`} />
                      <input type="number" min="0" max="100" value={it.tax_rate} onChange={(e) => updateItem(idx, 'tax_rate', e.target.value)}
                        className={`${ic} col-span-3 sm:col-span-2`} />
                      <button type="button" onClick={() => removeItem(idx)}
                        className="col-span-1 flex justify-center text-destructive hover:text-destructive/70 text-lg">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={addItem}
                    className="mt-1 rounded-lg border border-dashed border-border px-4 py-2 text-xs text-foreground/50 hover:border-foreground/40 hover:text-foreground transition-colors w-full">
                    + Añadir línea
                  </button>
                  {itemsTotal > 0 && (
                    <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm flex justify-between font-medium mt-2">
                      <span>Total estimado (con IVA)</span>
                      <span>€{itemsTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              )}

              {!useItems && subtotal > 0 && (
                <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
                  <div className="flex justify-between text-foreground/60"><span>Subtotal</span><span>€{subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between text-foreground/60"><span>IVA ({form.tax_rate}%)</span><span>€{taxAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                  {discount > 0 && <div className="flex justify-between text-foreground/60"><span>Descuento</span><span>-€{discount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>}
                  <div className="flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><span>€{total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={lc}>Nota para el cliente (aparece en la factura)</label>
                <textarea rows={2} value={form.client_notes} onChange={(e) => setForm({ ...form, client_notes: e.target.value })}
                  placeholder="Gracias por confiar en nuestros servicios..." className={`${ic} resize-none`} />
              </div>
              <div>
                <label className={lc}>Notas internas (privadas)</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Contexto interno, acuerdos verbales..." className={`${ic} resize-none`} />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90">{editingId ? 'Guardar cambios' : 'Crear factura'}</button>
              <button type="button" onClick={closeForm} className="rounded-full border border-border px-6 py-2.5 text-sm hover:border-foreground">Cancelar</button>
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
                <tr>{['Número', 'Artista', 'Total', 'Pendiente', 'Estado', 'Emisión', 'Vencimiento', 'Acciones'].map((h) =>
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest text-foreground/40">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground/60">{inv.number}</td>
                    <td className="px-4 py-3 font-medium">{inv.artist_name}</td>
                    <td className="px-4 py-3 font-medium">€{(inv.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-sm">
                      {inv.amount_pending > 0
                        ? <span className="text-red-500">€{inv.amount_pending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                        : <span className="text-green-600">✓ Al día</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_CLASSES[inv.status] || ''}`}>{STATUS_LABEL[inv.status] || inv.status}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/50">{new Date(inv.issue_date).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-3 text-foreground/50">{inv.due_date ? new Date(inv.due_date).toLocaleDateString('es-ES') : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/facturas/${inv._id}/ver`}
                          title="Ver factura completa / Exportar PDF"
                          className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs text-background hover:bg-foreground/80 transition-colors"
                        >
                          <Eye size={12} /> Ver / PDF
                        </Link>
                        <button
                          onClick={() => startEdit(inv)}
                          title="Editar factura"
                          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:border-foreground hover:bg-muted transition-colors"
                        >
                          <Pencil size={12} /> Editar
                        </button>
                        {inv.status === 'pending' && (
                          <button onClick={() => updateStatus(inv._id, 'paid', new Date().toISOString().split('T')[0])}
                            className="rounded-lg border border-emerald-300 px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors">
                            Pagada
                          </button>
                        )}
                        <button
                          onClick={() => deleteInvoice(inv._id)}
                          title="Eliminar factura"
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
    
  )
}
