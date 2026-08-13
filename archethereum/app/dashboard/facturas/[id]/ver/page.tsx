'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  subtotal: number
}

interface PaymentRecord {
  date: string
  amount: number
  method?: string
  note?: string
}

interface Invoice {
  _id: string
  number: string
  series: string
  artist_name: string
  concept?: string
  client_name?: string
  client_id_number?: string
  client_address?: string
  client_email?: string
  items: InvoiceItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount: number
  total: number
  amount_paid: number
  amount_pending: number
  currency: string
  status: string
  issue_date: string
  due_date?: string
  paid_date?: string
  payment_records: PaymentRecord[]
  payment_method?: string
  contract_id?: string
  internal_notes?: string
  client_notes?: string
  createdAt: string
}

const EUR = (v: number, cur = 'EUR') =>
  `${(v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: 'Borrador', color: '#6b7280' },
  pending: { label: 'Pendiente de pago', color: '#d97706' },
  paid: { label: 'Pagada', color: '#059669' },
  partial: { label: 'Pago parcial', color: '#2563eb' },
  overdue: { label: 'Vencida', color: '#dc2626' },
  cancelled: { label: 'Cancelada', color: '#9ca3af' },
}

export default function FacturaVerPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchInvoice = useCallback(async () => {
    const res = await fetch(`/api/invoices/${params.id}`)
    if (res.ok) setInvoice(await res.json())
    setLoading(false)
  }, [params.id])

  useEffect(() => { fetchInvoice() }, [fetchInvoice])

  const handlePrint = () => window.print()

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-white"><p className="text-gray-400">Cargando factura...</p></div>
  }

  if (!invoice) {
    return <div className="flex h-screen items-center justify-center bg-white"><p className="text-gray-400">Factura no encontrada.</p></div>
  }

  const status = STATUS_MAP[invoice.status] || { label: invoice.status, color: '#6b7280' }
  const hasItems = invoice.items && invoice.items.length > 0

  return (
    <>
      {/* Barra de acciones */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3 shadow-sm print:hidden">
        <button onClick={() => router.back()} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
          ← Volver
        </button>
        <span className="flex-1 text-sm font-medium text-gray-600">
          Factura {invoice.number}
        </span>
        <button onClick={handlePrint} className="rounded-lg bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
          🖨 Imprimir / Guardar PDF
        </button>
      </div>

      {/* Documento premium */}
      <div ref={printRef} className="mx-auto max-w-3xl bg-white font-sans text-gray-900 print:max-w-none">

        {/* Banda superior de color */}
        <div className="h-2 w-full bg-gray-900" />

        {/* Cabecera con branding */}
        <div className="flex items-start justify-between px-12 pt-10 pb-8 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 mb-2">Archethereum</p>
            <h1 className="text-5xl font-light tracking-tight text-gray-900 leading-none">FACTURA</h1>
            <p className="mt-3 font-mono text-base font-semibold text-gray-500">{invoice.number}</p>
          </div>
          <div className="text-right">
            <span
              className="inline-block rounded-sm px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ backgroundColor: `${status.color}18`, color: status.color, border: `1px solid ${status.color}40` }}
            >
              {status.label}
            </span>
            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>Emisión: <span className="font-semibold text-gray-700">{new Date(invoice.issue_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
              {invoice.due_date && (
                <p>Vencimiento: <span className="font-semibold text-gray-700">{new Date(invoice.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
              )}
              {invoice.paid_date && (
                <p className="text-green-700">Pagada: <span className="font-semibold">{new Date(invoice.paid_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
              )}
            </div>
          </div>
        </div>

        {/* Emisor / Cliente */}
        <div className="grid grid-cols-2 gap-8 px-12 py-8 bg-gray-50/60">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Prestador de servicios</p>
            <p className="font-bold text-gray-900 text-base">Archethereum</p>
            <p className="text-sm text-gray-600 mt-0.5">{invoice.artist_name}</p>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Facturado a</p>
            {invoice.client_name ? (
              <div className="space-y-0.5">
                <p className="font-bold text-gray-900 text-base">{invoice.client_name}</p>
                {invoice.client_id_number && <p className="text-sm text-gray-500">NIF/CIF: {invoice.client_id_number}</p>}
                {invoice.client_address && <p className="text-sm text-gray-500">{invoice.client_address}</p>}
                {invoice.client_email && <p className="text-sm text-gray-500">{invoice.client_email}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Sin datos de cliente</p>
            )}
          </div>
        </div>

        {/* Tabla de líneas */}
        <div className="px-12 py-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-4 py-3 text-left font-medium text-[11px] uppercase tracking-widest rounded-tl">Descripción</th>
                <th className="px-4 py-3 text-center font-medium text-[11px] uppercase tracking-widest w-16">Cant.</th>
                <th className="px-4 py-3 text-right font-medium text-[11px] uppercase tracking-widest w-28">Precio</th>
                <th className="px-4 py-3 text-right font-medium text-[11px] uppercase tracking-widest w-16">IVA</th>
                <th className="px-4 py-3 text-right font-medium text-[11px] uppercase tracking-widest w-28 rounded-tr">Importe</th>
              </tr>
            </thead>
            <tbody>
              {hasItems ? (
                invoice.items.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                    <td className="px-4 py-3 text-gray-700">{item.description}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{EUR(item.unit_price, invoice.currency)}</td>
                    <td className="px-4 py-3 text-right text-gray-400">{item.tax_rate}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{EUR(item.subtotal, invoice.currency)}</td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700">{invoice.concept || 'Servicios profesionales'}</td>
                  <td className="px-4 py-3 text-center text-gray-500">1</td>
                  <td className="px-4 py-3 text-right text-gray-700">{EUR(invoice.subtotal, invoice.currency)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{invoice.tax_rate}%</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{EUR(invoice.subtotal, invoice.currency)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="flex justify-end px-12 pb-10">
          <div className="w-80">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="space-y-0 divide-y divide-gray-100">
                <div className="flex justify-between px-5 py-2.5 text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700 font-medium">{EUR(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between px-5 py-2.5 text-sm">
                    <span className="text-gray-500">Descuento</span>
                    <span className="text-red-600 font-medium">– {EUR(invoice.discount, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between px-5 py-2.5 text-sm">
                  <span className="text-gray-500">IVA ({invoice.tax_rate}%)</span>
                  <span className="text-gray-700 font-medium">{EUR(invoice.tax_amount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between px-5 py-4 bg-gray-900 text-white">
                  <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold">{EUR(invoice.total, invoice.currency)}</span>
                </div>
                {invoice.amount_paid > 0 && (
                  <>
                    <div className="flex justify-between px-5 py-2.5 text-sm bg-green-50">
                      <span className="text-green-700">Importe abonado</span>
                      <span className="text-green-700 font-medium">– {EUR(invoice.amount_paid, invoice.currency)}</span>
                    </div>
                    <div className="flex justify-between px-5 py-2.5 text-sm font-semibold bg-gray-50">
                      <span className={invoice.amount_pending > 0 ? 'text-red-600' : 'text-green-700'}>
                        {invoice.amount_pending > 0 ? 'Saldo pendiente' : '✓ Saldado'}
                      </span>
                      <span className={invoice.amount_pending > 0 ? 'text-red-600' : 'text-green-700'}>
                        {EUR(invoice.amount_pending, invoice.currency)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Método de pago */}
        {invoice.payment_method && (
          <div className="mx-12 mb-6 flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-100 px-5 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Forma de pago</span>
            <span className="text-sm text-gray-700 font-medium">{invoice.payment_method}</span>
          </div>
        )}

        {/* Historial de pagos */}
        {invoice.payment_records && invoice.payment_records.length > 0 && (
          <div className="px-12 mb-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Historial de pagos</p>
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  {['Fecha', 'Importe', 'Método', 'Nota'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.payment_records.map((p, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-gray-700">{p.date}</td>
                    <td className="px-4 py-2.5 font-semibold text-green-700">{EUR(p.amount, invoice.currency)}</td>
                    <td className="px-4 py-2.5 text-gray-500">{p.method || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-400">{p.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notas cliente */}
        {invoice.client_notes && (
          <div className="mx-12 mb-8 rounded-lg border-l-4 border-gray-300 bg-gray-50 px-5 py-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Observaciones</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{invoice.client_notes}</p>
          </div>
        )}

        {/* Pie premium */}
        <div className="mx-12 mt-4 mb-10 border-t border-gray-200 pt-6 flex items-start justify-between">
          <div className="text-xs text-gray-400 space-y-0.5">
            <p className="font-semibold text-gray-500">Archethereum — Plataforma Artística Premium</p>
            <p>En caso de discrepancia, contacte con el proveedor antes de la fecha de vencimiento.</p>
            <p>Documento generado el {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="text-right text-xs text-gray-300 font-mono">
            <p>{invoice.number}</p>
          </div>
        </div>

        {/* Banda inferior */}
        <div className="h-1 w-full bg-gray-900" />
      </div>

      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  )
}
