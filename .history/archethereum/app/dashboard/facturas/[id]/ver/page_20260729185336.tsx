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

  // If no items array, fallback to legacy single-line format
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

      {/* Documento */}
      <div ref={printRef} className="mx-auto max-w-3xl bg-white px-12 py-10 font-sans text-gray-900 print:max-w-none print:px-16 print:py-12">

        {/* Cabecera */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">FACTURA</h1>
            <p className="mt-2 text-lg font-semibold text-gray-700">{invoice.number}</p>
          </div>
          <div className="text-right">
            {/* Estado */}
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: `${status.color}18`, color: status.color, border: `1px solid ${status.color}40` }}
            >
              {status.label}
            </span>
            <p className="mt-2 text-sm text-gray-500">
              Emisión: <strong>{invoice.issue_date}</strong>
            </p>
            {invoice.due_date && (
              <p className="text-sm text-gray-500">
                Vencimiento: <strong>{invoice.due_date}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Emisor / Cliente */}
        <div className="mb-10 grid grid-cols-2 gap-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Proveedor de servicios</p>
            <p className="font-bold text-gray-900">Archethereum</p>
            <p className="text-sm text-gray-600">{invoice.artist_name}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Facturado a</p>
            {invoice.client_name ? (
              <>
                <p className="font-bold text-gray-900">{invoice.client_name}</p>
                {invoice.client_id_number && <p className="text-sm text-gray-600">NIF/CIF: {invoice.client_id_number}</p>}
                {invoice.client_address && <p className="text-sm text-gray-600">{invoice.client_address}</p>}
                {invoice.client_email && <p className="text-sm text-gray-600">{invoice.client_email}</p>}
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">Cliente no especificado</p>
            )}
          </div>
        </div>

        {/* Líneas de factura */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="pb-3 text-left font-bold text-gray-900">Descripción</th>
                <th className="pb-3 text-center font-bold text-gray-900 w-16">Cant.</th>
                <th className="pb-3 text-right font-bold text-gray-900 w-28">Precio unit.</th>
                <th className="pb-3 text-right font-bold text-gray-900 w-16">IVA</th>
                <th className="pb-3 text-right font-bold text-gray-900 w-28">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {hasItems ? (
                invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{EUR(item.unit_price, invoice.currency)}</td>
                    <td className="py-3 text-center text-gray-500">{item.tax_rate}%</td>
                    <td className="py-3 text-right font-medium">{EUR(item.subtotal, invoice.currency)}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">Servicios profesionales</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">{EUR(invoice.subtotal, invoice.currency)}</td>
                  <td className="py-3 text-center text-gray-500">{invoice.tax_rate}%</td>
                  <td className="py-3 text-right font-medium">{EUR(invoice.subtotal, invoice.currency)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mb-10 flex justify-end">
          <div className="w-72">
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{EUR(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Descuento</span>
                  <span>– {EUR(invoice.discount, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA ({invoice.tax_rate}%)</span>
                <span>{EUR(invoice.tax_amount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-gray-900 pt-3 font-bold text-lg">
                <span>TOTAL</span>
                <span>{EUR(invoice.total, invoice.currency)}</span>
              </div>
              {invoice.amount_paid > 0 && (
                <>
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Importe abonado</span>
                    <span>– {EUR(invoice.amount_paid, invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-2">
                    <span>Saldo pendiente</span>
                    <span className={invoice.amount_pending > 0 ? 'text-red-600' : 'text-green-700'}>
                      {EUR(invoice.amount_pending, invoice.currency)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Forma de pago */}
        {invoice.payment_method && (
          <div className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Forma de pago</p>
            <p className="text-sm text-gray-700">{invoice.payment_method}</p>
          </div>
        )}

        {/* Historial de pagos */}
        {invoice.payment_records && invoice.payment_records.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Historial de pagos</p>
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-2 text-right font-semibold">Importe</th>
                  <th className="px-4 py-2 text-left font-semibold">Método</th>
                  <th className="px-4 py-2 text-left font-semibold">Nota</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payment_records.map((p, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2">{p.date}</td>
                    <td className="px-4 py-2 text-right font-medium text-green-700">{EUR(p.amount, invoice.currency)}</td>
                    <td className="px-4 py-2">{p.method || '—'}</td>
                    <td className="px-4 py-2 text-gray-500">{p.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notas para el cliente */}
        {invoice.client_notes && (
          <div className="mb-8 rounded-lg border border-gray-200 px-5 py-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Observaciones</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.client_notes}</p>
          </div>
        )}

        {/* Pie */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>Factura generada el {new Date().toLocaleDateString('es-ES')} · {invoice.number}</p>
          <p className="mt-0.5">Archethereum — Plataforma Artística Premium</p>
          <p className="mt-0.5">En caso de discrepancia, contacte a través del email del proveedor.</p>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 1.2cm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  )
}
