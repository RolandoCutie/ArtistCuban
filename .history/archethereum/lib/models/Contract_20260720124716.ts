import mongoose, { Document, Model, Schema } from 'mongoose'

export type ContractStatus = 'draft' | 'pending' | 'active' | 'signed' | 'expired' | 'cancelled' | 'disputed'

export interface IContractParty {
  name: string
  id_number?: string      // DNI / NIF / CIF
  address?: string
  email?: string
  phone?: string
  legal_representative?: string
}

export interface IContractPaymentSchedule {
  description: string
  amount: number
  due_date?: string
  paid: boolean
  paid_date?: string
}

export interface IContractRevision {
  version: number
  date: string
  description: string
  author?: string
}

export interface IContractHistory {
  date: string
  action: string
  user?: string
  note?: string
  version?: number
}

export interface IContract extends Document {
  number: string
  version: number

  // Partes
  client: IContractParty
  provider: IContractParty
  artist_id: string
  artist_name: string

  // Fechas y vigencia
  date: string
  end_date?: string
  validity_days?: number
  signed_date?: string
  cancelled_date?: string

  // Estado
  status: ContractStatus
  auto_renew: boolean

  // Objeto y alcance
  subject: string                   // Objeto del contrato
  scope: string                     // Alcance del proyecto
  deliverables: string[]            // Entregables
  timeline: string                  // Cronograma
  exclusions: string                // Qué NO incluye

  // Económico
  amount: number
  currency: string
  advance_amount?: number           // Anticipo
  advance_paid: boolean
  payment_method?: string           // Transferencia, PayPal, etc.
  payment_schedule: IContractPaymentSchedule[]  // Calendario de pagos
  tax_rate?: number                 // % IVA / impuesto
  tax_amount?: number
  total_with_tax?: number
  discount?: number

  // Revisiones incluidas
  revisions_included: number
  extra_revision_cost?: number

  // Cambios de alcance
  scope_change_policy: string

  // Cancelaciones y reembolsos
  cancellation_policy: string
  refund_policy: string
  cancellation_fee?: number

  // Propiedad intelectual
  intellectual_property: string

  // Legal
  confidentiality: string
  data_protection: string
  limitation_of_liability: string
  governing_law?: string            // Ley aplicable y jurisdicción
  dispute_resolution?: string

  // Servicios adicionales
  hosting_included: boolean
  domain_included: boolean
  maintenance_included: boolean
  maintenance_months?: number
  warranty_months?: number
  warranty_description?: string

  // Obligaciones
  client_obligations: string
  provider_obligations: string

  // Firmas
  client_signed: boolean
  client_signed_date?: string
  provider_signed: boolean
  provider_signed_date?: string
  signature_platform?: string       // Para firma electrónica futura

  // Anexos
  annexes: string[]

  // Notas internas (no visibles en contrato)
  internal_notes?: string

  // Historial y versiones
  history: IContractHistory[]
  revisions: IContractRevision[]
  duration_months?: number
}

const PartySchema = new Schema<IContractParty>(
  {
    name: String,
    id_number: String,
    address: String,
    email: String,
    phone: String,
    legal_representative: String,
  },
  { _id: false }
)

const PaymentScheduleSchema = new Schema<IContractPaymentSchedule>(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    due_date: String,
    paid: { type: Boolean, default: false },
    paid_date: String,
  },
  { _id: false }
)

const ContractSchema = new Schema<IContract>(
  {
    number: { type: String, required: true, unique: true, index: true },
    version: { type: Number, default: 1 },

    client: { type: PartySchema, default: () => ({}) },
    provider: { type: PartySchema, default: () => ({}) },
    artist_id: { type: String, required: true, index: true },
    artist_name: { type: String, required: true },

    date: { type: String, required: true },
    end_date: String,
    validity_days: Number,
    signed_date: String,
    cancelled_date: String,

    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'signed', 'expired', 'cancelled', 'disputed'],
      default: 'draft',
      index: true,
    },
    auto_renew: { type: Boolean, default: false },

    subject: { type: String, default: '' },
    scope: { type: String, default: '' },
    deliverables: { type: [String], default: [] },
    timeline: { type: String, default: '' },
    exclusions: { type: String, default: '' },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'EUR' },
    advance_amount: Number,
    advance_paid: { type: Boolean, default: false },
    payment_method: String,
    payment_schedule: { type: [PaymentScheduleSchema], default: [] },
    tax_rate: { type: Number, default: 21 },
    tax_amount: Number,
    total_with_tax: Number,
    discount: Number,

    revisions_included: { type: Number, default: 2 },
    extra_revision_cost: Number,

    scope_change_policy: {
      type: String,
      default: 'Cualquier modificación fuera del alcance definido se presupuestará por separado y requerirá aprobación escrita del cliente.',
    },

    cancellation_policy: {
      type: String,
      default: 'La cancelación con más de 15 días de antelación conlleva la retención del anticipo. Cancelaciones posteriores implican el pago del 50% del importe total.',
    },
    refund_policy: {
      type: String,
      default: 'No se realizarán devoluciones sobre trabajos ya ejecutados y aprobados por el cliente.',
    },
    cancellation_fee: Number,

    intellectual_property: {
      type: String,
      default: 'Los derechos de propiedad intelectual de los entregables finales se transferirán al cliente una vez completado el pago total acordado.',
    },

    confidentiality: {
      type: String,
      default: 'Ambas partes se comprometen a mantener la confidencialidad de la información intercambiada durante la vigencia del contrato y durante los 2 años posteriores.',
    },
    data_protection: {
      type: String,
      default: 'Los datos personales serán tratados conforme al Reglamento General de Protección de Datos (RGPD) y la normativa aplicable.',
    },
    limitation_of_liability: {
      type: String,
      default: 'La responsabilidad máxima del proveedor queda limitada al importe total del contrato. No se responderá por daños indirectos, lucro cesante o pérdida de datos.',
    },
    governing_law: { type: String, default: 'España. Juzgados y Tribunales de Madrid.' },
    dispute_resolution: { type: String, default: 'Mediación previa al ejercicio de acciones judiciales.' },

    hosting_included: { type: Boolean, default: false },
    domain_included: { type: Boolean, default: false },
    maintenance_included: { type: Boolean, default: false },
    maintenance_months: Number,
    warranty_months: { type: Number, default: 3 },
    warranty_description: String,

    client_obligations: { type: String, default: '' },
    provider_obligations: { type: String, default: '' },

    client_signed: { type: Boolean, default: false },
    client_signed_date: String,
    provider_signed: { type: Boolean, default: false },
    provider_signed_date: String,
    signature_platform: String,

    annexes: { type: [String], default: [] },
    internal_notes: String,

    history: [
      {
        date: String,
        action: String,
        user: String,
        note: String,
        version: Number,
      },
    ],
    revisions: [
      {
        version: Number,
        date: String,
        description: String,
        author: String,
      },
    ],
    duration_months: Number,
  },
  { timestamps: true, collection: 'artisthub/contracts' }
)

const Contract: Model<IContract> =
  mongoose.models.Contract ||
  mongoose.model<IContract>('Contract', ContractSchema)

export default Contract
