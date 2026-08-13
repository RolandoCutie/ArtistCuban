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
  // Partes
  artist_id: '', artist_name: '',
  client_name: '', client_id_number: '', client_address: '', client_email: '', client_phone: '',
  provider_name: '', provider_id_number: '',
  // Fechas y estado
  date: '', end_date: '', status: 'draft', currency: 'EUR',
  // Objeto y alcance
  subject: '', scope: '', timeline: '', exclusions: '',
  // Económico
  amount: '', tax_rate: '21', discount: '0',
  advance_amount: '', payment_method: 'Transferencia bancaria',
  revisions_included: '2', extra_revision_cost: '',
  // Legal
  scope_change_policy: 'Cualquier modificación fuera del alcance definido se presupuestará por separado y requerirá aprobación escrita del cliente.',
  cancellation_policy: 'La cancelación con más de 15 días de antelación conlleva la retención del anticipo. Cancelaciones posteriores implican el pago del 50% del importe total.',
  refund_policy: 'No se realizarán devoluciones sobre trabajos ya ejecutados y aprobados por el cliente.',
  intellectual_property: 'Los derechos de propiedad intelectual de los entregables finales se transferirán al cliente una vez completado el pago total acordado.',
  confidentiality: 'Ambas partes se comprometen a mantener la confidencialidad de la información intercambiada durante la vigencia del contrato y durante los 2 años posteriores.',
  data_protection: 'Los datos personales serán tratados conforme al Reglamento General de Protección de Datos (RGPD) y la normativa aplicable.',
  limitation_of_liability: 'La responsabilidad máxima del proveedor queda limitada al importe total del contrato. No se responderá por daños indirectos, lucro cesante o pérdida de datos.',
  governing_law: 'España. Juzgados y Tribunales de Madrid.',
  client_obligations: `El cliente se compromete a:\n• Proporcionar los materiales, referencias e información necesaria en los plazos acordados.\n• Responder a las solicitudes de revisión o aprobación en un plazo máximo de 5 días hábiles.\n• Designar a un interlocutor con capacidad de decisión durante toda la vigencia del contrato.\n• Realizar los pagos en las fechas y condiciones establecidas.\n• No solicitar trabajos fuera del alcance definido sin previa solicitud de cambio y presupuesto adicional.`,
  provider_obligations: `El proveedor se compromete a:\n• Ejecutar el proyecto con diligencia, profesionalidad y los más altos estándares de calidad.\n• Respetar los plazos de entrega acordados o notificar con antelación suficiente cualquier desviación justificada.\n• Mantener al cliente informado del progreso del trabajo con la periodicidad pactada.\n• Aplicar los conocimientos técnicos y creativos necesarios para lograr los objetivos del contrato.\n• Guardar confidencialidad sobre toda la información sensible compartida por el cliente.\n• Entregar los archivos finales en los formatos acordados, libres de cargas o reclamaciones de terceros.`,
  warranty_months: '3', internal_notes: '',
  duration_months: '', auto_renew: false,
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
    if (!form.client_name) { setError('El nombre del cliente es obligatorio'); return }
    if (!form.provider_name) { setError('El nombre del proveedor es obligatorio'); return }
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_id: form.artist_id,
          artist_name: form.artist_name,
          client: {
            name: form.client_name,
            id_number: form.client_id_number,
            email: form.client_email,
            phone: form.client_phone,
            address: form.client_address,
          },
          provider: {
            name: form.provider_name,
            id_number: form.provider_id_number,
          },
          date: form.date,
          end_date: form.end_date || undefined,
          status: form.status,
          currency: form.currency,
          amount: parseFloat(form.amount) || 0,
          tax_rate: parseFloat(form.tax_rate) || 21,
          discount: parseFloat(form.discount) || 0,
          advance_amount: form.advance_amount ? parseFloat(form.advance_amount) : undefined,
          payment_method: form.payment_method,
          revisions_included: parseInt(form.revisions_included) || 2,
          subject: form.subject,
          scope: form.scope,
          timeline: form.timeline,
          exclusions: form.exclusions,
          client_obligations: form.client_obligations,
          provider_obligations: form.provider_obligations,
          scope_change_policy: form.scope_change_policy,
          cancellation_policy: form.cancellation_policy,
          refund_policy: form.refund_policy,
          intellectual_property: form.intellectual_property,
          confidentiality: form.confidentiality,
          data_protection: form.data_protection,
          limitation_of_liability: form.limitation_of_liability,
          governing_law: form.governing_law,
          warranty_months: form.warranty_months ? parseInt(form.warranty_months) : 3,
          internal_notes: form.internal_notes,
          duration_months: form.duration_months ? parseInt(form.duration_months) : undefined,
          auto_renew: form.auto_renew,
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

  const deleteContract = async (id: string) => {
    if (!confirm('¿Eliminar este contrato permanentemente? Esta acción no se puede deshacer.')) return
    await fetch(`/api/contracts/${id}`, { method: 'DELETE' })
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
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-light">Nuevo contrato</h3>
              <button type="button" onClick={() => { setCreating(false); setError('') }} className="text-sm text-foreground/40 hover:text-foreground transition-colors">✕ Cancelar</button>
            </div>
            {error && <p className="rounded-lg border border-red-200 bg-red-50/10 px-4 py-2 text-sm text-red-500">{error}</p>}

            {/* Artista y estado */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Artista y estado</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className={lc}>Artista *</label>
                  <ArtistAutocomplete required value={form.artist_id} valueName={form.artist_name}
                    onChange={(id, name) => setForm({ ...form, artist_id: id, artist_name: name })} />
                </div>
                <div>
                  <label className={lc}>Estado</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${ic} bg-background`}>
                    <option value="draft">Borrador</option>
                    <option value="pending">Pendiente firma</option>
                    <option value="active">Activo</option>
                    <option value="signed">Firmado</option>
                  </select>
                </div>
                <div>
                  <label className={lc}>Fecha inicio *</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${ic} bg-background`} />
                </div>
                <div>
                  <label className={lc}>Fecha fin</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={`${ic} bg-background`} />
                </div>
                <div>
                  <label className={lc}>Duración (meses)</label>
                  <input type="number" min="1" value={form.duration_months} onChange={(e) => setForm({ ...form, duration_months: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Moneda</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={`${ic} bg-background`}>
                    {['EUR', 'USD', 'GBP', 'CUP', 'MXN'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Datos del cliente</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={lc}>Nombre completo *</label>
                  <input required value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Nombre o razón social" className={ic} />
                </div>
                <div>
                  <label className={lc}>NIF / CIF</label>
                  <input value={form.client_id_number} onChange={(e) => setForm({ ...form, client_id_number: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Email</label>
                  <input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Teléfono</label>
                  <input value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} className={ic} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lc}>Dirección completa</label>
                  <input value={form.client_address} onChange={(e) => setForm({ ...form, client_address: e.target.value })} placeholder="Calle, nº, ciudad, CP, país" className={ic} />
                </div>
              </div>
            </div>

            {/* Proveedor */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Datos del proveedor (tu empresa)</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={lc}>Nombre / Razón social *</label>
                  <input required value={form.provider_name} onChange={(e) => setForm({ ...form, provider_name: e.target.value })} placeholder="Archethereum / Tu nombre" className={ic} />
                </div>
                <div>
                  <label className={lc}>NIF / CIF</label>
                  <input value={form.provider_id_number} onChange={(e) => setForm({ ...form, provider_id_number: e.target.value })} className={ic} />
                </div>
              </div>
            </div>

            {/* Objeto y alcance */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Objeto y alcance del contrato</h4>
              <div className="space-y-4">
                <div>
                  <label className={lc}>Objeto del contrato *</label>
                  <textarea required rows={2} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="El presente contrato tiene por objeto la prestación de servicios de..." className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Alcance del proyecto</label>
                  <textarea rows={3} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    placeholder="Describe detalladamente qué incluye el servicio..." className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Cronograma de entregas</label>
                  <textarea rows={2} value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    placeholder="Semana 1: Propuesta inicial. Semana 3: Primera revisión..." className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Exclusiones (qué NO incluye)</label>
                  <textarea rows={2} value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })}
                    placeholder="No se incluye: mantenimiento posterior, hosting, campañas publicitarias..." className={`${ic} resize-none`} />
                </div>
              </div>
            </div>

            {/* Económico */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Condiciones económicas</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={lc}>Importe base * ({form.currency})</label>
                  <input required type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>IVA (%)</label>
                  <input type="number" min="0" max="100" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Descuento ({form.currency})</label>
                  <input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Anticipo ({form.currency})</label>
                  <input type="number" min="0" step="0.01" value={form.advance_amount} onChange={(e) => setForm({ ...form, advance_amount: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Forma de pago</label>
                  <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className={`${ic} bg-background`}>
                    {['Transferencia bancaria', 'PayPal', 'Tarjeta de crédito', 'Efectivo', 'Bizum', 'Otro'].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lc}>Revisiones incluidas</label>
                  <input type="number" min="0" value={form.revisions_included} onChange={(e) => setForm({ ...form, revisions_included: e.target.value })} className={ic} />
                </div>
              </div>

              {/* Preview de totales */}
              {parseFloat(form.amount) > 0 && (() => {
                const base = parseFloat(form.amount) || 0
                const disc = parseFloat(form.discount) || 0
                const tax = parseFloat(form.tax_rate) || 0
                const net = base - disc
                const taxAmt = Math.round(net * (tax / 100) * 100) / 100
                const total = Math.round((net + taxAmt) * 100) / 100
                return (
                  <div className="col-span-full rounded-lg bg-muted/50 p-4 text-sm space-y-1.5">
                    <div className="flex justify-between text-foreground/60"><span>Base</span><span>{form.currency} {base.toFixed(2)}</span></div>
                    {disc > 0 && <div className="flex justify-between text-red-500/80"><span>Descuento</span><span>– {form.currency} {disc.toFixed(2)}</span></div>}
                    <div className="flex justify-between text-foreground/60"><span>IVA ({tax}%)</span><span>{form.currency} {taxAmt.toFixed(2)}</span></div>
                    <div className="flex justify-between border-t border-border pt-2 font-medium"><span>TOTAL</span><span>{form.currency} {total.toFixed(2)}</span></div>
                  </div>
                )
              })()}
            </div>

            {/* Obligaciones */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Obligaciones de las partes</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={lc}>Obligaciones del cliente</label>
                  <textarea rows={3} value={form.client_obligations} onChange={(e) => setForm({ ...form, client_obligations: e.target.value })}
                    placeholder="El cliente se compromete a: proporcionar los materiales en el plazo acordado, responder a las solicitudes de aprobación en un máximo de 5 días hábiles..." className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Obligaciones del proveedor</label>
                  <textarea rows={3} value={form.provider_obligations} onChange={(e) => setForm({ ...form, provider_obligations: e.target.value })}
                    placeholder="El proveedor se compromete a: ejecutar el proyecto con diligencia profesional, respetar los plazos acordados, informar de cualquier desviación..." className={`${ic} resize-none`} />
                </div>
              </div>
            </div>

            {/* Cláusulas legales */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Cláusulas legales</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={lc}>Política de cambios de alcance</label>
                  <textarea rows={2} value={form.scope_change_policy} onChange={(e) => setForm({ ...form, scope_change_policy: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Política de cancelación</label>
                  <textarea rows={2} value={form.cancellation_policy} onChange={(e) => setForm({ ...form, cancellation_policy: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Política de reembolsos</label>
                  <textarea rows={2} value={form.refund_policy} onChange={(e) => setForm({ ...form, refund_policy: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Propiedad intelectual</label>
                  <textarea rows={2} value={form.intellectual_property} onChange={(e) => setForm({ ...form, intellectual_property: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Confidencialidad</label>
                  <textarea rows={2} value={form.confidentiality} onChange={(e) => setForm({ ...form, confidentiality: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Protección de datos (RGPD)</label>
                  <textarea rows={2} value={form.data_protection} onChange={(e) => setForm({ ...form, data_protection: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Limitación de responsabilidad</label>
                  <textarea rows={2} value={form.limitation_of_liability} onChange={(e) => setForm({ ...form, limitation_of_liability: e.target.value })} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={lc}>Ley aplicable y jurisdicción</label>
                  <input value={form.governing_law} onChange={(e) => setForm({ ...form, governing_law: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className={lc}>Garantía (meses)</label>
                  <input type="number" min="0" value={form.warranty_months} onChange={(e) => setForm({ ...form, warranty_months: e.target.value })} className={ic} />
                </div>
              </div>
            </div>

            {/* Notas internas */}
            <div>
              <label className={lc}>Notas internas (no aparecen en el contrato)</label>
              <textarea rows={2} value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} className={`${ic} resize-none`} />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-8 py-3 text-sm text-background hover:bg-foreground/90 transition-colors">Crear contrato</button>
              <button type="button" onClick={() => { setCreating(false); setError('') }} className="rounded-full border border-border px-8 py-3 text-sm hover:border-foreground transition-colors">Cancelar</button>
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
                <tr>{['Número', 'Artista', 'Inicio', 'Fin', 'Estado', 'Total con IVA', 'Cambiar estado', 'Acciones'].map((h) =>
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest text-foreground/40">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((c) => (
                  <tr key={c._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground/60">{c.number}</td>
                    <td className="px-4 py-3 font-medium">{c.artist_name}</td>
                    <td className="px-4 py-3 text-foreground/50 whitespace-nowrap">{new Date(c.date).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-3 text-foreground/50 whitespace-nowrap">{c.end_date ? new Date(c.end_date).toLocaleDateString('es-ES') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_CLASSES[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {c.currency || 'EUR'} {(c.amount || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
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
