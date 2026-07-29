import Invoice from '@/lib/models/Invoice';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

interface InvoiceItem { quantity: number; unit_price: number; tax_rate: number; subtotal?: number }

function calcInvoiceTotals(body: Record<string, unknown>, existing: Record<string, unknown>) {
  const items = (body.items as InvoiceItem[] | undefined) || (existing.items as InvoiceItem[]) || []
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
    subtotal = Number(body.subtotal ?? existing.subtotal) || 0
    const taxRate = Number(body.tax_rate ?? existing.tax_rate ?? 21)
    taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  }

  const discount = Number(body.discount ?? existing.discount) || 0
  const total = Math.round((subtotal + taxAmount - discount) * 100) / 100
  const amountPaid = Number(body.amount_paid ?? existing.amount_paid) || 0
  const amountPending = Math.max(0, Math.round((total - amountPaid) * 100) / 100)

  // Determine status based on payment
  let status = String(body.status ?? existing.status)
  if (amountPending <= 0 && total > 0) status = 'paid'
  else if (amountPaid > 0 && amountPending > 0) status = 'partial'

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax_amount: Math.round(taxAmount * 100) / 100,
    total,
    amount_paid: amountPaid,
    amount_pending: amountPending,
    status,
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const invoice = await Invoice.findById(id).lean()
    if (!invoice) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(invoice)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const existing = await Invoice.findById(id)
    if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const existingPlain = existing.toObject() as unknown as Record<string, unknown>
    const totals = calcInvoiceTotals(body, existingPlain)

    // Record payment if new payment was registered
    const paymentRecord = body._paymentRecord
    delete body._paymentRecord
    if (paymentRecord && paymentRecord.amount > 0) {
      existing.payment_records.push({
        date: paymentRecord.date || new Date().toISOString().slice(0, 10),
        amount: paymentRecord.amount,
        method: paymentRecord.method,
        note: paymentRecord.note,
      })
    }

    const prevStatus = existing.status
    if (body.status && body.status !== prevStatus) {
      existing.history.push({
        date: new Date().toISOString(),
        action: `Estado cambiado de "${prevStatus}" a "${body.status}"`,
        user: 'admin',
      })
    } else {
      existing.history.push({
        date: new Date().toISOString(),
        action: 'Factura actualizada',
        user: 'admin',
      })
    }

    Object.assign(existing, body, totals)
    await existing.save()
    return NextResponse.json(existing)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Invoice.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
