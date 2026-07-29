import mongoose, { Document, Model, Schema } from 'mongoose'

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'partial'

export interface IInvoiceItem {
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  subtotal: number
}

export interface IPaymentRecord {
  date: string
  amount: number
  method?: string
  note?: string
}

export interface IInvoiceHistory {
  date: string
  action: string
  user?: string
  note?: string
}

export interface IInvoice extends Document {
  number: string
  series: string
  artist_id: string
  artist_name: string

  // Client info
  client_name?: string
  client_id_number?: string
  client_address?: string
  client_email?: string

  // Items
  items: IInvoiceItem[]

  // Totals (auto-calculated)
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount: number
  discount_percentage?: number
  total: number
  amount_paid: number
  amount_pending: number

  currency: string
  exchange_rate?: number          // For multi-currency display

  status: InvoiceStatus
  issue_date: string
  due_date?: string
  paid_date?: string

  // Payment tracking
  payment_records: IPaymentRecord[]
  payment_method?: string

  // Relations
  contract_id?: string
  subscription_id?: string

  // Notes
  internal_notes?: string         // Not visible on invoice
  client_notes?: string           // Visible on invoice

  // History
  history: IInvoiceHistory[]
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit_price: { type: Number, required: true },
    tax_rate: { type: Number, default: 21 },
    subtotal: { type: Number, default: 0 },
  },
  { _id: false }
)

const PaymentRecordSchema = new Schema<IPaymentRecord>(
  {
    date: String,
    amount: Number,
    method: String,
    note: String,
  },
  { _id: false }
)

const InvoiceSchema = new Schema<IInvoice>(
  {
    number: { type: String, required: true, unique: true, index: true },
    series: { type: String, default: 'AH' },
    artist_id: { type: String, required: true, index: true },
    artist_name: { type: String, required: true },

    client_name: String,
    client_id_number: String,
    client_address: String,
    client_email: String,

    items: { type: [InvoiceItemSchema], default: [] },

    subtotal: { type: Number, default: 0 },
    tax_rate: { type: Number, default: 21 },
    tax_amount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discount_percentage: Number,
    total: { type: Number, default: 0 },
    amount_paid: { type: Number, default: 0 },
    amount_pending: { type: Number, default: 0 },

    currency: { type: String, default: 'EUR' },
    exchange_rate: Number,

    status: {
      type: String,
      enum: ['draft', 'pending', 'paid', 'overdue', 'cancelled', 'partial'],
      default: 'draft',
      index: true,
    },
    issue_date: { type: String, required: true },
    due_date: String,
    paid_date: String,

    payment_records: { type: [PaymentRecordSchema], default: [] },
    payment_method: String,

    contract_id: String,
    subscription_id: String,

    internal_notes: String,
    client_notes: String,

    history: [
      {
        date: String,
        action: String,
        user: String,
        note: String,
      },
    ],
  },
  { timestamps: true, collection: 'artisthub/invoices' }
)

InvoiceSchema.index({ status: 1, due_date: 1 })

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ||
  mongoose.model<IInvoice>('Invoice', InvoiceSchema)

export default Invoice
