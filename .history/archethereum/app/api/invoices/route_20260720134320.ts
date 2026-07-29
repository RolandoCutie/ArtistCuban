import Invoice from '@/lib/models/Invoice'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

interface InvoiceItem { quantity: number; unit_price: number; tax_rate: number; subtotal?: number }

/** Recalculate all totals from line items or legacy subtotal */
function calcInvoiceTotals(body: Record<string, unknown>) {
  const items = (body.items as InvoiceItem[] | undefined) || []
  let subtotal = 0
  let taxAmount = 0

  if (items.length > 0) {
    for (const item of items) {
      const itemSubtotal = Math.round((item.quantity || 1) * (item.unit_price || 0) * 100) / 100
      item.subtotal = itemSubtotal
      subtotal += itemSubtotal
      taxAmount += Math.round(itemSubtotal * ((item.tax_rate ?? 21) / 100) * 100) / 100
    }
  } else {
    subtotal = Number(body.subtotal) || 0
    const taxRate = Number(body.tax_rate ?? 21)
    taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  }

  const discount = Number(body.discount) || 0
  const total = Math.round((subtotal + taxAmount - discount) * 100) / 100
  const amountPaid = Number(body.amount_paid) || 0
  const amountPending = Math.max(0, Math.round((total - amountPaid) * 100) / 100)

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax_amount: Math.round(taxAmount * 100) / 100,
    total,
    amount_paid: amountPaid,
    amount_pending: amountPending,
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const artist_id = searchParams.get('artist_id')
    const status = searchParams.get('status')

    const query: Record<string, unknown> = {}
    if (artist_id) query.artist_id = artist_id
    if (status) query.status = status

    const invoices = await Invoice.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(invoices)
  } catch {
    return NextResponse.json({ error: 'Error al obtener facturas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const count = await Invoice.countDocuments()
    const series = body.series || 'AH'
    const number = `${series}-${String(count + 1).padStart(5, '0')}`
    const totals = calcInvoiceTotals(body)

    const invoice = await Invoice.create({
      ...body,
      ...totals,
      number,
      history: [{ date: new Date().toISOString(), action: 'Factura creada', user: 'admin' }],
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear factura' }, { status: 500 })
  }
}
