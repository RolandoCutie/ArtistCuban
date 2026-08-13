'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ContractParty {
  name?: string
  id_number?: string
  address?: string
  email?: string
  phone?: string
  legal_representative?: string
}

interface PaymentScheduleItem {
  description: string
  amount: number
  due_date?: string
  paid: boolean
}

interface Contract {
  _id: string
  number: string
  version: number
  status: string
  date: string
  end_date?: string
  client: ContractParty
  provider: ContractParty
  artist_name: string
  subject: string
  scope: string
  deliverables: string[]
  timeline: string
  exclusions: string
  amount: number
  currency: string
  advance_amount?: number
  advance_paid: boolean
  payment_method?: string
  payment_schedule: PaymentScheduleItem[]
  tax_rate: number
  tax_amount: number
  discount?: number
  total_with_tax: number
  revisions_included: number
  extra_revision_cost?: number
  scope_change_policy: string
  cancellation_policy: string
  refund_policy: string
  intellectual_property: string
  confidentiality: string
  data_protection: string
  limitation_of_liability: string
  governing_law?: string
  dispute_resolution?: string
  hosting_included: boolean
  domain_included: boolean
  maintenance_included: boolean
  maintenance_months?: number
  warranty_months?: number
  warranty_description?: string
  client_obligations: string
  provider_obligations: string
  client_signed: boolean
  client_signed_date?: string
  provider_signed: boolean
  provider_signed_date?: string
  annexes: string[]
  internal_notes?: string
  createdAt: string
}

const EUR = (v: number | undefined | null, cur = 'EUR') =>
  v == null ? '—' : `${v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`

const STATUS_MAP: Record<string, string> = {
  draft: 'Borrador', pending: 'Pendiente firma', active: 'Activo',
  signed: 'Firmado', expired: 'Vencido', cancelled: 'Cancelado', disputed: 'En disputa',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 print:mb-6">
      <h2 className="mb-3 border-b-2 border-gray-800 pb-1 text-base font-bold uppercase tracking-wider text-gray-800 print:border-gray-600">
        {title}
      </h2>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </section>
  )
}

function Clause({ num, title, content }: { num: string; title: string; content: string }) {
  if (!content) return null
  return (
    <div className="mb-4">
      <p className="font-semibold text-gray-800">
        {num}. {title}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-gray-700">{content}</p>
    </div>
  )
}

export default function ContratoVerPage() {
  const params = useParams()
  const router = useRouter()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchContract = useCallback(async () => {
    const res = await fetch(`/api/contracts/${params.id}`)
    if (res.ok) setContract(await res.json())
    setLoading(false)
  }, [params.id])

  useEffect(() => { fetchContract() }, [fetchContract])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-gray-400">Cargando contrato...</p>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-gray-400">Contrato no encontrado.</p>
      </div>
    )
  }

  const subtotal = contract.amount - (contract.discount || 0)

  return (
    <>
      {/* Barra de acciones — solo visible en pantalla, oculta al imprimir */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3 shadow-sm print:hidden">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          ← Volver
        </button>
        <span className="flex-1 text-sm font-medium text-gray-600">
          Contrato {contract.number} — {STATUS_MAP[contract.status] || contract.status}
        </span>
        <button
          onClick={handlePrint}
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
        >
          🖨 Imprimir / Guardar PDF
        </button>
      </div>

      {/* Documento imprimible */}
      <div
        ref={printRef}
        className="mx-auto max-w-3xl bg-white px-12 py-10 font-serif text-gray-900 print:max-w-none print:px-16 print:py-12"
      >
        {/* Cabecera */}
        <div className="mb-10 border-b-4 border-gray-900 pb-6 print:mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900 print:text-2xl">
                CONTRATO DE PRESTACIÓN DE SERVICIOS
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Ref: <strong>{contract.number}</strong> · Versión {contract.version} ·{' '}
                {new Date(contract.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full border border-gray-400 px-3 py-1 text-xs uppercase tracking-widest text-gray-600">
                {STATUS_MAP[contract.status] || contract.status}
              </span>
              {contract.end_date && (
                <p className="mt-1 text-xs text-gray-500">
                  Vigencia hasta: {new Date(contract.end_date).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Partes */}
        <Section title="Partes contratantes">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-2 font-bold text-gray-900">CLIENTE (en adelante, &quot;El Cliente&quot;)</p>
              <table className="w-full text-sm">
                <tbody>
                  {contract.client?.name && <tr><td className="py-0.5 pr-2 font-medium text-gray-600 w-28">Nombre:</td><td>{contract.client.name}</td></tr>}
                  {contract.client?.id_number && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">NIF/CIF:</td><td>{contract.client.id_number}</td></tr>}
                  {contract.client?.address && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Dirección:</td><td>{contract.client.address}</td></tr>}
                  {contract.client?.email && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Email:</td><td>{contract.client.email}</td></tr>}
                  {contract.client?.phone && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Teléfono:</td><td>{contract.client.phone}</td></tr>}
                  {contract.client?.legal_representative && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Representante:</td><td>{contract.client.legal_representative}</td></tr>}
                </tbody>
              </table>
            </div>
            <div>
              <p className="mb-2 font-bold text-gray-900">PROVEEDOR (en adelante, &quot;El Proveedor&quot;)</p>
              <table className="w-full text-sm">
                <tbody>
                  {contract.provider?.name && <tr><td className="py-0.5 pr-2 font-medium text-gray-600 w-28">Nombre:</td><td>{contract.provider.name}</td></tr>}
                  {contract.provider?.id_number && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">NIF/CIF:</td><td>{contract.provider.id_number}</td></tr>}
                  {contract.provider?.address && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Dirección:</td><td>{contract.provider.address}</td></tr>}
                  {contract.provider?.email && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Email:</td><td>{contract.provider.email}</td></tr>}
                  {contract.provider?.phone && <tr><td className="py-0.5 pr-2 font-medium text-gray-600">Teléfono:</td><td>{contract.provider.phone}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 italic">
            Ambas partes reconocen tener capacidad jurídica suficiente para suscribir el presente contrato,
            y acuerdan someterse a los términos y condiciones que a continuación se detallan.
          </p>
        </Section>

        {/* Objeto y alcance */}
        <Section title="Objeto y alcance del contrato">
          <Clause num="1.1" title="Objeto del contrato" content={contract.subject} />
          <Clause num="1.2" title="Alcance del proyecto" content={contract.scope} />
          {contract.deliverables?.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-gray-800">1.3. Entregables</p>
              <ul className="mt-1 list-disc pl-5 text-gray-700">
                {contract.deliverables.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}
          <Clause num="1.4" title="Cronograma" content={contract.timeline} />
          <Clause num="1.5" title="Exclusiones — Lo que NO incluye este contrato" content={contract.exclusions} />
        </Section>

        {/* Económico */}
        <Section title="Condiciones económicas y de pago">
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-300">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2 font-medium text-gray-600">Importe base</td>
                  <td className="px-4 py-2 text-right">{EUR(contract.amount, contract.currency)}</td>
                </tr>
                {contract.discount ? (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-medium text-gray-600">Descuento</td>
                    <td className="px-4 py-2 text-right text-red-600">– {EUR(contract.discount, contract.currency)}</td>
                  </tr>
                ) : null}
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2 font-medium text-gray-600">Base imponible</td>
                  <td className="px-4 py-2 text-right">{EUR(subtotal, contract.currency)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2 font-medium text-gray-600">IVA ({contract.tax_rate}%)</td>
                  <td className="px-4 py-2 text-right">{EUR(contract.tax_amount, contract.currency)}</td>
                </tr>
                <tr className="bg-gray-50 font-bold">
                  <td className="px-4 py-3 text-gray-900">TOTAL</td>
                  <td className="px-4 py-3 text-right text-gray-900 text-base">{EUR(contract.total_with_tax, contract.currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {contract.advance_amount && (
            <p className="mb-2"><strong>Anticipo:</strong> {EUR(contract.advance_amount, contract.currency)}{contract.advance_paid ? ' (PAGADO)' : ' (PENDIENTE)'}</p>
          )}
          {contract.payment_method && (
            <p className="mb-2"><strong>Forma de pago:</strong> {contract.payment_method}</p>
          )}

          {contract.payment_schedule?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-semibold">Calendario de pagos:</p>
              <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Concepto</th>
                    <th className="px-4 py-2 text-right">Importe</th>
                    <th className="px-4 py-2 text-center">Fecha</th>
                    <th className="px-4 py-2 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.payment_schedule.map((p, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="px-4 py-2">{p.description}</td>
                      <td className="px-4 py-2 text-right">{EUR(p.amount, contract.currency)}</td>
                      <td className="px-4 py-2 text-center">{p.due_date || '—'}</td>
                      <td className="px-4 py-2 text-center">{p.paid ? '✓ Pagado' : 'Pendiente'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Revisiones */}
        <Section title="Revisiones y cambios de alcance">
          <p className="mb-3">
            El presente contrato incluye <strong>{contract.revisions_included} revisión{contract.revisions_included !== 1 ? 'es' : ''}</strong> sin coste adicional.
            {contract.extra_revision_cost && (
              <> Cada revisión adicional tendrá un coste de <strong>{EUR(contract.extra_revision_cost, contract.currency)}</strong>.</>
            )}
          </p>
          <Clause num="3.1" title="Política de cambios de alcance" content={contract.scope_change_policy} />
        </Section>

        {/* Obligaciones */}
        <Section title="Obligaciones de las partes">
          <Clause num="4.1" title="Obligaciones del Cliente" content={contract.client_obligations} />
          <Clause num="4.2" title="Obligaciones del Proveedor" content={contract.provider_obligations} />
        </Section>

        {/* Servicios adicionales */}
        {(contract.hosting_included || contract.domain_included || contract.maintenance_included || contract.warranty_months) && (
          <Section title="Servicios adicionales y garantías">
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {contract.hosting_included && <li>Alojamiento web incluido.</li>}
              {contract.domain_included && <li>Dominio incluido.</li>}
              {contract.maintenance_included && <li>Mantenimiento incluido por {contract.maintenance_months || '—'} meses.</li>}
              {contract.warranty_months && <li>Garantía de {contract.warranty_months} meses tras la entrega. {contract.warranty_description}</li>}
            </ul>
          </Section>
        )}

        {/* Cancelación */}
        <Section title="Cancelación y reembolsos">
          <Clause num="6.1" title="Política de cancelación" content={contract.cancellation_policy} />
          <Clause num="6.2" title="Política de reembolsos" content={contract.refund_policy} />
        </Section>

        {/* Legal */}
        <Section title="Disposiciones legales">
          <Clause num="7.1" title="Propiedad intelectual" content={contract.intellectual_property} />
          <Clause num="7.2" title="Confidencialidad" content={contract.confidentiality} />
          <Clause num="7.3" title="Protección de datos" content={contract.data_protection} />
          <Clause num="7.4" title="Limitación de responsabilidad" content={contract.limitation_of_liability} />
          {contract.governing_law && <Clause num="7.5" title="Ley aplicable y jurisdicción" content={contract.governing_law} />}
          {contract.dispute_resolution && <Clause num="7.6" title="Resolución de conflictos" content={contract.dispute_resolution} />}
        </Section>

        {/* Anexos */}
        {contract.annexes?.length > 0 && (
          <Section title="Anexos">
            <ul className="list-disc pl-5 text-gray-700">
              {contract.annexes.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </Section>
        )}

        {/* Firmas */}
        <Section title="Aceptación y firmas">
          <p className="mb-6 text-sm text-gray-600">
            Las partes manifiestan haber leído, comprendido y aceptado el contenido íntegro del presente contrato,
            comprometiéndose al cumplimiento de todas las obligaciones establecidas.
          </p>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">Por El Cliente</p>
              <div className="h-16 border-b border-gray-400" />
              <p className="mt-1 text-xs text-gray-500">
                {contract.client?.name || '___________________________'}
              </p>
              {contract.client_signed && (
                <p className="text-xs text-green-700 mt-1">✓ Firmado el {contract.client_signed_date}</p>
              )}
              <p className="mt-4 text-xs text-gray-500">
                Fecha: {contract.client_signed_date || '_____ / _____ / _________'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">Por El Proveedor</p>
              <div className="h-16 border-b border-gray-400" />
              <p className="mt-1 text-xs text-gray-500">
                {contract.provider?.name || '___________________________'}
              </p>
              {contract.provider_signed && (
                <p className="text-xs text-green-700 mt-1">✓ Firmado el {contract.provider_signed_date}</p>
              )}
              <p className="mt-4 text-xs text-gray-500">
                Fecha: {contract.provider_signed_date || '_____ / _____ / _________'}
              </p>
            </div>
          </div>
        </Section>

        {/* Pie de página */}
        <div className="mt-10 border-t border-gray-300 pt-4 text-center text-xs text-gray-400">
          <p>Documento generado el {new Date().toLocaleDateString('es-ES')} · Contrato {contract.number} v{contract.version}</p>
          <p className="mt-0.5">Archethereum — Plataforma Artística</p>
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  )
}
